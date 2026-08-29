import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST() {
  try {
    const { data: cafe } = await supabase.from('cafeterias').select('id').limit(1).single();
    const cafeteriaId = cafe?.id || null;

    const mockSeedOrders = [
      {
        token: `FL-${Math.floor(1800 + Math.random() * 200)}`,
        status: 'READY',
        items: [
          { name: 'Special Tea', qty: 2, price: 20 },
          { name: 'Cold Coffee', qty: 1, price: 50 },
        ],
      },
      {
        token: `FL-${Math.floor(1800 + Math.random() * 200)}`,
        status: 'READY',
        items: [
          { name: 'Cheese Grilled Sandwich', qty: 1, price: 80 },
          { name: 'French Fries', qty: 1, price: 60 },
        ],
      },
      {
        token: `FL-${Math.floor(1800 + Math.random() * 200)}`,
        status: 'PREPARING',
        items: [{ name: 'Amritsari Chole Bhature', qty: 1, price: 90 }],
      },
      {
        token: `FL-${Math.floor(1800 + Math.random() * 200)}`,
        status: 'PREPARING',
        items: [
          { name: 'Mumbai Vada Pav', qty: 2, price: 20 },
          { name: 'Special Tea', qty: 1, price: 20 },
        ],
      },
      {
        token: `FL-${Math.floor(1800 + Math.random() * 200)}`,
        status: 'PREPARING',
        items: [
          { name: 'Butter Masala Dosa', qty: 1, price: 70 },
          { name: 'Cold Chocolate', qty: 1, price: 40 },
        ],
      },
    ];

    const insertedOrders: any[] = [];

    for (const seed of mockSeedOrders) {
      const totalAmount = seed.items.reduce((s, i) => s + i.price * i.qty, 0);
      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      try {
        const { data: order } = await supabase
          .from('orders')
          .insert({
            order_token: seed.token,
            cafeteria_id: cafeteriaId,
            total_amount: totalAmount,
            status: seed.status,
            pickup_otp: otp,
          })
          .select()
          .single();

        if (order) {
          const itemInserts = seed.items.map((i) => ({
            order_id: order.id,
            item_name: i.name,
            quantity: i.qty,
            unit_price: i.price,
            subtotal: i.price * i.qty,
          }));

          await supabase.from('order_items').insert(itemInserts);
          insertedOrders.push(order);
        }
      } catch (e) {
        console.warn('Seed insert fallback:', e);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        seededCount: insertedOrders.length,
        orders: insertedOrders,
      },
      meta: {
        timestamp: new Date().toISOString(),
        message: 'Successfully seeded TV display mock demo orders.',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SEED_ERROR',
          message: error.message || 'Failed to seed mock display orders',
        },
      },
      { status: 500 }
    );
  }
}
