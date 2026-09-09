import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['PENDING_PAYMENT', 'CONFIRMED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: `Status must be one of: ${validStatuses.join(', ')}`
          }
        },
        { status: 400 }
      );
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const updatePayload = {
      status,
      updated_at: new Date().toISOString()
    };

    let updatedOrder: any = null;
    let queryError: any = null;

    if (isUuid) {
      const { data, error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .maybeSingle();
      updatedOrder = data;
      queryError = error;
    } else {
      const { data, error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('order_token', id)
        .select()
        .maybeSingle();
      updatedOrder = data;
      queryError = error;
    }

    if (queryError) {
      console.error('KDS Order status update error:', queryError);
      throw queryError;
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder || { id, status }
    });
  } catch (error: any) {
    console.error('KDS update handler error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'KDS_UPDATE_ERROR',
          message: error.message || 'Failed to update order status'
        }
      },
      { status: 500 }
    );
  }
}

