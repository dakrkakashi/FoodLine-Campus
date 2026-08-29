import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { setDishDetails, setPersistentStock, setDishAvailability } from '@/lib/stock-store';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CSV_HEADERS = [
  'name',
  'category',
  'price',
  'tag',
  'prep_time_mins',
  'stock_quantity',
  'is_available',
];

const SAMPLE_ROWS = [
  ['Masala Dosa', 'South Indian', '50', 'Bestseller', '6', '30', 'true'],
  ['Cold Coffee', 'Beverages', '50', 'Student Fav', '3', '50', 'true'],
  ['Cheese Burst Burger', 'Momos & Burgers', '90', 'Chef Special', '8', '25', 'true'],
];

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * GET /api/admin/inventory/csv?action=sample  → Download sample CSV template
 * GET /api/admin/inventory/csv?action=export  → Download current inventory CSV
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'sample';

    if (action === 'sample') {
      const lines = [CSV_HEADERS.join(',')];
      for (const row of SAMPLE_ROWS) {
        lines.push(row.map(escapeCSV).join(','));
      }
      const csv = lines.join('\n');

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="foodline_inventory_template.csv"',
        },
      });
    }

    if (action === 'export') {
      // Fetch categories map
      const { data: categories } = await supabase.from('categories').select('id, name');
      const catMap = new Map<string, string>();
      (categories || []).forEach((c: any) => catMap.set(c.id, c.name));

      // Fetch all menu items from Supabase
      const { data: items, error } = await supabase
        .from('menu_items')
        .select('id, name, category_id, price, tag, prep_time_mins, is_available')
        .order('name');

      if (error) {
        return NextResponse.json(
          { success: false, error: { message: 'Failed to fetch inventory from database: ' + error.message } },
          { status: 500 }
        );
      }

      const rows = (items || []).map((item: any) => [
        String(item.name || ''),
        String(catMap.get(item.category_id) || 'Kitchen Specials'),
        String(item.price || 0),
        String(item.tag || ''),
        String(item.prep_time_mins || 5),
        '30',
        String(item.is_available !== false),
      ]);

      const lines = [CSV_HEADERS.join(',')];
      for (const row of rows) {
        lines.push(row.map(escapeCSV).join(','));
      }
      const csv = lines.join('\n');

      const dateStr = new Date().toISOString().split('T')[0];
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="foodline_inventory_${dateStr}.csv"`,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: { message: 'Invalid action. Use ?action=sample or ?action=export' } },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'CSV export failed' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory/csv — Upload CSV to batch-upsert inventory
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { message: 'No file uploaded. Send a CSV file as "file" in multipart form data.' } },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, error: { message: 'CSV must have a header row and at least one data row.' } },
        { status: 400 }
      );
    }

    // Parse header
    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
    const nameIdx = headers.indexOf('name');
    const categoryIdx = headers.indexOf('category');
    const priceIdx = headers.indexOf('price');
    const tagIdx = headers.indexOf('tag');
    const prepIdx = headers.indexOf('prep_time_mins');
    const stockIdx = headers.indexOf('stock_quantity');
    const availIdx = headers.indexOf('is_available');

    if (nameIdx === -1 || priceIdx === -1) {
      return NextResponse.json(
        { success: false, error: { message: 'CSV must have at least "name" and "price" columns.' } },
        { status: 400 }
      );
    }

    // Fetch existing categories map
    const { data: categories } = await supabase.from('categories').select('id, name');
    const catMap = new Map<string, string>();
    (categories || []).forEach((c: any) => catMap.set(c.name.toLowerCase().trim(), c.id));

    // Get cafeteria ID
    const { data: cafe } = await supabase.from('cafeterias').select('id').limit(1).single();
    const cafeteriaId = cafe?.id || null;

    const inserted: string[] = [];
    const failed: { row: number; name: string; reason: string }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      const name = cols[nameIdx]?.trim();
      const price = parseFloat(cols[priceIdx] || '0');

      if (!name || name.length === 0) {
        failed.push({ row: i + 1, name: '(empty)', reason: 'Missing dish name' });
        continue;
      }
      if (isNaN(price) || price <= 0) {
        failed.push({ row: i + 1, name, reason: 'Invalid or missing price' });
        continue;
      }

      const categoryName = categoryIdx >= 0 ? (cols[categoryIdx]?.trim() || '') : '';
      const tag = tagIdx >= 0 ? (cols[tagIdx]?.trim() || '') : '';
      const prepTime = prepIdx >= 0 ? parseInt(cols[prepIdx] || '5', 10) : 5;
      const stockQty = stockIdx >= 0 ? parseInt(cols[stockIdx] || '30', 10) : 30;
      const isAvailable = availIdx >= 0 ? (cols[availIdx]?.trim().toLowerCase() !== 'false') : true;

      // Find matching category_id
      let categoryId: string | null = null;
      if (categoryName) {
        const lower = categoryName.toLowerCase();
        for (const [cName, cId] of catMap.entries()) {
          if (cName.includes(lower) || lower.includes(cName)) {
            categoryId = cId;
            break;
          }
        }
      }

      try {
        const { data: insertedDish, error: insertErr } = await supabase
          .from('menu_items')
          .insert({
            cafeteria_id: cafeteriaId,
            category_id: categoryId,
            name,
            tag: tag || null,
            price,
            prep_time_mins: isNaN(prepTime) ? 5 : prepTime,
            is_available: isAvailable,
          })
          .select('id')
          .single();

        if (insertErr) {
          failed.push({ row: i + 1, name, reason: insertErr.message });
        } else {
          inserted.push(name);
          if (insertedDish?.id) {
            setDishAvailability(insertedDish.id, isAvailable);
            setPersistentStock(insertedDish.id, isNaN(stockQty) ? 30 : stockQty);
            setDishDetails(insertedDish.id, {
              name,
              category: categoryName || 'Kitchen Specials',
              tag,
              price,
              prep_time_mins: isNaN(prepTime) ? 5 : prepTime,
              stock_quantity: isNaN(stockQty) ? 30 : stockQty,
              is_available: isAvailable,
            });
          }
        }
      } catch (e: any) {
        failed.push({ row: i + 1, name, reason: e.message || 'Unknown error' });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalRows: lines.length - 1,
        insertedCount: inserted.length,
        failedCount: failed.length,
        insertedDishes: inserted,
        failures: failed,
      },
      message: `Successfully imported ${inserted.length} dishes. ${failed.length > 0 ? `${failed.length} rows failed.` : ''}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'CSV upload failed' } },
      { status: 500 }
    );
  }
}
