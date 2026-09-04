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
      try {
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
      } catch (fetchErr) {
        console.warn('Initial order stream fetch warning:', fetchErr);
      }

      // 2. Realtime listener with unique channel identifier
      const channelName = `order-stream-${token}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      let channel: any = null;

      try {
        channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'orders',
              filter: `order_token=eq.${token}`
            },
            (payload) => {
              try {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'ORDER_UPDATE', payload: payload.new, order: payload.new })}\n\n`)
                );
              } catch (e) {
                console.error('Failed to enqueue order update:', e);
              }
            }
          )
          .subscribe();
      } catch (subErr) {
        console.warn('Supabase realtime subscribe warning:', subErr);
      }

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
        if (channel) {
          try {
            supabase.removeChannel(channel);
          } catch {
            // ignore
          }
        }
        try {
          controller.close();
        } catch {
          // ignore
        }
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

