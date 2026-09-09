'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DisplayOrder } from '@/lib/types';
import { createClient } from '@/utils/supabase/client';
import { getCounterForOrder } from '@/lib/display-utils';
import { announceOrderReady, getSoundSettings } from '@/lib/voice-announcer';

export function useRealtimeOrders() {
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const announcedTokensRef = useRef<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .in('status', ['CONFIRMED', 'PREPARING', 'READY', 'COLLECTED'])
        .order('created_at', { ascending: false })
        .limit(25);

      if (!error && data) {
        const enriched: DisplayOrder[] = data.map((o: any) => {
          return {
            ...o,
            payment_mode: 'UPI',
            counter: getCounterForOrder(o.order_items),
          };
        });
        setOrders(enriched);
      }
    } catch (e) {
      console.warn('Orders fetch error in TV Display:', e);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Check demo mode from localStorage
    if (typeof window !== 'undefined') {
      const isDemo = localStorage.getItem('foodline_demo_mode') === 'true';
      setDemoMode(isDemo);
    }

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('display-orders-live')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
          },
          async (payload: any) => {
            const updated = payload.new;
            if (!updated || !updated.id) return;

            // Fetch nested order items for this updated order
            const { data: items } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', updated.id);

            const enrichedOrder: DisplayOrder = {
              ...updated,
              payment_mode: 'UPI',
              order_items: items || [],
              counter: getCounterForOrder(items || []),
              isJustReady: updated.status === 'READY',
            };

            // Voice announcement trigger if newly transitioned to READY
            if (updated.status === 'READY' && !announcedTokensRef.current.has(updated.order_token)) {
              announcedTokensRef.current.add(updated.order_token);
              announceOrderReady(updated.order_token, enrichedOrder.counter || 1);
            }

            setOrders((prev) => {
              const idx = prev.findIndex((o) => o.id === updated.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = enrichedOrder;
                return next;
              }
              return [enrichedOrder, ...prev];
            });
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime display subscription fallback:', e);
    }
  }, [fetchOrders]);

  // Filter Derived Views (Only real orders from database)
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING' || o.status === 'CONFIRMED');
  const readyOrders = orders.filter((o) => {
    if (o.status === 'READY') return true;
    if (o.status === 'COLLECTED') {
      const timestampStr = o.updated_at || o.created_at || '';
      const orderTime = timestampStr ? new Date(timestampStr).getTime() : Date.now();
      return Date.now() - orderTime < 45000;
    }
    return false;
  });

  return {
    preparingOrders,
    readyOrders,
    allOrders: orders,
    isConnected,
    demoMode,
    setDemoMode: (val: boolean) => {
      setDemoMode(val);
      if (typeof window !== 'undefined') {
        localStorage.setItem('foodline_demo_mode', val ? 'true' : 'false');
      }
    },
    refresh: fetchOrders,
  };
}
