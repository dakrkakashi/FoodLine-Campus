import { MenuItem } from '../lib/types.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import initialMenuData from '../data/menu.json';

// Real Cafeteria UUID for Cafe @7 in Supabase
const PRIMARY_CAFETERIA_ID = '754bd902-cafb-40a6-9cdd-96bc8760ad7f';

interface CacheEntry {
  items: MenuItem[];
  timestamp: number;
}

// 30-Second TTL in-memory read-through cache for sub-10ms response times
let cachedMenu: CacheEntry | null = null;
const CACHE_TTL_MS = 30 * 1000;

export class MenuService {
  /**
   * Resolve various canteen identifiers/slugs to valid database UUID
   */
  public static resolveCafeteriaId(cafeteriaId?: string): string {
    if (!cafeteriaId || cafeteriaId === 'all' || cafeteriaId === 'cafe7' || cafeteriaId === 'b2222222-2222-2222-2222-222222222222') {
      return PRIMARY_CAFETERIA_ID;
    }
    return cafeteriaId;
  }

  /**
   * Fetch all menu items directly from Supabase PostgreSQL with high-speed read-through caching
   */
  public static async getAllItems(categoryId?: string, cafeteriaId?: string, forceRefresh = false): Promise<MenuItem[]> {
    const targetCafeteria = MenuService.resolveCafeteriaId(cafeteriaId);
    const now = Date.now();

    // Check high-speed cache
    let allItems: MenuItem[] = [];
    if (!forceRefresh && cachedMenu && now - cachedMenu.timestamp < CACHE_TTL_MS) {
      allItems = cachedMenu.items;
    } else if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('id, name, tag, price, prep_time_mins, is_available, image_url, cafeteria_id, categories(name)')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          allItems = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            category: d.categories?.name || d.tag || 'Quick Bites & Chaat',
            price: Number(d.price),
            prepTime: d.prep_time_mins || 5,
            tag: d.tag || '',
            isVeg: true,
            isAvailable: d.is_available !== false,
            image: d.image_url || null,
            cafeteriaId: d.cafeteria_id || PRIMARY_CAFETERIA_ID,
            cafeteria_id: d.cafeteria_id || PRIMARY_CAFETERIA_ID,
          }));

          cachedMenu = { items: allItems, timestamp: now };
        } else if (error) {
          console.error('[MenuService] Supabase menu query error:', error.message);
        }
      } catch (err: any) {
        console.error('[MenuService] Failed to query menu_items from Supabase:', err?.message || err);
      }
    }

    // If cache was populated, filter by cafeteria and category
    let filtered = allItems;
    if (cafeteriaId && cafeteriaId !== 'all') {
      filtered = filtered.filter(
        (item) => item.cafeteriaId === targetCafeteria || item.cafeteria_id === targetCafeteria
      );
      if (filtered.length === 0 && targetCafeteria !== PRIMARY_CAFETERIA_ID) {
        const seedItems = ((initialMenuData as any[]) || [])
          .filter((item) => item.cafeteriaId === targetCafeteria || item.cafeteria_id === targetCafeteria)
          .map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category || 'Specialty Menu',
            price: item.price,
            prepTime: item.prepTime || 5,
            tag: item.tag || '',
            isVeg: item.isVeg !== undefined ? item.isVeg : true,
            isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
            image: item.image,
            cafeteriaId: targetCafeteria,
            cafeteria_id: targetCafeteria,
          }));
        filtered = seedItems;
      }
    }

    if (categoryId && categoryId !== 'All') {
      const cleanCat = categoryId.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const itemCat = item.category.toLowerCase().trim();
        return itemCat === cleanCat || itemCat.includes(cleanCat) || cleanCat.includes(itemCat);
      });
    }

    return filtered;
  }

  /**
   * Get menu item by ID
   */
  public static async getItemById(id: string): Promise<MenuItem | undefined> {
    const items = await MenuService.getAllItems();
    return items.find((item) => item.id === id);
  }

  /**
   * 1-Tap stockout toggle for KDS: Atomically updates Supabase PostgreSQL menu_items
   */
  public static async toggleAvailability(id: string, isAvailable?: boolean): Promise<MenuItem> {
    // 1. Invalidate cache immediately
    cachedMenu = null;

    // 2. Fetch current status if new status not specified
    let newStatus = isAvailable;
    if (newStatus === undefined) {
      const { data } = await supabase.from('menu_items').select('is_available').eq('id', id).single();
      newStatus = data ? !data.is_available : false;
    }

    // 3. Update database atomically
    const { data: updated, error } = await supabase
      .from('menu_items')
      .update({ is_available: newStatus })
      .eq('id', id)
      .select('*, categories(name)')
      .single();

    if (error || !updated) {
      throw new Error(error?.message || `Menu item with ID ${id} not found in database.`);
    }

    return {
      id: updated.id,
      name: updated.name,
      category: updated.categories?.name || updated.tag || 'Quick Bites & Chaat',
      price: Number(updated.price),
      prepTime: updated.prep_time_mins || 5,
      tag: updated.tag || '',
      isVeg: true,
      isAvailable: updated.is_available !== false,
      image: updated.image_url || null,
      cafeteriaId: updated.cafeteria_id,
      cafeteria_id: updated.cafeteria_id,
    };
  }
}
