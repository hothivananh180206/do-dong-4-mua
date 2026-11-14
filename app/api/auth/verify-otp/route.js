import { NextResponse } from 'next/server';

if (!global.__otpCache) {
  global.__otpCache = new Map();
}
const otpCache = global.__otpCache;

export async function POST(request) {
  try {
    const { phone, otp } = await request.json();
    const cleanPhone = (phone || '').trim();
    const cleanOtp = (otp || '').trim();

    if (!cleanPhone || !cleanOtp) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập đầy đủ số điện thoại và mã OTP.' }, { status: 400 });
    }

    const record = otpCache.get(cleanPhone);
    if (!record) {
      return NextResponse.json({ success: false, message: 'Mã OTP không tồn tại hoặc đã hết hạn. Vui lòng yêu cầu gửi lại.' }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      otpCache.delete(cleanPhone);
      return NextResponse.json({ success: false, message: 'Mã OTP đã hết hạn (quá 5 phút). Vui lòng gửi lại yêu cầu.' }, { status: 400 });
    }

    if (record.code !== cleanOtp) {
      return NextResponse.json({ success: false, message: 'Mã OTP không chính xác. Vui lòng kiểm tra lại.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Xác thực OTP thành công! Bạn có thể đặt mật khẩu mới.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

