import { MenuItem } from '../lib/types.js';
import initialMenuData from '../data/menu.json';

// In-memory active menu store
let menuItems: MenuItem[] = [...initialMenuData];

export class MenuService {
  public static getAllItems(categoryId?: string): MenuItem[] {
    if (!categoryId || categoryId === 'All') {
      return menuItems;
    }
    return menuItems.filter((item) => item.category.toLowerCase() === categoryId.toLowerCase());
  }

  public static getItemById(id: string): MenuItem | undefined {
    return menuItems.find((item) => item.id === id);
  }

  public static toggleAvailability(id: string, isAvailable?: boolean): MenuItem {
    const item = menuItems.find((m) => m.id === id);
    if (!item) {
      throw new Error(`Menu item with ID ${id} not found`);
    }

    item.isAvailable = isAvailable !== undefined ? isAvailable : !item.isAvailable;
    return item;
  }
}
