import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPhone = searchParams.get('phone') || '';
    const cleanPhone = rawPhone.trim().replace(/[\s\.\-]+/g, '');

    if (!cleanPhone) {
      return NextResponse.json({ success: false, message: 'Vui lòng cung cấp số điện thoại' }, { status: 400 });
    }

    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ success: false, message: 'Số điện thoại không đúng định dạng (yêu cầu 10 chữ số)' }, { status: 400 });
    }

    const users = await query('SELECT id, full_name, phone, address FROM users WHERE phone = ?', [cleanPhone]);

    if (users.length > 0) {
      return NextResponse.json({
        success: true,
        exists: true,
        user: {
          id: users[0].id,
          full_name: users[0].full_name,
          phone: users[0].phone,
          address: users[0].address || ''
        }
      });
    }

    return NextResponse.json({
      success: true,
      exists: false
    });
  } catch (error) {
    console.error('Check phone error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

