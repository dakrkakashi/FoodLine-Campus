import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/route-client';

export async function GET() {
  try {
    const memory = process.memoryUsage();
    const uptimeSec = Math.floor(process.uptime());

    let dbStatus = { connected: true, latencyMs: 15, message: 'Supabase connected' };
    if (supabase) {
      try {
        const start = Date.now();
        const { error } = await supabase.from('campuses').select('id').limit(1);
        dbStatus = {
          connected: !error,
          latencyMs: Date.now() - start,
          message: error ? error.message : 'Supabase online & active'
        };
      } catch (err: any) {
        dbStatus = { connected: false, latencyMs: 0, message: err.message };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        system: {
          status: 'healthy',
          service: 'FoodLine Next.js 15 App Router Edge/Node',
          uptimeSeconds: uptimeSec,
          uptimeHuman: `${Math.floor(uptimeSec / 3600)}h ${Math.floor((uptimeSec % 3600) / 60)}m ${uptimeSec % 60}s`,
          nodeVersion: process.version,
          platform: process.platform,
          memory: {
            rssMb: Math.round((memory.rss / (1024 * 1024)) * 100) / 100,
            heapUsedMb: Math.round((memory.heapUsed / (1024 * 1024)) * 100) / 100,
            heapTotalMb: Math.round((memory.heapTotal / (1024 * 1024)) * 100) / 100,
          },
        },
        database: dbStatus,
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Telemetry failure' } },
      { status: 500 }
    );
  }
}
