"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseBroadcaster = void 0;
class SseBroadcaster {
    clients = [];
    addClient(orderToken, res) {
        const clientId = Math.random().toString(36).substring(2, 9);
        // Setup SSE headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        });
        res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE stream established' })}\n\n`);
        const client = { id: clientId, orderToken, res };
        this.clients.push(client);
        return clientId;
    }
    removeClient(clientId) {
        this.clients = this.clients.filter((c) => c.id !== clientId);
    }
    notifyOrderUpdate(order, eventType = 'ORDER_UPDATE') {
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
            }
            catch (err) {
                console.error(`Failed to send SSE to client ${client.id}:`, err);
            }
        });
    }
}
exports.sseBroadcaster = new SseBroadcaster();
