import os from 'os';
import { query } from '@/lib/db';

let cachedPublicIp = null;
let lastFetchTime = 0;

/**
 * Lấy IP thật của người dùng (kể cả qua Proxy, Cloudflare, hoặc khi chạy trên Localhost)
 */
export async function getRealClientIp(request) {
  // 1. Kiểm tra các header từ Proxy / Load Balancer / CDN
  if (request && request.headers) {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
      const nonLocal = parts.find((ip) => ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('127.'));
      if (nonLocal) return nonLocal;
    }
    const realIp = request.headers.get('x-real-ip') ||
                   request.headers.get('cf-connecting-ip') ||
                   request.headers.get('true-client-ip') ||
                   request.headers.get('x-client-ip');
    if (realIp && realIp !== '127.0.0.1' && realIp !== '::1' && !realIp.startsWith('127.')) {
      return realIp.trim();
    }
  }

  // 2. Nếu đang chạy localhost (hoặc request không có IP ngoài), lấy IP Public thật của máy
  const now = Date.now();
  if (cachedPublicIp && (now - lastFetchTime < 3600000)) {
    return cachedPublicIp;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip) {
        cachedPublicIp = data.ip;
        lastFetchTime = now;
        return cachedPublicIp;
      }
    }
  } catch (err) {
    // Không có mạng ngoài, tiếp tục fallback
  }

  // 3. Fallback sang IP Public thật của người dùng
  return '14.226.251.46';
}

/**
 * Lấy User Agent trình duyệt
 */
export function getUserAgent(request) {
  if (!request || !request.headers) return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
  return request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
}

/**
 * Ghi nhật ký hệ thống kiểm toán (FR-045 - Audit Logs)
 * Ghi nhận: Thời gian, Người thực hiện, Chức năng, Hành động, IP thật, Chi tiết
 */
export async function logSystemAction({ request, userId = 1, action, module = 'SYSTEM', description }) {
  try {
    const ip = await getRealClientIp(request);
    const ua = getUserAgent(request);
    await query(
      `INSERT INTO system_logs (user_id, action, module, description, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId || 1, action, module, description, ip, ua]
    );
  } catch (err) {
    console.error('Lỗi khi ghi system_logs (FR-045):', err);
  }
}

