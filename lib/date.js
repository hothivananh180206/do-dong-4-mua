/**
 * Thư viện chuẩn hóa định dạng Ngày / Giờ toàn hệ thống
 * Quy chuẩn bắt buộc: dd/mm/yyyy theo tiêu chuẩn Việt Nam
 */

/**
 * Định dạng ngày sang chuẩn dd/mm/yyyy (Ví dụ: 08/11/2026)
 * @param {string|number|Date} dateInput 
 * @returns {string} Chuỗi ngày định dạng dd/mm/yyyy hoặc '' nếu không hợp lệ
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Định dạng ngày giờ: HH:mm dd/mm/yyyy (Ví dụ: 19:05 08/11/2026)
 * @param {string|number|Date} dateInput 
 * @param {boolean} includeSeconds Có hiển thị giây hay không
 * @returns {string}
 */
export function formatDateTime(dateInput, includeSeconds = false) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (includeSeconds) {
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

/**
 * Chuẩn định dạng hệ thống
 */
export const SYSTEM_DATE_FORMAT = 'dd/mm/yyyy';

