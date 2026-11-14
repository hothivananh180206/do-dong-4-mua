import { query } from '@/lib/db';

/**
 * Service tính cước vận chuyển giao hàng (GreenSM Logistics)
 * 
 * Kiến trúc module hóa (Modular Architecture):
 * - Hiện tại: Áp dụng mức phí 0 đ (Hỗ trợ miễn phí giao hàng toàn bộ đơn hàng).
 * - Sẵn sàng tích hợp API: Khi bổ sung API đo khoảng cách (Google Maps Distance Matrix,
 *   OpenStreetMap hoặc API GreenSM), chỉ cần kích hoạt hàm `fetchDistanceKm` bên dưới
 *   mà không cần thay đổi bất kỳ luồng đặt hàng hay thanh toán nào khác.
 */

/**
 * Hàm gọi API đo khoảng cách địa lý giữa 2 điểm (sẵn sàng tích hợp API ngoài)
 * @param {string} origin - Địa chỉ chi nhánh xuất hàng
 * @param {string} destination - Địa chỉ nhận hàng của khách
 * @returns {Promise<number|null>} Khoảng cách tính bằng km
 */
export async function fetchDistanceKm(origin, destination) {
  if (!origin || !destination) return null;

  const apiKey = process.env.MAPS_DISTANCE_API_KEY;
  if (!apiKey) {
    // Chưa cấu hình API Key -> trả về null để rơi vào cấu hình mặc định
    return null;
  }

  try {
    // Khung tích hợp sẵn cho Google Maps / OpenStreetMap:
    // const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    // const res = await fetch(url);
    // const data = await res.json();
    // if (data.status === 'OK' && data.rows?.[0]?.elements?.[0]?.distance?.value) {
    //   return data.rows[0].elements[0].distance.value / 1000; // Đổi mét sang km
    // }
    return null;
  } catch (error) {
    console.error('[Shipping API Error] Lỗi khi gọi API đo khoảng cách:', error);
    return null;
  }
}

/**
 * Hàm tính cước phí giao hàng chính
 * @param {Object} params
 * @param {string} params.address - Địa chỉ khách hàng
 * @param {number} params.branchId - ID chi nhánh phục vụ
 * @param {number} params.subtotal - Tiền hàng
 * @param {Array} params.items - Danh sách món hàng
 * @returns {Promise<{ fee: number, distanceKm: number, tierName: string, provider: string }>}
 */
export async function calculateShippingFee({
  address = '',
  branchId = 1,
  subtotal = 0,
  items = []
} = {}) {
  try {
    // 1. Kiểm tra cấu hình hệ thống nếu cần đo khoảng cách qua API
    // let branchAddress = '25 Đỗ Ngọc Du, Phan Thiết, Lâm Đồng';
    // if (branchId) {
    //   const bRows = await query('SELECT address FROM branches WHERE id = ?', [branchId]);
    //   if (bRows.length > 0) branchAddress = bRows[0].address;
    // }
    // const distanceKm = await fetchDistanceKm(branchAddress, address);

    // 2. Nếu có khoảng cách từ API, tra cứu biểu cước trong bảng `shipping_fees`:
    // if (distanceKm !== null && distanceKm > 0) {
    //   const tiers = await query(
    //     'SELECT name, fee FROM shipping_fees WHERE status = 1 AND ? >= min_km AND ? <= max_km ORDER BY min_km ASC LIMIT 1',
    //     [distanceKm, distanceKm]
    //   );
    //   if (tiers.length > 0) {
    //     return {
    //       fee: parseFloat(tiers[0].fee),
    //       distanceKm: Math.round(distanceKm * 10) / 10,
    //       tierName: tiers[0].name,
    //       provider: 'GreenSM (GSM Logistics)'
    //     };
    //   }
    // }

    // 3. Hiện tại: Mặc định 0 đ (Miễn phí cước giao hàng toàn bộ đơn hàng)
    return {
      fee: 0,
      distanceKm: 0,
      tierName: 'Giao hàng tiêu chuẩn GreenSM',
      provider: 'GreenSM (GSM Logistics)'
    };
  } catch (error) {
    console.error('[Shipping Service] Lỗi tính cước vận chuyển:', error);
    return {
      fee: 0,
      distanceKm: 0,
      tierName: 'Giao hàng tiêu chuẩn GreenSM',
      provider: 'GreenSM (GSM Logistics)'
    };
  }
}

