import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') || formData.get('image');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: 'Vui lòng chọn một file ảnh từ máy tính' },
        { status: 400 }
      );
    }

    // 1. Kiểm tra dung lượng <= 5MB (Theo chuẩn SRS)
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          success: false,
          message: `Dung lượng ảnh (${sizeMB} MB) vượt quá giới hạn 5 MB!`,
        },
        { status: 400 }
      );
    }

    // 2. Kiểm tra định dạng: JPG, PNG, WEBP (Theo chuẩn SRS)
    const ext = path.extname(file.name).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedExts.includes(ext) || (file.type && !allowedMimeTypes.includes(file.type))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Định dạng file không hợp lệ! Hệ thống chỉ chấp nhận ảnh định dạng JPG, PNG, hoặc WEBP.',
        },
        { status: 400 }
      );
    }

    // 3. Đọc dữ liệu nhị phân của file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Đảm bảo thư mục lưu trữ public/uploads tồn tại
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 5. Đặt tên file ngẫu nhiên tránh trùng lặp
    const safeBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e5)}-${safeBaseName}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'Tải ảnh lên thành công',
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error) {
    console.error('Lỗi khi tải ảnh:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi upload: ' + error.message },
      { status: 500 }
    );
  }
}

// Xóa file ảnh vật lý khỏi public/uploads/ để tránh rác ổ cứng
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
      return NextResponse.json({ success: false, message: 'Đường dẫn file không hợp lệ' }, { status: 400 });
    }

    const fileName = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`[Dọn rác bộ nhớ] Đã xóa file ảnh cũ khỏi ổ cứng: ${filePath}`);
    }

    return NextResponse.json({ success: true, message: 'Đã xóa file cũ trên ổ cứng thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa file cũ:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

