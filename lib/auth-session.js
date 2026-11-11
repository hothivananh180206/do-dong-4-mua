'use client';

// Thời gian tồn tại của phiên đăng nhập theo SRS NFR-006: 24 giờ (86,400,000 ms)
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const STORAGE_KEY = 'dodong4mua_user';

/**
 * Lưu phiên đăng nhập người dùng kèm mốc thời gian và hạn 24 giờ (NFR-006)
 * @param {object} userData
 * @returns {object}
 */
export function saveAuthSession(userData) {
  if (typeof window === 'undefined' || !userData) return null;
  const now = Date.now();
  const sessionData = {
    ...userData,
    _loginTime: now,
    _lastActive: now,
    _expiresAt: now + SESSION_TTL_MS
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    window.dispatchEvent(new Event('auth-change'));
  } catch (e) {
    console.warn('Lỗi lưu auth session vào localStorage:', e);
  }
  return sessionData;
}

/**
 * Đọc phiên đăng nhập từ localStorage và tự động kiểm tra hết hạn 24 giờ (NFR-006)
 * Nếu đã quá 24h hoặc không hợp lệ: tự động xóa session và trả về null
 * @returns {object|null}
 */
export function getAuthSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const now = Date.now();

    // 1. Kiểm tra hết hạn 24h kể từ khi đăng nhập
    if (session._expiresAt && now > session._expiresAt) {
      clearAuthSession();
      return null;
    }

    // 2. Kiểm tra nếu không có thao tác trong hơn 24 giờ
    if (session._lastActive && now - session._lastActive > SESSION_TTL_MS) {
      clearAuthSession();
      return null;
    }

    // Cập nhật lại mốc hoạt động gần nhất để duy trì phiên
    session._lastActive = now;
    if (!session._expiresAt) {
      session._expiresAt = now + SESSION_TTL_MS;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  } catch (e) {
    clearAuthSession();
    return null;
  }
}

/**
 * Xóa sạch phiên đăng nhập khi người dùng đăng xuất hoặc phiên hết hạn
 */
export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('auth-change'));
  } catch (e) {
    console.warn('Lỗi xóa auth session:', e);
  }
}

/**
 * Kiểm tra xem phiên đăng nhập hiện tại còn hiệu lực hay không
 * @returns {boolean}
 */
export function isSessionActive() {
  return getAuthSession() !== null;
}

