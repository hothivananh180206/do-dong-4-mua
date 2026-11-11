import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app;
let auth;

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  auth.languageCode = 'vi'; // Tiếng Việt
}

/**
 * Format số điện thoại VN thành chuẩn quốc tế E.164 (VD: 0912345678 -> +84912345678)
 */
export function formatPhoneForE164(phone) {
  let cleaned = (phone || '').trim().replace(/[\s\.\-]+/g, '');
  if (cleaned.startsWith('0')) {
    return '+84' + cleaned.substring(1);
  }
  if (!cleaned.startsWith('+')) {
    return '+84' + cleaned;
  }
  return cleaned;
}

/**
 * Dọn dẹp triệt để instance và DOM node của reCAPTCHA để không bao giờ bị lỗi
 * "reCAPTCHA has already been rendered in this element"
 */
export function resetRecaptchaVerifier(containerId = 'recaptcha-container') {
  if (typeof window === 'undefined') return;

  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Lỗi khi clear recaptchaVerifier:', e);
    }
    window.recaptchaVerifier = null;
  }

  // Xóa DOM node cũ và thay bằng clone node mới sạch sẽ để xóa sạch gRecaptcha registry
  const el = document.getElementById(containerId);
  if (el && el.parentNode) {
    const freshClone = el.cloneNode(false);
    freshClone.innerHTML = '';
    el.parentNode.replaceChild(freshClone, el);
  }
}

/**
 * Khởi tạo Invisible reCAPTCHA verifier cho Firebase Phone Auth
 * Tự động tái sử dụng nếu đã có sẵn, hoặc tạo mới an toàn nếu chưa có.
 */
export function initRecaptchaVerifier(containerId = 'recaptcha-container') {
  if (typeof window === 'undefined') return null;

  if (!auth) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    auth.languageCode = 'vi';
  }

  // 1. Nếu instance đã tồn tại và hợp lệ -> Tái sử dụng luôn, không render lại
  if (window.recaptchaVerifier) {
    return window.recaptchaVerifier;
  }

  // 2. Tìm hoặc tự động tạo DOM container nếu chưa có trên trang
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  // 3. Khởi tạo an toàn với cơ chế tự phục hồi (Self-Healing)
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired');
        resetRecaptchaVerifier(containerId);
      }
    });
  } catch (err) {
    console.warn('RecaptchaVerifier init error, auto-recovering:', err);
    // Nếu gặp lỗi "already been rendered", reset sạch sẽ và khởi tạo lại 1 lần
    resetRecaptchaVerifier(containerId);
    let freshContainer = document.getElementById(containerId);
    if (!freshContainer) {
      freshContainer = document.createElement('div');
      freshContainer.id = containerId;
      document.body.appendChild(freshContainer);
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, freshContainer, {
      size: 'invisible'
    });
  }

  return window.recaptchaVerifier;
}

export { app, auth, signInWithPhoneNumber };
