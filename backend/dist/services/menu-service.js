"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const menu_json_1 = __importDefault(require("../data/menu.json"));
const supabase_js_1 = require("../lib/supabase.js");
// In-memory local cache seeded from menu.json
let localMenuItems = menu_json_1.default.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    prepTime: item.prepTime || 5,
    tag: item.tag || '',
    isVeg: item.isVeg !== undefined ? item.isVeg : true,
    isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
    image: item.image,
    cafeteriaId: item.cafeteriaId || item.cafeteria_id || 'b2222222-2222-2222-2222-222222222222',
    cafeteria_id: item.cafeteria_id || item.cafeteriaId || 'b2222222-2222-2222-2222-222222222222',
}));
class MenuService {
    /**
     * Get all menu items with optional category and cafeteria filtering
     */
    static async getAllItems(categoryId, cafeteriaId) {
        const targetCafeteria = cafeteriaId || 'b2222222-2222-2222-2222-222222222222';
        if (supabase_js_1.isSupabaseConfigured) {
            try {
                let query = supabase_js_1.supabase.from('menu_items').select('*, categories(name)');
                if (cafeteriaId && cafeteriaId !== 'all') {
                    query = query.eq('cafeteria_id', targetCafeteria);
                }
                const { data, error } = await query;
                if (!error && data && data.length > 0) {
                    const dbItems = data.map((d) => ({
                        id: d.id,
                        name: d.name,
                        category: d.categories?.name || d.tag || 'Quick Bites',
                        price: Number(d.price),
                        prepTime: d.prep_time_mins || 5,
                        tag: d.tag || '',
                        isVeg: d.is_veg !== undefined ? d.is_veg : true,
                        isAvailable: d.is_available !== undefined ? d.is_available : true,
                        image: d.image_url,
                        cafeteriaId: d.cafeteria_id || targetCafeteria,
                        cafeteria_id: d.cafeteria_id || targetCafeteria,
                    }));
                    if (categoryId && categoryId !== 'All') {
                        return dbItems.filter((i) => i.category.toLowerCase() === categoryId.toLowerCase());
                    }
                    return dbItems;
                }
            }
            catch (err) {
                console.warn('Supabase menu fetch fallback to local cache:', err);
            }
        }
        // Fallback to local memory cache
        let filtered = localMenuItems;
        if (cafeteriaId && cafeteriaId !== 'all') {
            filtered = filtered.filter((item) => item.cafeteriaId === targetCafeteria ||
                item.cafeteria_id === targetCafeteria ||
                (targetCafeteria === 'cafe7' && item.cafeteriaId === 'b2222222-2222-2222-2222-222222222222'));
        }
        if (!categoryId || categoryId === 'All') {
            return filtered;
        }
        return filtered.filter((item) => item.category.toLowerCase() === categoryId.toLowerCase());
    }
    /**
     * Get menu item by ID
     */
    static async getItemById(id) {
        const items = await MenuService.getAllItems();
        return items.find((item) => item.id === id);
    }
    /**
     * 1-Tap stockout toggle for KDS
     */
    static async toggleAvailability(id, isAvailable) {
        const currentItem = localMenuItems.find((m) => m.id === id);
        const newStatus = isAvailable !== undefined ? isAvailable : currentItem ? !currentItem.isAvailable : false;
        // Update local cache
        if (currentItem) {
            currentItem.isAvailable = newStatus;
        }
        // Update database if configured
        if (supabase_js_1.isSupabaseConfigured) {
            try {
                await supabase_js_1.supabase
                    .from('menu_items')
                    .update({ is_available: newStatus, updated_at: new Date().toISOString() })
                    .eq('id', id);
            }
            catch (err) {
                console.warn(`Supabase toggleAvailability update skipped for ${id}:`, err);
            }
        }
        if (!currentItem) {
            throw new Error(`Menu item with ID ${id} not found`);
        }
        return currentItem;
    }
}
exports.MenuService = MenuService;
