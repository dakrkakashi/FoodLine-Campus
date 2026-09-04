import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { applyStockOverrides } from '@/lib/stock-store';
import localMenu from '@/data/menu.json';

const DEFAULT_CATEGORIES = [
  { id: '90421a73-2da6-4eda-bd5a-96a14d02d87f', name: 'Quick Bites & Chaat', icon: '🥪', display_order: 1 },
  { id: 'd7b7aefc-7ff3-41ac-b35f-08dd0045f955', name: 'South & North Indian', icon: '🥞', display_order: 2 },
  { id: 'f71276ce-2b56-4e1d-bd2c-989af0ca40a9', name: 'Loaded Sandwiches', icon: '🥪', display_order: 3 },
  { id: '8401f019-6824-43c3-a547-8a94f8db4fbf', name: 'Momos & Burgers', icon: '🍔', display_order: 4 },
  { id: 'ecbfe374-85de-49ae-9ef4-c50e6d09ceb2', name: 'Fries & Pastas', icon: '🍟', display_order: 5 },
  { id: 'c18b1f3b-ef90-4af4-ae42-55cff317d933', name: 'Garlic Bread & Pizzas', icon: '🍕', display_order: 6 },
  { id: 'fa7bd8b6-0dcc-4373-a772-ceeaa303f4c8', name: 'Maggi, Chinese & Rice', icon: '🍜', display_order: 7 },
  { id: '4acbbcc3-8c0f-45e0-bb9f-040721702aea', name: 'Beverages & Desserts', icon: '☕', display_order: 8 },
];

function resolveDishCategory(rawCategory: string | undefined, rawCategoryId: string | undefined, categoriesList: any[]) {
  if (rawCategoryId) {
    const matchedById = categoriesList.find((c) => c.id === rawCategoryId);
    if (matchedById) {
      return { category: matchedById.name, category_id: matchedById.id };
    }
  }

  const norm = (rawCategory || '').trim().toLowerCase();
  let targetName = 'Quick Bites & Chaat';

  if (norm.includes('quick') || norm.includes('chaat')) {
    targetName = 'Quick Bites & Chaat';
  } else if (norm.includes('south') || norm.includes('north') || norm.includes('indian')) {
    targetName = 'South & North Indian';
  } else if (norm.includes('sandwich') || norm.includes('roll')) {
    targetName = 'Loaded Sandwiches';
  } else if (norm.includes('momo') || norm.includes('burger')) {
    targetName = 'Momos & Burgers';
  } else if (norm.includes('frie') || norm.includes('pasta')) {
    targetName = 'Fries & Pastas';
  } else if (norm.includes('garlic') || norm.includes('bread') || norm.includes('pizza')) {
    targetName = 'Garlic Bread & Pizzas';
  } else if (norm.includes('maggi') || norm.includes('chinese') || norm.includes('rice') || norm.includes('noodle')) {
    targetName = 'Maggi, Chinese & Rice';
  } else if (
    norm.includes('beverage') ||
    norm.includes('dessert') ||
    norm.includes('shake') ||
    norm.includes('coffee') ||
    norm.includes('tea') ||
    norm.includes('drink')
  ) {
    targetName = 'Beverages & Desserts';
  }

  const matched = categoriesList.find((c) => c.name.toLowerCase() === targetName.toLowerCase()) || categoriesList[0];
  return {
    category: matched ? matched.name : (rawCategory || 'Quick Bites & Chaat'),
    category_id: matched ? matched.id : undefined,
  };
}

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

      if (!categoriesRes.error && categoriesRes.data && categoriesRes.data.length > 0) {
        categories = categoriesRes.data;
      }
      if (!menuRes.error && menuRes.data && menuRes.data.length > 0) {
        items = menuRes.data;
      }
    } catch (dbErr) {
      console.warn('Supabase menu fetch warning, using fallback:', dbErr);
    }

    const finalCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

    // Fallback if Supabase was empty
    if (items.length === 0) {
      items = (localMenu as any[]).map((m) => {
        const catInfo = resolveDishCategory(m.category, m.category_id, finalCategories);
        return {
          id: m.id,
          name: m.name,
          tag: m.tag || m.category,
          price: m.price,
          prep_time_mins: m.prepTime || 5,
          is_available: m.isAvailable !== false,
          image_url: m.image || null,
          category: catInfo.category,
          category_id: catInfo.category_id,
          cafeteria_id: m.cafeteriaId || m.cafeteria_id || 'b2222222-2222-2222-2222-222222222222',
        };
      });

      if (cafeteriaId && cafeteriaId !== 'all') {
        items = items.filter(
          (i) =>
            i.cafeteria_id === cafeteriaId ||
            (cafeteriaId === 'cafe7' && i.cafeteria_id === 'b2222222-2222-2222-2222-222222222222')
        );
      }

      if (categoryId && categoryId !== 'All') {
        items = items.filter(
          (i) =>
            i.category_id === categoryId ||
            i.category?.toLowerCase() === categoryId.toLowerCase()
        );
      }
    } else {
      // Ensure all items have both category and category_id
      items = items.map((i) => {
        const catInfo = resolveDishCategory(i.category, i.category_id, finalCategories);
        return {
          ...i,
          category: catInfo.category,
          category_id: catInfo.category_id,
        };
      });
    }

    // Apply live stockout overrides
    const finalizedItems = applyStockOverrides(items);

    return NextResponse.json({
      success: true,
      data: {
        categories: finalCategories,
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
