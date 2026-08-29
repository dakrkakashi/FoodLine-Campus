import { NextRequest, NextResponse } from 'next/server';
import { setMorningFreshBatch } from '@/lib/stock-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, dailyFreshItemIds } = body;

    if (!Array.isArray(dailyFreshItemIds)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PAYLOAD',
            message: 'dailyFreshItemIds must be an array of string dish IDs.',
          },
        },
        { status: 400 }
      );
    }

    const todayDate = date || new Date().toISOString().split('T')[0];
    setMorningFreshBatch(dailyFreshItemIds, todayDate);

    return NextResponse.json({
      success: true,
      data: {
        date: todayDate,
        activeFreshDishesCount: dailyFreshItemIds.length,
        itemIds: dailyFreshItemIds,
      },
      meta: {
        timestamp: new Date().toISOString(),
        message: `Successfully configured today's fresh batch with ${dailyFreshItemIds.length} dishes.`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'MORNING_PREP_ERROR',
          message: error.message || 'Failed to save morning prep batch',
        },
      },
      { status: 500 }
    );
  }
}
