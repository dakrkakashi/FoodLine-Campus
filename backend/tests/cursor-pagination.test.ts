import { describe, it, expect } from 'vitest';
import {
  encodeCursor,
  decodeCursor,
  paginateRecords,
  CursorPayload,
} from '../src/lib/cursor-pagination.js';

describe('Cursor-Based Pagination Protocol', () => {
  it('encodes and decodes cursor payloads symmetrically', () => {
    const original: CursorPayload = {
      timestamp: '2026-09-13T12:00:00.000Z',
      id: 'ord_12345',
    };
    const encoded = encodeCursor(original);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(10);

    const decoded = decodeCursor(encoded);
    expect(decoded).toEqual(original);
  });

  it('safely handles corrupt or invalid cursor strings', () => {
    expect(decodeCursor('')).toBeNull();
    expect(decodeCursor('not-valid-base64-json!')).toBeNull();
    expect(decodeCursor('WzEyM10=')).toBeNull(); // [123]
  });

  it('paginates records sequentially with stable nextCursor', () => {
    const mockOrders = [
      { id: '1', createdAt: '2026-09-13T10:00:00Z', amount: 100 },
      { id: '2', createdAt: '2026-09-13T10:05:00Z', amount: 150 },
      { id: '3', createdAt: '2026-09-13T10:10:00Z', amount: 200 },
      { id: '4', createdAt: '2026-09-13T10:15:00Z', amount: 250 },
      { id: '5', createdAt: '2026-09-13T10:20:00Z', amount: 300 },
    ];

    // Page 1 (limit 2, desc) -> items 5 and 4
    const page1 = paginateRecords(mockOrders, { limit: 2, sortDirection: 'desc' });
    expect(page1.items.length).toBe(2);
    expect(page1.items[0].id).toBe('5');
    expect(page1.items[1].id).toBe('4');
    expect(page1.hasMore).toBe(true);
    expect(page1.nextCursor).not.toBeNull();

    // Page 2 using nextCursor
    const page2 = paginateRecords(mockOrders, {
      cursor: page1.nextCursor,
      limit: 2,
      sortDirection: 'desc',
    });
    expect(page2.items.length).toBe(2);
    expect(page2.items[0].id).toBe('3');
    expect(page2.items[1].id).toBe('2');
    expect(page2.hasMore).toBe(true);

    // Page 3 using nextCursor -> item 1, hasMore: false
    const page3 = paginateRecords(mockOrders, {
      cursor: page2.nextCursor,
      limit: 2,
      sortDirection: 'desc',
    });
    expect(page3.items.length).toBe(1);
    expect(page3.items[0].id).toBe('1');
    expect(page3.hasMore).toBe(false);
    expect(page3.nextCursor).toBeNull();
  });
});
