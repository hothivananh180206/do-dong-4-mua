import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'customer' | 'admin' | null
    const userId = searchParams.get('userId'); // user ID if logged in

    let sql = `
      SELECT n.id, n.title, n.content, n.recipient_type, n.recipient_ids, n.recipient_names,
             n.sender_id, n.created_at, n.updated_at,
             COALESCE(u.full_name, 'Hệ Thống Đổ Đống 4 Mùa') as sender_name
      FROM notifications n
      LEFT JOIN users u ON u.id = n.sender_id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      const uIdNum = Number(userId);
      const uIdStr = String(userId);

      if (role === 'admin') {
        sql += ` AND (
          n.recipient_type IN ('ALL', 'ADMINS')
          OR (n.recipient_type = 'SPECIFIC' AND (
            FIND_IN_SET(?, n.recipient_ids)
            OR n.recipient_ids LIKE ?
            OR n.recipient_ids LIKE ?
            OR n.recipient_ids LIKE ?
          ))
        )`;
        params.push(uIdStr, `[${uIdNum}]`, `%,${uIdNum},%`, `%${uIdNum}%`);
      } else {
        // Customer
        sql += ` AND (
          n.recipient_type IN ('ALL', 'CUSTOMERS')
          OR (n.recipient_type = 'SPECIFIC' AND (
            FIND_IN_SET(?, n.recipient_ids)
            OR n.recipient_ids LIKE ?
            OR n.recipient_ids LIKE ?
            OR n.recipient_ids LIKE ?
          ))
        )`;
        params.push(uIdStr, `[${uIdNum}]`, `%,${uIdNum},%`, `%${uIdNum}%`);
      }
    } else {
      // Guest or not logged in
      if (role === 'admin') {
        sql += ` AND n.recipient_type IN ('ALL', 'ADMINS')`;
      } else {
        sql += ` AND n.recipient_type IN ('ALL', 'CUSTOMERS')`;
      }
    }

    sql += ` ORDER BY n.created_at DESC LIMIT 50`;

    const notifications = await query(sql, params);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching public notifications:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
