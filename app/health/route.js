import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    await query('SELECT 1');
    return NextResponse.json({
      status: 'UP',
      database: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      status: 'DOWN',
      database: 'DOWN',
      error: error.message
    }, { status: 503 });
  }
}

