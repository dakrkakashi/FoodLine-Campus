import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { setBulkInventoryState } from '@/lib/stock-store';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, category } = body;

    if (!action || !['ALL_IN_STOCK', 'ALL_OUT_OF_STOCK'].includes(action)) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid action. Must be ALL_IN_STOCK or ALL_OUT_OF_STOCK' } },
        { status: 400 }
      );
    }

    const isAvailable = action === 'ALL_IN_STOCK';
    const defaultQty = isAvailable ? 30 : 0;

    // 1. Instantly update in-memory & disk inventory store
    setBulkInventoryState(action, defaultQty, category);

    let updateQuery = supabase.from('menu_items').update({
      is_available: isAvailable,
    });

    if (category && category !== 'ALL') {
      const { data: catRow } = await supabase.from('categories').select('id').ilike('name', `%${category}%`).limit(1).single();
      if (catRow?.id) {
        updateQuery = updateQuery.eq('category_id', catRow.id);
      } else {
        updateQuery = updateQuery.neq('id', '00000000-0000-0000-0000-000000000000');
      }
    } else {
      updateQuery = updateQuery.neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { data, error } = await updateQuery.select();

    if (error) {
      console.warn('Bulk inventory update in Supabase warning:', error.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        isAvailable,
        stockQuantity: defaultQty,
        updatedCount: data?.length || 0,
      },
      message: isAvailable
        ? `All dishes have been marked IN STOCK (30 units each)`
        : `All dishes have been marked OUT OF STOCK (Sold Out)`,
    });
  } catch (error: any) {
    console.error('Bulk stock toggle error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Bulk inventory update failed' } },
      { status: 500 }
    );
  }
}
