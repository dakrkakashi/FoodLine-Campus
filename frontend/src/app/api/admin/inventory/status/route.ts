import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';
import { getAllInventoryStatuses } from '@/lib/stock-store';
import localMenu from '@/data/menu.json';

export async function GET() {
  try {
    let items: any[] = [];

    try {
      const { data, error } = await supabase.from('menu_items').select('*').order('name');
      if (!error && data && data.length > 0) {
        items = data;
      }
    } catch (e) {
      console.warn('Supabase fetch failed in /admin/inventory/status:', e);
    }

    if (items.length === 0) {
      items = (localMenu as any[]).map((m) => ({
        id: m.id,
        name: m.name,
        category: m.category,
        tag: m.tag,
        price: m.price,
        is_available: m.isAvailable !== false,
      }));
    }

    const statuses = getAllInventoryStatuses(items);

    return NextResponse.json({
      success: true,
      data: statuses,
      meta: {
        totalItems: statuses.length,
        dailyFreshCount: statuses.filter((s) => s.inventoryType === 'daily_fresh').length,
        persistentCount: statuses.filter((s) => s.inventoryType === 'persistent').length,
        lowStockCount: statuses.filter((s) => s.isLowStock).length,
        soldOutCount: statuses.filter((s) => !s.isAvailable).length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVENTORY_STATUS_ERROR',
          message: error.message || 'Failed to fetch inventory status',
        },
      },
      { status: 500 }
    );
  }
}
