import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { applyStockOverrides } from '@/lib/stock-store';
import localMenu from '@/data/menu.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    let categories: any[] = [];
    let items: any[] = [];

    try {
      const [categoriesRes, menuRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
        categoryId
          ? supabase.from('menu_items').select('*').eq('category_id', categoryId).order('name')
          : supabase.from('menu_items').select('*').order('name')
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
        category: m.category
      }));
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
