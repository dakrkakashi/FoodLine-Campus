/**
 * Cursor-Based Pagination Protocol
 * Mandated by Antigravity IDE Master Specification & MCP Blueprint
 * 
 * Provides stable sequential reference points based on (timestamp, id) tuples.
 * Eradicates offset-drift, duplicate insertions, and missing records
 * when concurrent transactions or agent actions mutate rows during active sessions.
 */

export interface CursorPayload {
  timestamp: string; // ISO-8601 timestamp or numeric epoch string
  id: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
  totalReturned: number;
}

/**
 * Encodes a sequential (timestamp, id) pair into an opaque, URL-safe base64 cursor.
 */
export function encodeCursor(payload: CursorPayload): string {
  const serialized = JSON.stringify([payload.timestamp, payload.id]);
  return Buffer.from(serialized, 'utf-8').toString('base64url');
}

/**
 * Decodes an opaque base64 cursor back into its (timestamp, id) components.
 * Returns null if the cursor is corrupted, tampered with, or invalid.
 */
export function decodeCursor(cursor: string): CursorPayload | null {
  if (!cursor || typeof cursor !== 'string') return null;
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 2 && typeof parsed[0] === 'string' && typeof parsed[1] === 'string') {
      return { timestamp: parsed[0], id: parsed[1] };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * In-memory cursor pagination helper for arrays of records with timestamps.
 */
export function paginateRecords<T extends { id: string; createdAt?: string; created_at?: string }>(
  records: T[],
  options: {
    cursor?: string | null;
    limit?: number;
    sortDirection?: 'asc' | 'desc';
  } = {}
): PaginatedResult<T> {
  const limit = Math.max(1, Math.min(options.limit || 20, 100));
  const sortDirection = options.sortDirection || 'desc';

  // Sort records deterministically by timestamp then by id
  const sorted = [...records].sort((a, b) => {
    const tA = a.created_at || a.createdAt || '';
    const tB = b.created_at || b.createdAt || '';
    const timeDiff = tA.localeCompare(tB);
    if (timeDiff !== 0) {
      return sortDirection === 'desc' ? -timeDiff : timeDiff;
    }
    return sortDirection === 'desc' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
  });

  let startIndex = 0;
  if (options.cursor) {
    const decoded = decodeCursor(options.cursor);
    if (decoded) {
      const matchIndex = sorted.findIndex((item) => {
        const itemTime = item.created_at || item.createdAt || '';
        if (sortDirection === 'desc') {
          return itemTime < decoded.timestamp || (itemTime === decoded.timestamp && item.id < decoded.id);
        } else {
          return itemTime > decoded.timestamp || (itemTime === decoded.timestamp && item.id > decoded.id);
        }
      });
      startIndex = matchIndex === -1 ? sorted.length : matchIndex;
    }
  }

  const sliced = sorted.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < sorted.length;

  let nextCursor: string | null = null;
  if (hasMore && sliced.length > 0) {
    const lastItem = sliced[sliced.length - 1];
    nextCursor = encodeCursor({
      timestamp: lastItem.created_at || lastItem.createdAt || new Date().toISOString(),
      id: lastItem.id,
    });
  }

  return {
    items: sliced,
    nextCursor,
    hasMore,
    limit,
    totalReturned: sliced.length,
  };
}
