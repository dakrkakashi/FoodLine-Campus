# 🔌 API Contracts & REST Design Principles

Following strict `api-design-principles` standards: JSON:API resource modeling, standard HTTP verbs, predictable error envelopes, and idempotency guarantees.

## 1. Global Standard Response Envelope
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-08-27T22:19:00Z",
    "requestId": "req_8492019"
  }
}
```

## 2. Global Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "SLOT_CAPACITY_EXCEEDED",
    "message": "Selected slot 11:50 AM is fully booked. Please select 12:10 PM.",
    "details": {
      "slotId": "slot-lunch-a",
      "available": 0,
      "nextAvailableSlot": "slot-lunch-b"
    }
  }
}
```

## 3. Core REST Endpoints
| Verb | Endpoint | Description | Idempotent |
|---|---|---|---|
| `GET` | `/api/v1/campuses/:id/menu` | Retrieve active 44-dish menu with real-time stockouts | Yes |
| `GET` | `/api/v1/campuses/:id/slots` | Retrieve break slots with remaining capacity meters | Yes |
| `POST` | `/api/v1/orders` | Initiate pre-order and lock temporary slot reservation | Yes (`Idempotency-Key`) |
| `POST` | `/api/v1/payments/verify-utr` | Submit 12-digit bank UTR for verification & issue QR pass | Yes (`Idempotency-Key`) |
| `GET` | `/api/v1/orders/:token/stream` | Server-Sent Events (SSE) live tracking stream | Yes |
| `PATCH` | `/api/v1/kds/orders/:id/status` | Kitchen status progression (`PREPARING`, `READY`, `COLLECTED`) | Yes |
| `PATCH` | `/api/v1/kds/inventory/:dishId` | Toggle 1-tap stockout availability | Yes |
