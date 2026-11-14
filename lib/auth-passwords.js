import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Băm mật khẩu theo chuẩn Bcrypt (SRS NFR-004)
 * @param {string} plainPassword 
 * @returns {Promise<string>}
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Mật khẩu không hợp lệ');
  }
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Kiểm tra xem chuỗi có phải là hash chuẩn Bcrypt hay không
 * @param {string} str 
 * @returns {boolean}
 */
export function isBcryptHash(str) {
  if (!str || typeof str !== 'string') return false;
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(str);
}

/**
 * Xác thực mật khẩu nhập vào so với mật khẩu trong CSDL.
 * Hỗ trợ cả Bcrypt hash và chế độ tương thích ngược với mật khẩu cũ (Plain Text).
 * @param {string} plainPassword Mật khẩu người dùng nhập
 * @param {string} storedHashOrPlain Mật khẩu đang lưu trong CSDL
 * @returns {Promise<{ isValid: boolean, needsRehash: boolean }>}
 */
export async function verifyPassword(plainPassword, storedHashOrPlain) {
  if (!plainPassword || !storedHashOrPlain) {
    return { isValid: false, needsRehash: false };
  }

  // 1. Nếu mật khẩu trong CSDL đã là hash Bcrypt
  if (isBcryptHash(storedHashOrPlain)) {
    const isMatch = await bcrypt.compare(plainPassword, storedHashOrPlain);
    return { isValid: isMatch, needsRehash: false };
  }

  // 2. Chế độ tương thích ngược: Mật khẩu cũ còn ở dạng Plain Text
  const isPlainMatch = plainPassword === storedHashOrPlain;
  return { isValid: isPlainMatch, needsRehash: isPlainMatch };
}


/**
 * Kiểm tra độ phức tạp của mật khẩu theo Quy tắc nghiệp vụ BR-010:
 * - Tối thiểu 8 ký tự
 * - Ít nhất 1 chữ in hoa (A-Z)
 * - Ít nhất 1 chữ in thường (a-z)
 * - Ít nhất 1 chữ số (0-9)
 * @param {string} password
 * @returns {{ isValid: boolean, message?: string }}
 */
export function validatePasswordBR010(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Vui lòng nhập mật khẩu.' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Mật khẩu phải có tối thiểu 8 ký tự.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải chứa ít nhất 1 chữ in hoa (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải chứa ít nhất 1 chữ in thường (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải chứa ít nhất 1 chữ số (0-9).' };
  }
  return { isValid: true };
}
