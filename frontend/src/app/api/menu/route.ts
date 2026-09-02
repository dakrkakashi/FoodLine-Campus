import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { applyStockOverrides } from '@/lib/stock-store';
import localMenu from '@/data/menu.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || searchParams.get('category');
    const cafeteriaId = searchParams.get('cafeteriaId') || searchParams.get('canteenId') || 'b2222222-2222-2222-2222-222222222222';

    let categories: any[] = [];
    let items: any[] = [];

    try {
      let menuQuery = supabase.from('menu_items').select('*');
      if (cafeteriaId && cafeteriaId !== 'all') {
        menuQuery = menuQuery.eq('cafeteria_id', cafeteriaId);
      }
      if (categoryId && categoryId !== 'All') {
        menuQuery = menuQuery.eq('category_id', categoryId);
      }

      const [categoriesRes, menuRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        menuQuery.order('name')
      ]);

      if (!categoriesRes.error && categoriesRes.data) {
        categories = categoriesRes.data;
      }
      if (!menuRes.error && menuRes.data && menuRes.data.length > 0) {
        items = menuRes.data;
      }
    } catch (dbErr) {
      console.warn('Supabase menu fetch warning, using fallback:', dbErr);
    }

    // Fallback if Supabase was empty
    if (items.length === 0) {
      items = (localMenu as any[]).map((m) => ({
        id: m.id,
        name: m.name,
        tag: m.tag || m.category,
        price: m.price,
        prep_time_mins: m.prepTime || 5,
        is_available: m.isAvailable !== false,
        image_url: m.image || null,
        category: m.category,
        cafeteria_id: m.cafeteriaId || m.cafeteria_id || 'b2222222-2222-2222-2222-222222222222',
      }));

      if (cafeteriaId && cafeteriaId !== 'all') {
        items = items.filter(
          (i) =>
            i.cafeteria_id === cafeteriaId ||
            (cafeteriaId === 'cafe7' && i.cafeteria_id === 'b2222222-2222-2222-2222-222222222222')
        );
      }

      if (categoryId && categoryId !== 'All') {
        items = items.filter((i) => i.category?.toLowerCase() === categoryId.toLowerCase());
      }
    }

    // Apply live stockout overrides
    const finalizedItems = applyStockOverrides(items);

    return NextResponse.json({
      success: true,
      data: {
        categories,
        items: finalizedItems
      },
      meta: {
        totalItems: finalizedItems.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'MENU_FETCH_ERROR',
          message: error.message || 'Failed to fetch menu items'
        }
      },
      { status: 500 }
    );
  }
}
