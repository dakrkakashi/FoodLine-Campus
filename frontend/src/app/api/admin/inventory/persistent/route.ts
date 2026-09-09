import { NextRequest, NextResponse } from 'next/server';
import { setPersistentStock, getPersistentStock } from '@/lib/stock-store';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both single update { itemId, stockQuantity } and batch update [{ itemId, stockQuantity }]
    const updates: { itemId: string; stockQuantity: number }[] = Array.isArray(body)
      ? body
      : body.updates && Array.isArray(body.updates)
      ? body.updates
      : [body];

    const results: { itemId: string; newStockQuantity: number }[] = [];

    for (const update of updates) {
      if (update.itemId && typeof update.stockQuantity === 'number') {
        setPersistentStock(update.itemId, update.stockQuantity);
        results.push({
          itemId: update.itemId,
          newStockQuantity: getPersistentStock(update.itemId),
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        updatedCount: results.length,
        timestamp: new Date().toISOString(),
        message: `Successfully updated stock quantities for ${results.length} items.`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PERSISTENT_STOCK_UPDATE_ERROR',
          message: error.message || 'Failed to update persistent stock levels',
        },
      },
      { status: 500 }
    );
  }
}
