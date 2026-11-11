import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 16: Upload ảnh sản phẩm
// POST /admin/products/upload-image hoặc /api/admin/products/upload-image
export async function POST(request) {
  try {
    let productId = null;
    let imageUrl = null;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      productId = body.product_id;
      imageUrl = body.image_url || body.image;
    } else {
      const formData = await request.formData();
      productId = formData.get('product_id');
      imageUrl = formData.get('image_url') || formData.get('image');
    }

    if (!productId || !imageUrl) {
      return NextResponse.json({
        success: false,
        message: 'Thiếu product_id hoặc thông tin ảnh.'
      }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, 1)`,
      [productId, typeof imageUrl === 'string' ? imageUrl : 'products/default.jpg']
    );

    return NextResponse.json({
      success: true,
      message: 'Upload ảnh sản phẩm thành công!',
      id: result.insertId,
      image: typeof imageUrl === 'string' ? imageUrl : 'products/default.jpg'
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

