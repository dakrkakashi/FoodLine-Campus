import { Response } from 'express';
import { Order } from '../lib/types.js';

interface SseClient {
  id: string;
  orderToken: string;
  res: Response;
}

class SseBroadcaster {
  private clients: SseClient[] = [];

  public addClient(orderToken: string, res: Response): string {
    const clientId = Math.random().toString(36).substring(2, 9);
    
    // Setup SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE stream established' })}\n\n`);

    const client: SseClient = { id: clientId, orderToken, res };
    this.clients.push(client);

    return clientId;
  }

  public removeClient(clientId: string) {
    this.clients = this.clients.filter((c) => c.id !== clientId);
  }

  public notifyOrderUpdate(order: Order, eventType: 'ORDER_SNAPSHOT' | 'ORDER_UPDATE' = 'ORDER_UPDATE') {
    const targetClients = this.clients.filter((c) => c.orderToken === order.orderToken);
    
    const payload = JSON.stringify({
      type: eventType,
      orderToken: order.orderToken,
      status: order.status,
      pickupOtp: order.pickupOtp,
      updatedAt: order.updatedAt || new Date().toISOString(),
      order,
    });

    targetClients.forEach((client) => {
      try {
        client.res.write(`data: ${payload}\n\n`);
      } catch (err) {
        console.error(`Failed to send SSE to client ${client.id}:`, err);
      }
    });
  }
}

export const sseBroadcaster = new SseBroadcaster();
