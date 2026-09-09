# 📡 06 • REST & Real-Time SSE API Specifications
**Project Name:** FoodLine Campus  
**Specification Standard:** JSON:API Compliant Envelope  
**Base URL (Local):** `http://localhost:4000` (Backend Engine) / `http://localhost:3000/api` (Frontend Proxy)

---

## 1. Universal Response Contract

All endpoints guarantee a strict JSON:API envelope:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta: {
    timestamp: string; // ISO 8601 UTC
    version?: string;
  };
}
```

### Standard HTTP Status Codes & Headers
| Code | Meaning | Example Trigger / Scenario |
|---|---|---|
| `200 OK` | Request succeeded | Data fetched, status updated, or payment verified |
| `201 Created` | Resource created | Order created, new user registered |
| `400 Bad Request` | Invalid payload or syntax | Malformed 12-digit UTR, invalid status transition, missing fields |
| `401 Unauthorized` | Missing or invalid auth | Missing JWT token or invalid `x-staff-passkey` on protected routes |
| `403 Forbidden` | Insufficient permissions | Valid student token attempting kitchen/admin routes |
| `409 Conflict` | State conflict / Duplicate | Slot capacity full (60 orders), duplicate UTR replay attack |
| `413 Payload Too Large` | Payload exceeded 64KB | Incoming request body > 65,536 bytes |
| `429 Too Many Requests` | Rate limit triggered | Exceeded login attempts (5/15m), OTP brute-force, or general traffic |

*Note: Whenever `429 Too Many Requests` is returned, the response includes an RFC 6585 `Retry-After: <seconds>` header.*

---


## 2. Core Endpoint Catalog

### 1. `GET /api/campuses/geo`
- **Purpose:** Returns the hierarchical geographic tree of campuses.
- **Response Shape (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "states": [
        {
          "id": "maharashtra",
          "name": "Maharashtra",
          "districts": [
            {
              "id": "ahmednagar",
              "name": "Ahmednagar",
              "cities": [
                {
                  "id": "kopargaon",
                  "name": "Kopargaon",
                  "campuses": [
                    {
                      "id": "a1111111-1111-1111-1111-111111111111",
                      "name": "Sanjivani University",
                      "slug": "sanjivani",
                      "totalCanteens": 5,
                      "isVerified": true
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    "meta": { "timestamp": "2026-09-05T22:00:00Z" }
  }
  ```

### 2. `GET /api/campuses/:campusId/canteens`
- **Purpose:** Fetches all 5 active dining outlets for a university.
- **Response Shape (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "canteens": [
        {
          "id": "b2222222-2222-2222-2222-222222222222",
          "name": "Cafe @7",
          "slug": "cafe7",
          "isOpen": true,
          "prepTimeMins": 5,
          "dishesCount": 44,
          "upiId": "9960091371@slc"
        }
      ]
    }
  }
  ```

### 3. `GET /api/slots`
- **Purpose:** Fetches break pickup intervals with live capacity meters.
- **Query Params:** `?cafeteriaId=<uuid>` (optional)
- **Response Shape (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "slot-1",
        "label": "10:45 AM – 11:00 AM",
        "maxCapacity": 60,
        "currentBooked": 42,
        "availableSlots": 18,
        "isFull": false
      }
    ]
  }
  ```

### 4. `POST /api/orders`
- **Purpose:** Creates an order, atomically reserves slot capacity, and issues tokens.
- **Request Payload:**
  ```json
  {
    "slotId": "uuid-slot-1",
    "cafeteriaId": "uuid-cafe7",
    "studentPrn": "SU2024CS0142",
    "items": [
      { "id": "dish-1", "name": "Special Vada Pav", "price": 20, "quantity": 2 },
      { "id": "dish-2", "name": "Cutting Chai", "price": 10, "quantity": 1 }
    ],
    "notes": "Extra spicy green chutney"
  }
  ```
- **Response Shape (`201 Created`):**
  ```json
  {
    "success": true,
    "data": {
      "orderId": "uuid-order-1",
      "orderToken": "FL-1793",
      "totalAmount": 50.00,
      "pickupOtp": "6065",
      "status": "PENDING_PAYMENT"
    }
  }
  ```
- **Error Responses:**
  - `409 Conflict`: Slot is full (`{"error": "Selected break slot has reached its 60-order capacity"}`).

### 5. `POST /api/payments/verify-utr`
- **Purpose:** Submits 12-digit Indian Bank UTR reference and validates against replay fraud.
- **Request Payload:**
  ```json
  {
    "orderToken": "FL-1793",
    "utrNumber": "928374615243",
    "amount": 50.00
  }
  ```
