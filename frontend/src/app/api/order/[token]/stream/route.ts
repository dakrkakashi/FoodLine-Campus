import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // 1. Initial order fetch
      const { data: initialOrder } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          pickup_slots (*)
        `)
        .eq('order_token', token)
        .single();

      if (initialOrder) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'ORDER_SNAPSHOT', payload: initialOrder, order: initialOrder })}\n\n`)
        );
      }

      // 2. Realtime listener
      const channel = supabase
        .channel(`order-stream-${token}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `order_token=eq.${token}`
          },
          (payload) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'ORDER_UPDATE', payload: payload.new, order: payload.new })}\n\n`)
            );
          }
        )
        .subscribe();

      // Keepalive heartbeat
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 15000);

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        supabase.removeChannel(channel);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
