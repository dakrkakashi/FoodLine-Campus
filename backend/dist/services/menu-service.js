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
}));
class MenuService {
    /**
     * Get all menu items with optional category filtering
     */
    static async getAllItems(categoryId) {
        if (supabase_js_1.isSupabaseConfigured) {
            try {
                let query = supabase_js_1.supabase.from('menu_items').select('*, categories(name)');
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
        if (!categoryId || categoryId === 'All') {
            return localMenuItems;
        }
        return localMenuItems.filter((item) => item.category.toLowerCase() === categoryId.toLowerCase());
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
