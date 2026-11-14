import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Hàm xóa tệp vật lý trong public/uploads nếu là file tải lên cục bộ
function deletePhysicalFile(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  if (imageUrl.startsWith('/uploads/')) {
    const filename = path.basename(imageUrl);
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`[Dọn rác bộ nhớ] Đã xóa tệp ảnh vật lý: ${filePath}`);
      } catch (err) {
        console.error(`[Dọn rác bộ nhớ] Lỗi khi xóa tệp ${filePath}:`, err);
      }
    }
  }
}

// API 16: Lấy danh sách ảnh phụ của sản phẩm
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const images = await query('SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC', [id]);
    return NextResponse.json({ success: true, count: images.length, data: images });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Thêm ảnh phụ
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { image_url, display_order = 1 } = await request.json();

    if (!image_url) {
      return NextResponse.json({ success: false, message: 'Thiếu image_url.' }, { status: 400 });
    }

    const res = await query(
      'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
      [id, image_url, display_order]
    );

    return NextResponse.json({ success: true, message: 'Thêm ảnh thành công!', data: { id: res.insertId, image_url } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// API 17: Xóa ảnh phụ sản phẩm (Xóa bản ghi CSDL + Xóa file đĩa cứng vật lý)
export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('image_id');

    if (!imageId) {
      return NextResponse.json({ success: false, message: 'Thiếu image_id.' }, { status: 400 });
    }

    // 1. Tìm đường dẫn file ảnh để xóa tệp vật lý
    const rows = await query('SELECT image_url FROM product_images WHERE id = ?', [imageId]);
    if (rows && rows.length > 0) {
      deletePhysicalFile(rows[0].image_url);
    }

    // 2. Xóa bản ghi trong CSDL
    await query('DELETE FROM product_images WHERE id = ?', [imageId]);
    return NextResponse.json({ success: true, message: 'Đã xóa ảnh sản phẩm và giải phóng bộ nhớ đĩa thành công.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