- **Response Shape (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "orderToken": "FL-1793",
      "status": "CONFIRMED",
      "utrNumber": "928374615243",
      "pickupOtp": "6065",
      "message": "Payment verified successfully. Your food is scheduled!"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: UTR is not exactly 12 numeric digits.
  - `409 Conflict`: UTR has already been used for another order (replay attack blocked).

### 6. `GET /api/order/:token/stream` (Server-Sent Events)
- **Purpose:** Real-time push connection for the student's live tracking pass.
- **Headers:** `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`.
- **Payload Types:**
  - `event: ORDER_SNAPSHOT` (Initial full order payload upon connection).
  - `event: ORDER_UPDATE` (Emitted whenever kitchen changes status: `CONFIRMED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COLLECTED`).

### 7. `POST /api/orders/verify-otp`
- **Purpose:** Kitchen staff inputs student's 4-digit OTP to complete food handover.
- **Request Payload:**
  ```json
  {
    "orderToken": "FL-1793",
    "pickupOtp": "6065"
  }
  ```
- **Response Shape (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "orderToken": "FL-1793",
      "status": "COLLECTED",
      "collectedAt": "2026-09-05T22:15:30Z"
    }
  }
  ```

### 8. `PATCH /api/kds/orders/:id/status`
- **Purpose:** Kitchen tablet transitions order through cooking pipeline.
- **Security & Authentication:** Protected by `requireAuth(['kitchen', 'canteen_manager', 'admin'])`.
- **Headers:** `Authorization: Bearer <jwt>` OR `x-staff-passkey: <passkey>`
- **Request Payload:** `{ "status": "PREPARING" | "READY" | "COLLECTED" }`
- **Response Shape (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "orderId": "uuid-order-1",
      "status": "PREPARING",
      "updatedAt": "2026-09-05T22:10:00Z"
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Missing or invalid bearer token / staff passkey.
  - `403 Forbidden`: Authenticated user lacks kitchen or admin privileges.
  - `400 Bad Request`: Invalid status transition or missing fields.

### 9. `PATCH /api/kds/inventory/:dishId`
- **Purpose:** 1-Tap stockout toggle for cafeteria staff.
- **Security & Authentication:** Protected by `requireAuth(['kitchen', 'canteen_manager', 'admin'])`.
- **Headers:** `Authorization: Bearer <jwt>` OR `x-staff-passkey: <passkey>`
- **Request Payload:** `{ "isAvailable": false | true }`
- **Response Shape (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "dishId": "dish-1",
      "isAvailable": false,
      "message": "Dish availability updated"
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Missing or invalid credentials.
  - `403 Forbidden`: Insufficient role permissions.

### 10. `GET /api/telemetry`
- **Purpose:** Real-time health monitoring and process diagnostics.
- **Response Shape (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "processMemory": { "rss": 42.5, "heapUsed": 24.1 },
      "uptime": "4h 12m",
      "activeStreams": 14,
      "supabaseLatencyMs": 18,
      "retentionPolicy": "ACTIVE_24H_COLLECTED_PURGE"
    }
  }
  ```

### 11. `POST /api/auth/login` & `POST /api/auth/signup`
- **Purpose:** Authenticate users or register new student/staff profiles using salted `scrypt` hashing.
- **Rate Limit:** Protected by `loginRateLimiter` (Strict maximum 5 attempts per 15-minute sliding window).
- **Request Payload (`/api/auth/login`):**
  ```json
  {
    "email": "student@sanjivani.edu.in",
    "password": "StrongPassword123!"
  }
  ```
- **Response Shape (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid-user-1",
        "email": "student@sanjivani.edu.in",
        "name": "Arjun Sharma",
        "role": "student"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid credentials.
  - `429 Too Many Requests`: Exceeded 5 failed attempts within 15 minutes (`Retry-After: 900`).

### 12. `GET /api/admin/metrics` & `POST /api/admin/orders/cleanup`
- **Purpose:** Administrative operations and manual retention policy execution.
- **Security & Authentication:** Protected by `requireAuth(['admin'])` / `requireAuth(['canteen_manager', 'admin'])`.
- **Headers:** `Authorization: Bearer <admin_jwt>`
- **Response Shape (`GET /api/admin/metrics` - `200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "totalOrdersToday": 342,
      "grossRevenue": 17850,
      "averagePrepTimeMins": 4.2,
      "activeKdsSessions": 2
    }
  }
  ```

