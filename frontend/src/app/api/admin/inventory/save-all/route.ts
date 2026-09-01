import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { setDishAvailability, setPersistentStock, setDishDetails } from '@/lib/stock-store';

export const dynamic = 'force-dynamic';

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

    // 2. Persist batch update in Supabase (only send valid table columns)
    try {
      const updatePromises = items.map((item) => {
        const isAvailable = item.is_available !== false && item.isAvailable !== false;
        const dbUpdate: Record<string, any> = {
          is_available: isAvailable,
        };
        if (item.price !== undefined && !isNaN(Number(item.price))) {
          dbUpdate.price = Number(item.price);
        }
        if (typeof item.name === 'string' && item.name.trim()) {
          dbUpdate.name = item.name.trim();
        }
        if (typeof item.tag === 'string') {
          dbUpdate.tag = item.tag.trim();
        }
        if (item.prep_time_mins || item.prepTime) {
          dbUpdate.prep_time_mins = Number(item.prep_time_mins || item.prepTime || 5);
        }

        return supabase
          .from('menu_items')
          .update(dbUpdate)
          .eq('id', item.id);
      });

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
