import { Order } from '../lib/types.js';
import { sseBroadcaster } from './sse-broadcaster.js';

export interface WebhookPayload {
  event: 'ORDER_READY' | 'ORDER_COLLECTED' | 'ORDER_CREATED';
  orderToken: string;
  orderId: string;
  studentName?: string;
  studentPrn?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  cafeteriaId?: string;
  pickupOtp?: string;
  timestamp: string;
  soundAlertTriggered: boolean;
}

export interface NotificationLog {
  id: string;
  orderToken: string;
  event: string;
  status: 'SENT' | 'FAILED' | 'SKIPPED';
  destination?: string;
  timestamp: string;
  latencyMs?: number;
}

export class NotificationService {
  private static notificationLogs: NotificationLog[] = [];

  /**
   * Dispatch push/webhook and sound trigger when an order is transitioned to READY
   */
  public static async dispatchOrderReadyAlert(order: Order): Promise<void> {
    const webhookUrl = process.env.ORDER_READY_WEBHOOK_URL;
    const now = new Date().toISOString();
    const logId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const startTime = Date.now();

    const payload: WebhookPayload = {
      event: 'ORDER_READY',
      orderToken: order.orderToken,
      orderId: order.id,
      studentName: order.studentName,
      studentPrn: order.studentPrn,
      items: (order.items || []).map((i) => ({
        name: i.item.name,
        quantity: i.quantity,
        price: i.item.price,
      })),
      totalAmount: order.totalAmount,
      cafeteriaId: order.cafeteriaId,
      pickupOtp: order.pickupOtp,
      timestamp: now,
      soundAlertTriggered: true,
    };

    // 1. Broadcast SSE stream event with explicit ready sound trigger
    try {
      sseBroadcaster.notifyOrderUpdate(order, 'ORDER_UPDATE');
    } catch (sseErr) {
      console.warn(`[NotificationService] SSE broadcast warning for ${order.orderToken}:`, sseErr);
    }

    // 2. Dispatch external webhook if configured
    if (webhookUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-FoodLine-Event': 'ORDER_READY',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const latencyMs = Date.now() - startTime;
        NotificationService.logNotification({
          id: logId,
          orderToken: order.orderToken,
          event: 'ORDER_READY',
          status: res.ok ? 'SENT' : 'FAILED',
          destination: webhookUrl,
          timestamp: now,
          latencyMs,
        });
        console.log(`[NotificationService] Order ready webhook dispatched for ${order.orderToken} (${latencyMs}ms)`);
      } catch (err: any) {
        NotificationService.logNotification({
          id: logId,
          orderToken: order.orderToken,
          event: 'ORDER_READY',
          status: 'FAILED',
          destination: webhookUrl,
          timestamp: now,
          latencyMs: Date.now() - startTime,
        });
        console.warn(`[NotificationService] Webhook dispatch error for ${order.orderToken}:`, err?.message || err);
      }
    } else {
      // Local dev / simulated push notification log
      NotificationService.logNotification({
        id: logId,
        orderToken: order.orderToken,
        event: 'ORDER_READY',
        status: 'SENT',
        destination: 'LOCAL_AUDIO_SSE_DISPATCH',
        timestamp: now,
        latencyMs: 0,
      });
      console.log(`[NotificationService] Local audio/push alert registered for ready order ${order.orderToken}`);
    }
  }

  private static logNotification(log: NotificationLog) {
    NotificationService.notificationLogs.unshift(log);
    if (NotificationService.notificationLogs.length > 50) {
      NotificationService.notificationLogs.pop();
    }
  }

  public static getRecentNotificationLogs(): NotificationLog[] {
    return [...NotificationService.notificationLogs];
  }
}
