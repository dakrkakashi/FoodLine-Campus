import {
  Order,
  WhatsAppTemplatePayload,
  WhatsAppPickupTemplateParameters,
  WhatsAppNotificationDispatchResult,
  NotificationLog,
} from '../lib/types.js';
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

export class NotificationService {
  private static notificationLogs: NotificationLog[] = [];

  /**
   * Generates typed WhatsApp Cloud API pickup parameters for an order transitioning to READY.
   * Carries student OTP, order token, cafeteria name, amount, and express lane pickup instructions.
   */
  public static generatePickupParams(order: Order): WhatsAppPickupTemplateParameters {
    return {
      orderToken: order.orderToken,
      pickupOtp: order.pickupOtp || '0000',
      studentName: order.studentName || 'Student',
      cafeteriaName: order.cafeteriaId || 'Cafe @7 Express Pickup Counter',
      totalAmount: order.totalAmount,
      status: 'READY',
      pickupSlotLabel: order.slot?.label || 'Express Pickup Slot',
      readyTimestamp: new Date().toISOString(),
    };
  }

  /**
   * Formats a Meta Graph API v20.0 compliant WhatsApp message template payload
   * carrying the student's name, pickup OTP, order token, cafeteria/counter info,
   * and express lane pickup instructions.
   */
  public static formatWhatsAppPickupTemplate(order: Order, recipientPhone?: string): WhatsAppTemplatePayload {
    const rawPhone = recipientPhone || order.studentPhone || '9876543210';
    // Normalize to international E.164 without leading '+' (e.g. 919876543210)
    const digitsOnly = rawPhone.replace(/\D/g, '');
    const normalizedPhone = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;

    const templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'foodline_pickup_ready';
    const langCode = process.env.WHATSAPP_TEMPLATE_LANG || 'en';

    const params = NotificationService.generatePickupParams(order);

    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: normalizedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: langCode,
          policy: 'deterministic',
        },
        components: [
          {
            type: 'header',
            parameters: [
              { type: 'text', text: params.orderToken },
            ],
          },
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.studentName || 'Student' },
              { type: 'text', text: params.orderToken },
              { type: 'text', text: params.pickupOtp },
              { type: 'text', text: params.cafeteriaName || 'Cafe @7 Express Counter' },
              { type: 'text', text: `₹${params.totalAmount || 0}` },
              { type: 'text', text: 'Present your 4-digit OTP at the express lane counter for instant pickup.' },
            ],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: 0,
            parameters: [
              { type: 'text', text: params.orderToken },
            ],
          },
        ],
      },
    };
  }

  /**
   * Dispatches WhatsApp notification via Meta Cloud API or logs mock payload in pilot/dev mode.
   * Strictly maintains OWASP secret isolation with 0 hardcoded credentials.
   */
  public static async dispatchWhatsAppPickupNotification(order: Order, overridePhone?: string): Promise<NotificationLog> {
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || 'v20.0';

    const payload = NotificationService.formatWhatsAppPickupTemplate(order, overridePhone);
    const params = NotificationService.generatePickupParams(order);
    const now = new Date().toISOString();
    const logId = `wa_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const startTime = Date.now();

    if (token && phoneId) {
      const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneId}/messages`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const latencyMs = Date.now() - startTime;
        const respData = (await res.json().catch(() => ({}))) as Record<string, any>;
        const logEntry: NotificationLog = {
          id: logId,
          orderToken: order.orderToken,
          event: 'ORDER_READY',
          channel: 'WHATSAPP',
          status: res.ok ? 'SENT' : 'FAILED',
          destination: endpoint,
          recipientPhone: payload.to,
          timestamp: now,
          latencyMs,
          details: {
            ...respData,
            pickupParams: params,
            httpStatus: res.status,
          },
        };

        NotificationService.logNotification(logEntry);
        console.log(`[NotificationService] WhatsApp Cloud API message sent for ${order.orderToken} to ${payload.to} (${latencyMs}ms)`);
        return logEntry;
      } catch (err: any) {
        const latencyMs = Date.now() - startTime;
        const logEntry: NotificationLog = {
          id: logId,
          orderToken: order.orderToken,
          event: 'ORDER_READY',
          channel: 'WHATSAPP',
          status: 'FAILED',
          destination: endpoint,
          recipientPhone: payload.to,
          timestamp: now,
          latencyMs,
          details: {
            error: err?.message || String(err),
            pickupParams: params,
          },
        };
        NotificationService.logNotification(logEntry);
        console.warn(`[NotificationService] WhatsApp API dispatch error for ${order.orderToken}:`, err?.message || err);
        return logEntry;
      }
    } else {
      // Pilot / Mock Fallback Mode: Capture ready-to-dispatch payload with student's OTP & Token
      const logEntry: NotificationLog = {
        id: logId,
        orderToken: order.orderToken,
        event: 'ORDER_READY',
        channel: 'WHATSAPP',
        status: 'MOCK_DISPATCHED',
        destination: 'WHATSAPP_MOCK_CLOUD_API',
        recipientPhone: payload.to,
        timestamp: now,
        latencyMs: 1,
        details: {
          templatePayload: payload,
          pickupParams: params,
          expressLaneInstructions: 'Present your 4-digit OTP at the express lane counter for instant pickup.',
          messagePreview: `Hi ${params.studentName}, your order ${params.orderToken} is READY for pickup! OTP: ${params.pickupOtp} at ${params.cafeteriaName}. Present OTP at express counter.`,
        },
      };

      NotificationService.logNotification(logEntry);
      console.log(`[NotificationService] [PILOT MOCK] WhatsApp template formatted for order ${order.orderToken} (Recipient: ${payload.to}, OTP: ${params.pickupOtp}, Status: MOCK_DISPATCHED)`);
      return logEntry;
    }
  }

  /**
   * Helper returning typed WhatsAppNotificationDispatchResult
   */
  public static async sendPickupReadyNotification(
    order: Order,
    overridePhone?: string
  ): Promise<WhatsAppNotificationDispatchResult> {
    const log = await NotificationService.dispatchWhatsAppPickupNotification(order, overridePhone);
    return {
      success: log.status === 'SENT' || log.status === 'MOCK_DISPATCHED',
      orderToken: order.orderToken,
      recipientPhone: log.recipientPhone || overridePhone || order.studentPhone || '',
      channel: 'WHATSAPP',
      status: log.status,
      messageId: log.id,
      latencyMs: log.latencyMs || 0,
      dispatchedAt: log.timestamp,
      error: log.status === 'FAILED' ? JSON.stringify(log.details) : undefined,
    };
  }

  /**
   * Dispatch push/webhook, sound trigger, and WhatsApp alert when an order is transitioned to READY
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

    // 2. Dispatch WhatsApp Cloud API Pickup Notification (Template with OTP and Token)
    try {
      await NotificationService.dispatchWhatsAppPickupNotification(order);
    } catch (waErr) {
      console.warn(`[NotificationService] WhatsApp notification exception for ${order.orderToken}:`, waErr);
    }

    // 3. Dispatch external webhook if configured
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
          channel: 'WEBHOOK',
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
          channel: 'WEBHOOK',
          status: 'FAILED',
          destination: webhookUrl,
          timestamp: now,
          latencyMs: Date.now() - startTime,
        });
        console.warn(`[NotificationService] Webhook dispatch error for ${order.orderToken}:`, err?.message || err);
      }
    } else {
      // Local audio / push SSE notification log
      NotificationService.logNotification({
        id: logId,
        orderToken: order.orderToken,
        event: 'ORDER_READY',
        channel: 'SSE',
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

