import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { setDishAvailability, setDishDetails, setPersistentStock } from '@/lib/stock-store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ dishId: string }> }
) {
  try {
    const { dishId } = await params;
    const body = await request.json();
    const {
      isAvailable,
      is_available,
      name,
      price,
      tag,
      category,
      prep_time_mins,
      prepTime,
      description,
      stock_quantity,
      stockQuantity,
      quantity,
    } = body;

    const rawQty = stock_quantity ?? stockQuantity ?? quantity;
    const availability =
      typeof isAvailable === 'boolean'
        ? isAvailable
        : typeof is_available === 'boolean'
        ? is_available
        : undefined;

    const updates: Record<string, any> = {};

    if (rawQty !== undefined && typeof rawQty === 'number' && !isNaN(rawQty)) {
      const safeQty = Math.max(0, rawQty);
      updates.stock_quantity = safeQty;
      setPersistentStock(dishId, safeQty);

      if (safeQty === 0) {
        updates.is_available = false;
        setDishAvailability(dishId, false);
      } else if (availability === undefined && safeQty > 0) {
        updates.is_available = true;
        setDishAvailability(dishId, true);
      }
    }

    if (availability !== undefined) {
      updates.is_available = availability;
      setDishAvailability(dishId, availability);
    }
    if (typeof name === 'string' && name.trim()) {
      updates.name = name.trim();
    }
    if (typeof price === 'number' && !isNaN(price)) {
      updates.price = price;
    }
    if (typeof tag === 'string') {
      updates.tag = tag.trim();
    }
    if (typeof category === 'string') {
      updates.category = category.trim();
    }
    if (typeof prep_time_mins === 'number' && !isNaN(prep_time_mins)) {
      updates.prep_time_mins = prep_time_mins;
    } else if (typeof prepTime === 'number' && !isNaN(prepTime)) {
      updates.prep_time_mins = prepTime;
    }
    if (typeof description === 'string') {
      updates.description = description.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PAYLOAD',
            message: 'No valid dish fields provided to update.',
          },
        },
        { status: 400 }
      );
    }

    // 1. Update live in-memory & disk overrides
    setDishDetails(dishId, updates);

    // 2. Best-effort Supabase PostgreSQL sync (only send valid table columns)
    try {
      const dbUpdates: Record<string, any> = {};
      if (updates.is_available !== undefined) dbUpdates.is_available = updates.is_available;
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.tag !== undefined) dbUpdates.tag = updates.tag;
      if (updates.prep_time_mins !== undefined) dbUpdates.prep_time_mins = updates.prep_time_mins;
      if (updates.image_url !== undefined) dbUpdates.image_url = updates.image_url;

      if (Object.keys(dbUpdates).length > 0) {
        await supabase
          .from('menu_items')
          .update(dbUpdates)
          .eq('id', dishId);
      }
    } catch (dbErr) {
      console.warn('Supabase DB dish update warning (using memory override):', dbErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: dishId,
        ...updates,
        isAvailable: updates.is_available !== undefined ? updates.is_available : undefined,
        stockQuantity: updates.stock_quantity,
        updated_at: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
        message: `Dish ${dishId} updated successfully`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVENTORY_UPDATE_ERROR',
          message: error.message || 'Failed to update dish',
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ dishId: string }> }
) {
  return PATCH(request, context);
}
