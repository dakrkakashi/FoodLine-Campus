"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const menu_json_1 = __importDefault(require("../data/menu.json"));
// In-memory active menu store
let menuItems = [...menu_json_1.default];
class MenuService {
    static getAllItems(categoryId) {
        if (!categoryId || categoryId === 'All') {
            return menuItems;
        }
        return menuItems.filter((item) => item.category.toLowerCase() === categoryId.toLowerCase());
    }
    static getItemById(id) {
        return menuItems.find((item) => item.id === id);
    }
    static toggleAvailability(id, isAvailable) {
        const item = menuItems.find((m) => m.id === id);
        if (!item) {
            throw new Error(`Menu item with ID ${id} not found`);
        }
        item.isAvailable = isAvailable !== undefined ? isAvailable : !item.isAvailable;
        return item;
    }
}
exports.MenuService = MenuService;
