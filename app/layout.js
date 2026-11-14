import './globals.css';
import { CartProvider } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata = {
  title: 'Đổ Đống 4 Mùa - Website Bán Trái Cây Đặc Sản Tươi Ngon',
  description: 'Hệ thống cung cấp trái cây tươi ngon 4 mùa Xuân - Hạ - Thu - Đông, cam kết bao ăn 1 đổi 1 trong 24h, giao nhanh qua GreenSM.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

