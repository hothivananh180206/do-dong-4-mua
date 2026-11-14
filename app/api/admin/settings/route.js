import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logSystemAction } from '@/lib/logger';

export async function GET() {
  try {
    const rows = await query('SELECT setting_key, setting_value FROM system_settings');
    const settings = {};
    rows.forEach((r) => {
      settings[r.setting_key] = r.setting_value || '';
    });
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      if (typeof key === 'string' && key.trim()) {
        await query(
          'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
          [key.trim(), value !== null && value !== undefined ? String(value).trim() : '']
        );
      }
    }

    await logSystemAction({
      request,
      userId: 1,
      action: 'UPDATE_SETTINGS',
      module: 'SYSTEM',
      description: 'Admin Tổng cập nhật thông số cấu hình hệ thống website'
    });

    const rows = await query('SELECT setting_key, setting_value FROM system_settings');
    const updated = {};
    rows.forEach((r) => {
      updated[r.setting_key] = r.setting_value || '';
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật cấu hình website thành công!',
      data: updated
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
