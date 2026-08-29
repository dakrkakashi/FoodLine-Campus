import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { setDishAvailability, setPersistentStock, setDishDetails } from '@/lib/stock-store';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'items must be a non-empty array' } },
        { status: 400 }
      );
    }

    // 1. Instantly update in-memory & disk inventory store for each dish
    for (const item of items) {
      const isAvailable = item.is_available !== false && item.isAvailable !== false;
      const stockQty = Math.max(0, Number(item.stock_quantity ?? item.stockQuantity ?? (isAvailable ? 30 : 0)));

      setDishAvailability(item.id, isAvailable);
      setPersistentStock(item.id, stockQty);
      setDishDetails(item.id, {
        name: item.name,
        price: item.price,
        is_available: isAvailable,
        stock_quantity: stockQty,
        tag: item.tag,
        category: item.category,
        prep_time_mins: item.prep_time_mins || item.prepTime || 5,
      });
    }

    // 2. Persist batch update in Supabase
    try {
      const updatePromises = items.map((item) =>
        supabase
          .from('menu_items')
          .update({
            is_available: item.is_available !== false && item.isAvailable !== false,
            stock_quantity: Math.max(0, Number(item.stock_quantity ?? item.stockQuantity ?? 30)),
            price: Number(item.price) || undefined,
            name: item.name || undefined,
            tag: item.tag || undefined,
            category: item.category || undefined,
          })
          .eq('id', item.id)
      );

      await Promise.allSettled(updatePromises);
    } catch (dbErr) {
      console.warn('Batch Supabase inventory update warning:', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        savedCount: items.length,
        timestamp: new Date().toISOString(),
      },
      message: `Successfully saved and broadcasted inventory status for ${items.length} dishes across campus.`,
    });
  } catch (error: any) {
    console.error('Save all inventory error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to save inventory' } },
      { status: 500 }
    );
  }
}
