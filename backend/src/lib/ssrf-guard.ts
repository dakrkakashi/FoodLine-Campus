import { URL } from 'url';
import net from 'net';

/**
 * Enterprise SSRF (Server-Side Request Forgery) Guard
 * Blocks outbound calls to loopback, link-local, AWS/cloud metadata, and private enterprise networks.
 */

// Private & reserved IP range detectors
function isPrivateIp(ip: string): boolean {
  if (!net.isIP(ip)) return false;

  // IPv4 Private & Reserved Ranges
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    const [b0, b1] = parts;

    // 127.0.0.0/8 (Loopback)
    if (b0 === 127) return true;
    // 10.0.0.0/8 (Private class A)
    if (b0 === 10) return true;
    // 172.16.0.0/12 (Private class B)
    if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;
    // 192.168.0.0/16 (Private class C)
    if (b0 === 192 && b1 === 168) return true;
    // 169.254.0.0/16 (Link-local / Cloud Metadata like AWS 169.254.169.254)
    if (b0 === 169 && b1 === 254) return true;
    // 0.0.0.0/8 (Current network)
    if (b0 === 0) return true;
    // 224.0.0.0/4 (Multicast)
    if (b0 >= 224 && b0 <= 239) return true;
    // 240.0.0.0/4 (Reserved)
    if (b0 >= 240) return true;

    return false;
  }

  // IPv6 Private & Reserved Ranges
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    // ::1 (Loopback)
    if (lower === '::1' || lower === '0:0:0:0:0:0:0:1') return true;
    // fe80::/10 (Link-local)
    if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return true;
    // fc00::/7 (Unique local)
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
    // ::ffff:127.0.0.1 (IPv4-mapped loopback)
    if (lower.startsWith('::ffff:')) {
      const v4Part = lower.replace('::ffff:', '');
      return isPrivateIp(v4Part);
    }
  }

  return false;
}

export interface SsrCheckResult {
  safe: boolean;
  reason?: string;
}

/**
 * Validates a target URL against SSRF vulnerabilities.
 */
export function isSafeOutboundUrl(targetUrl: string): SsrCheckResult {
  if (!targetUrl || typeof targetUrl !== 'string') {
    return { safe: false, reason: 'Empty or invalid URL provided' };
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return { safe: false, reason: 'Malformed URL structure' };
  }

  // 1. Protocol Restriction: Only HTTP and HTTPS
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { safe: false, reason: `Forbidden URL scheme "${parsed.protocol}". Only HTTP/HTTPS permitted.` };
  }

  const hostname = parsed.hostname.toLowerCase().trim();

  // 2. Loopback and Metadata hostnames
  const forbiddenHostnames = [
    'localhost',
    'metadata.google.internal',
    'instance-data',
    '169.254.169.254',
  ];

  if (forbiddenHostnames.includes(hostname) || hostname.endsWith('.internal') || hostname.endsWith('.local')) {
    return { safe: false, reason: `SSRF blocked: Hostname "${hostname}" points to restricted internal infrastructure.` };
  }

  // 3. Direct IP Address Validation
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      return { safe: false, reason: `SSRF blocked: Destination IP ${hostname} is in a restricted private/link-local address space.` };
    }
  }

  // 4. Port Restriction: Block dangerous internal service ports (Redis 6379, Memcached 11211, DBs 5432, 3306, 27017)
  const port = parsed.port ? parseInt(parsed.port, 10) : (parsed.protocol === 'https:' ? 443 : 80);
  const dangerousPorts = [21, 22, 23, 25, 110, 143, 3306, 5432, 6379, 11211, 27017, 9200];
  if (dangerousPorts.includes(port)) {
    return { safe: false, reason: `SSRF blocked: Port ${port} is restricted to prevent service exploitation.` };
  }

  return { safe: true };
}
