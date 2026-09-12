import { logger } from './logger.js';

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityEvent {
  eventType:
    | 'AUTH_BRUTE_FORCE'
    | 'AUTH_FAILURE'
    | 'RATE_LIMIT_EXCEEDED'
    | 'CSRF_BLOCKED'
    | 'PATH_TRAVERSAL_ATTEMPT'
    | 'MALFORMED_INPUT'
    | 'TAMPERED_JWT'
    | 'REVOKED_TOKEN_USE'
    | 'UTR_REPLAY_ATTEMPT'
    | 'HPP_POLLUTION_ATTEMPT'
    | 'UNTRUSTED_METHOD'
    | 'SSRF_ATTEMPT'
    | 'PAYLOAD_OVERSIZED';
  severity: SecuritySeverity;
  clientIp?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

const auditLog: SecurityEvent[] = [];
const MAX_AUDIT_LOG_SIZE = 1000;

export const securityLogger = {
  log: (event: SecurityEvent) => {
    const enrichedEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Keep bounded in-memory audit log
    if (auditLog.length >= MAX_AUDIT_LOG_SIZE) {
      auditLog.shift();
    }
    auditLog.push(enrichedEvent);

    // Format structured log message
    const msg = `[SECURITY_AUDIT] [${event.severity}] ${event.eventType} on ${event.method || 'REQ'} ${event.path || '/'}`;
    if (event.severity === 'CRITICAL' || event.severity === 'HIGH') {
      logger.error(msg, undefined, enrichedEvent);
    } else {
      logger.warn(msg, enrichedEvent);
    }
  },

  getRecentEvents: (limit: number = 50): SecurityEvent[] => {
    return auditLog.slice(-limit);
  },

  clearEvents: () => {
    auditLog.length = 0;
  },
};
