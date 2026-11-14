-- ============================================================================
-- DỰ ÁN: ĐỔ ĐỐNG 4 MÙA - WEBSITE BÁN TRÁI CÂY TƯƠI ĐẶC SẢN 4 MÙA
-- CƠ SỞ DỮ LIỆU CHUẨN ĐẶC TẢ SRS (SOFTWARE REQUIREMENTS SPECIFICATION)
-- 
-- 1. Cấu trúc CSDL: Bao gồm đúng 22 bảng phân chuẩn theo các chức năng SRS.
-- 2. Quy định dữ liệu mẫu:
--    - Dữ liệu cấu hình bắt buộc theo SRS:
--      + roles (3 vai trò: Admin Tổng, Admin Chi nhánh, Khách hàng)
--      + permissions (18 quyền hạn hệ thống theo SRS)
--      + role_permissions (21 quyền hạn phân theo vai trò)
--      + categories (3 danh mục trái cây gốc chuẩn SRS)
--    - Đúng duy nhất 1 tài khoản mẫu:
--      + users: Trần Vũ (Admin Tổng) - SĐT: 0929894248
--    - Không hardcode dữ liệu giả (mock data):
--      + branches, products, banners, promotions, shipping_fees, system_settings:
--        Để trống hoàn toàn, Quản trị viên tự thêm/cấu hình động 100% qua Admin Studio.
-- ============================================================================

-- MySQL dump 10.13  Distrib 8.4.7, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: do_dong_4_mua
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
--
-- Tự động tạo và chọn cơ sở dữ liệu để tránh lỗi No database selected (#1046)
--
DROP DATABASE IF EXISTS `do_dong_4_mua`;
CREATE DATABASE IF NOT EXISTS `do_dong_4_mua` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `do_dong_4_mua`;


/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ============================================================================
-- BẢNG 01/22: `banners` (FR-012: Quản lý banner quảng cáo)
-- Mục đích: Lưu trữ danh sách banner chạy trên trang chủ, chiến dịch marketing.
-- Nghiệp vụ: Admin tự thêm, sửa, đổi ảnh, liên kết và bật/tắt hiển thị qua UI.
-- Dữ liệu: Để trống (Không nạp mock data, Admin tự cấu hình qua Admin Studio).
-- ============================================================================

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề banner',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn ảnh banner',
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Đường dẫn liên kết khi bấm vào banner',
  `display_order` int NOT NULL DEFAULT '0' COMMENT 'Thứ tự ưu tiên hiển thị',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hiển thị, 0: Ẩn',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý banner khuyến mãi và quảng cáo';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 02/22: `branches` (FR-008: Quản lý chi nhánh)
-- Mục đích: Danh sách các điểm bán / chi nhánh của hệ thống cửa hàng.
-- Nghiệp vụ: Cung cấp địa chỉ xuất kho và phục vụ đo khoảng cách giao hàng.
-- Dữ liệu: Để trống (Admin tự bấm "Thêm Chi Nhánh" trên giao diện Quản trị).
-- ============================================================================

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `branch_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên chi nhánh',
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại chi nhánh',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ chi nhánh',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 0: Tạm đóng',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  KEY `branches_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý danh sách chi nhánh';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 03/22: `cart_items` (FR-004: Giỏ hàng trực tuyến)
-- Mục đích: Chi tiết các món hàng và số lượng mà khách hàng thêm vào giỏ.
-- Quan hệ: cart_id -> carts(id), product_id -> products(id).
-- ============================================================================

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `cart_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng carts(id)',
  `product_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng products(id)',
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  `unit_price` decimal(12,2) DEFAULT '0.00' COMMENT 'Đơn giá sản phẩm tại thời điểm thêm vào giỏ',
  `subtotal` decimal(12,2) DEFAULT '0.00' COMMENT 'Thành tiền dòng = quantity * unit_price',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_cart_product_unique` (`cart_id`,`product_id`),
  KEY `cart_items_product_id_foreign` (`product_id`),
  CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết mặt hàng trong giỏ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 04/22: `carts` (FR-004: Quản lý giỏ hàng)
-- Mục đích: Lưu giỏ hàng của khách hàng theo user_id hoặc session khách vãng lai.
-- ============================================================================

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `user_id` bigint unsigned NOT NULL COMMENT 'Khách hàng sở hữu giỏ',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  `status` tinyint DEFAULT '1' COMMENT 'Trạng thái giỏ hàng (1: Đang kích hoạt, 0: Đã hủy/hoàn tất)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_user_id_unique` (`user_id`),
  CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Giỏ hàng lưu trữ tạm';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 05/22: `categories` (FR-003, BR-004: Quản lý danh mục mùa vụ)
-- Mục đích: Phân loại sản phẩm (Trái cây tươi, Combo gia đình, Giỏ quà biếu).
-- Dữ liệu khởi tạo: Nạp sẵn 3 nhóm danh mục chuẩn quy định bởi SRS.
-- ============================================================================

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên danh mục',
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn tĩnh SEO',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả danh mục',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hiển thị, 0: Ẩn',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục sản phẩm trái cây';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Trái cây tươi','trai-cay-tuoi','Các loại trái cây tươi ngon theo mùa vụ, đạt chuẩn VietGAP và nhập khẩu cao cấp.',1,'2026-10-28 07:02:31','2026-11-01 02:57:56'),(2,'Combo trái cây','combo-trai-cay','Gói kết hợp nhiều loại trái cây ăn gia đình, văn phòng với giá ưu đãi.',1,'2026-10-30 19:24:31','2026-11-01 02:57:57'),(4,'Giỏ quà trái cây','gio-qua-trai-cay','Giỏ quà biếu tặng sang trọng, thiết kế theo mẫu cố định chuẩn chất lượng cao.',1,'2026-10-30 19:28:10','2026-11-01 02:57:57');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 06/22: `order_details` (FR-005, BR-010: Chi tiết đơn hàng)
-- Mục đích: Lưu từng dòng sản phẩm, đơn giá tại thời điểm mua, số lượng và thành tiền.
-- Quan hệ: order_id -> orders(id), product_id -> products(id).
-- ============================================================================

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `order_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng orders(id)',
  `product_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng products(id)',
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng mua',
  `unit_price` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Đơn giá tại thời điểm mua',
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Thành tiền = quantity * unit_price',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  KEY `order_details_order_id_foreign` (`order_id`),
  KEY `order_details_product_id_foreign` (`product_id`),
  CONSTRAINT `order_details_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết các món trong đơn hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 07/22: `orders` (FR-005, FR-006, BR-009: Quản lý đơn hàng)
-- Mục đích: Quản lý đơn đặt hàng, thông tin giao nhận, tiền hàng, cước phí và trạng thái.
-- Trạng thái: CHO_XAC_NHAN, DANG_XU_LY, DANG_GIAO, HOAN_THANH, DA_HUY, TAM_DUNG.
-- ============================================================================

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `order_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã đơn dạng OD...',
  `user_id` bigint unsigned NOT NULL COMMENT 'Khách hàng đặt mua',
  `receiver_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên người nhận hàng',
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SĐT người nhận',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ giao hàng',
  `note` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú giao hàng',
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Tiền hàng',
  `shipping_fee` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Phí vận chuyển',
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Tổng thanh toán',
  `payment_status` enum('UNPAID','PAID') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNPAID' COMMENT 'Trạng thái thanh toán',
  `order_status` enum('CHO_THANH_TOAN','CHO_XAC_NHAN','DA_XAC_NHAN','DANG_CHUAN_BI','TAM_DUNG','DANG_GIAO','DA_GIAO','DA_HUY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHO_XAC_NHAN' COMMENT 'Vòng đời 8 trạng thái',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_code_unique` (`order_code`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_order_status_index` (`order_status`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông tin đơn hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 08/22: `payments` (FR-007, BR-015: Quản lý thanh toán & Đối soát)
-- Mục đích: Ghi nhận giao dịch thanh toán COD, MoMo hoặc VietQR kèm mã giao dịch ngân hàng.
-- ============================================================================

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `order_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng orders(id)',
  `payment_method` enum('COD','VIETQR','MOMO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COD' COMMENT 'Phương thức thanh toán',
  `transaction_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã giao dịch ngân hàng/ví',
  `payment_amount` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Số tiền thanh toán',
  `payment_status` enum('PENDING','PAID','FAILED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING' COMMENT 'Trạng thái thanh toán',
  `payment_time` datetime DEFAULT NULL COMMENT 'Thời gian thanh toán',
  `note` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_order_id_unique` (`order_id`),
  KEY `payments_transaction_code_index` (`transaction_code`),
  CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lịch sử và trạng thái thanh toán';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 09/22: `permissions` (FR-039, BR-026: Danh mục quyền hạn hệ thống)
-- Mục đích: Định nghĩa 18 quyền hạn chức năng cụ thể theo tài liệu SRS.
-- Dữ liệu khởi tạo: Nạp sẵn 18 quyền hạn chuẩn của hệ thống.
-- ============================================================================

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `permission_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên quyền',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả quyền',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_permission_name_unique` (`permission_name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục quyền hệ thống';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'product.view','Xem danh sách sản phẩm','2026-10-30 19:08:32','2026-10-30 19:08:32'),(2,'product.create','Thêm sản phẩm mới','2026-10-30 19:08:32','2026-10-30 19:08:32'),(3,'product.update','Cập nhật thông tin sản phẩm','2026-10-30 19:08:32','2026-10-30 19:08:32'),(4,'product.delete','Xóa sản phẩm','2026-10-30 19:08:32','2026-10-30 19:08:32'),(5,'category.manage','Quản lý danh mục mùa vụ','2026-10-30 19:08:32','2026-10-30 19:08:32'),(6,'order.view','Xem danh sách đơn hàng','2026-10-30 19:08:32','2026-10-30 19:08:32'),(7,'order.update','Cập nhật trạng thái đơn & vận đơn','2026-10-30 19:08:32','2026-10-30 19:08:32'),(8,'order.cancel','Hủy đơn hàng','2026-10-30 19:08:32','2026-10-30 19:08:32'),(9,'shipment.manage','Quản lý vận đơn GreenSM','2026-10-30 19:08:32','2026-10-30 19:08:32'),(10,'promotion.manage','Quản lý chương trình khuyến mãi','2026-10-30 19:08:32','2026-10-30 19:08:32'),(11,'branch.manage','Quản lý chi nhánh','2026-10-30 19:08:32','2026-10-30 19:08:32'),(12,'banner.manage','Quản lý banner quảng cáo','2026-10-30 19:08:32','2026-10-30 19:08:32'),(13,'report.view','Xem báo cáo doanh thu','2026-10-30 19:08:32','2026-10-30 19:08:32'),(14,'user.manage','Quản lý tài khoản quản trị','2026-10-30 19:08:32','2026-10-30 19:08:32'),(15,'system.log','Xem nhật ký hệ thống','2026-10-30 19:08:32','2026-10-30 19:08:32'),(16,'inventory.manage','Quản lý tồn kho trái cây chi nhánh','2026-11-01 01:54:43','2026-11-01 01:57:07'),(17,'customer.view','Quản lý danh sách khách hàng','2026-11-01 01:54:43','2026-11-01 01:57:07'),(18,'payment.confirm','Quản lý và xác nhận thanh toán','2026-11-01 01:54:43','2026-11-01 01:57:07');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 10/22: `product_images` (FR-002: Thư viện ảnh sản phẩm)
-- Mục đích: Lưu các góc ảnh chụp thực tế chi tiết của từng loại trái cây.
-- ============================================================================

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `product_id` bigint unsigned NOT NULL COMMENT 'Sản phẩm tương ứng',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn ảnh',
  `display_order` int NOT NULL DEFAULT '0' COMMENT 'Thứ tự hiển thị',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `sort_order` int DEFAULT '1' COMMENT 'Thứ tự sắp xếp hiển thị ảnh',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bộ sưu tập ảnh chi tiết sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 11/22: `products` (FR-002, BR-001: Quản lý sản phẩm trái cây)
-- Mục đích: Thông tin tên, đường dẫn tĩnh SEO, giá bán, giá khuyến mãi, số lượng tồn kho.
-- Dữ liệu: Để trống (Không nạp mock data, Admin tự đăng sản phẩm qua UI).
-- ============================================================================

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `category_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại danh mục',
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên sản phẩm',
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn tĩnh SEO',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả chi tiết',
  `price` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Giá gốc',
  `discount_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá khuyến mãi nếu có',
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kg' COMMENT 'Đơn vị tính (kg, giỏ, combo)',
  `stock` int NOT NULL DEFAULT '0' COMMENT 'Số lượng tồn kho',
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ảnh đại diện chính',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1: Nổi bật, 0: Bình thường',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Đang bán, 0: Ngừng bán',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_status_index` (`status`),
  KEY `products_is_featured_index` (`is_featured`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin sản phẩm trái cây';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 12/22: `promotion_products` (FR-010, BR-018: Sản phẩm áp dụng khuyến mãi)
-- Mục đích: Bảng liên kết giữa chương trình khuyến mãi và sản phẩm áp dụng.
-- ============================================================================

DROP TABLE IF EXISTS `promotion_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `promotion_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng promotions(id)',
  `product_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng products(id)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `promotion_products_unique` (`promotion_id`,`product_id`),
  KEY `promotion_products_product_id_foreign` (`product_id`),
  CONSTRAINT `promotion_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promotion_products_promotion_id_foreign` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Liên kết khuyến mãi và sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_products`
--

LOCK TABLES `promotion_products` WRITE;
/*!40000 ALTER TABLE `promotion_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion_products` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 13/22: `promotions` (FR-010, BR-017: Quản lý chương trình khuyến mãi)
-- Mục đích: Lưu các đợt giảm giá theo %, thời gian bắt đầu - kết thúc.
-- Dữ liệu: Để trống (Admin tự tạo chiến dịch khuyến mãi từ giao diện Quản trị).
-- ============================================================================

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề khuyến mãi',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Nội dung chi tiết',
  `discount_percent` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'Phần trăm giảm giá',
  `start_date` datetime NOT NULL COMMENT 'Thời gian bắt đầu',
  `end_date` datetime NOT NULL COMMENT 'Thời gian kết thúc',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 0: Hết hạn/Tắt',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  KEY `promotions_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chương trình khuyến mãi';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 14/22: `role_permissions` (FR-039: Ma trận quyền hạn theo vai trò)
-- Mục đích: Gán quyền hạn mặc định cho từng vai trò theo quy định SRS.
-- Dữ liệu khởi tạo: Nạp sẵn ma trận quyền cho Admin Tổng và Admin Chi nhánh.
-- ============================================================================

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `role_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng roles(id)',
  `permission_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng permissions(id)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_perm_unique` (`role_id`,`permission_id`),
  KEY `role_permissions_permission_id_foreign` (`permission_id`),
  CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng phân quyền vai trò';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1,12,'2026-10-30 19:08:32'),(2,1,11,'2026-10-30 19:08:32'),(3,1,5,'2026-10-30 19:08:32'),(4,1,8,'2026-10-30 19:08:32'),(5,1,7,'2026-10-30 19:08:32'),(6,1,6,'2026-10-30 19:08:32'),(7,1,2,'2026-10-30 19:08:32'),(8,1,4,'2026-10-30 19:08:32'),(9,1,3,'2026-10-30 19:08:32'),(10,1,1,'2026-10-30 19:08:32'),(11,1,10,'2026-10-30 19:08:32'),(12,1,13,'2026-10-30 19:08:32'),(13,1,9,'2026-10-30 19:08:32'),(14,1,15,'2026-10-30 19:08:32'),(15,1,14,'2026-10-30 19:08:32'),(75,2,1,'2026-10-30 19:55:33'),(76,2,2,'2026-10-30 19:55:33'),(77,2,6,'2026-10-30 19:55:33'),(78,2,7,'2026-10-30 19:55:33'),(79,2,9,'2026-10-30 19:55:33'),(80,2,13,'2026-10-30 19:55:33');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 15/22: `roles` (FR-001, FR-039: Danh mục vai trò người dùng)
-- Mục đích: 3 nhóm người dùng gồm: Admin Tổng (1), Admin Chi nhánh (2), Khách hàng (3).
-- Dữ liệu khởi tạo: Nạp sẵn 3 vai trò chuẩn quy định bởi SRS.
-- ============================================================================

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên vai trò',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả vai trò',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_role_name_unique` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng vai trò người dùng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin Tổng','Quản trị viên toàn quyền hệ thống','2026-10-28 06:30:18','2026-10-28 06:30:18'),(2,'Admin Chi nhánh','Quản lý kho và đơn hàng tại chi nhánh','2026-10-28 06:30:18','2026-10-28 06:30:18'),(3,'Khách hàng','Người mua hàng trực tuyến','2026-10-28 06:30:18','2026-10-28 06:30:18');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 16/22: `shipments` (FR-009, BR-014: Quản lý vận đơn GreenSM Logistics)
-- Mục đích: Theo dõi mã vận đơn GSM, thông tin tài xế, phí ship và trạng thái giao hàng.
-- Trạng thái: CHO_GIAO, DANG_GIAO, GIAO_THANH_CONG, GIAO_THAT_BAI.
-- ============================================================================

DROP TABLE IF EXISTS `shipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `order_id` bigint unsigned NOT NULL COMMENT 'Đơn hàng vận chuyển',
  `shipping_company` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GreenSM' COMMENT 'Đơn vị vận chuyển (mặc định GreenSM)',
  `tracking_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã vận đơn tra cứu',
  `shipping_fee` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Phí vận chuyển',
  `shipping_status` enum('CHO_TAO_VAN_DON','DA_TAO_VAN_DON','DA_BAN_GIAO_GREENSM','DANG_GIAO','GIAO_THANH_CONG','GIAO_THAT_BAI') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHO_TAO_VAN_DON' COMMENT 'Trạng thái vận chuyển',
  `ship_date` datetime DEFAULT NULL COMMENT 'Ngày bàn giao đơn vị vận chuyển',
  `delivery_date` datetime DEFAULT NULL COMMENT 'Ngày giao hàng thành công',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  UNIQUE KEY `shipments_order_id_unique` (`order_id`),
  UNIQUE KEY `shipments_tracking_code_unique` (`tracking_code`),
  CONSTRAINT `shipments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý vận đơn và lộ trình giao hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipments`
--

LOCK TABLES `shipments` WRITE;
/*!40000 ALTER TABLE `shipments` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipments` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 17/22: `system_logs` (FR-045, BR-027: Nhật ký kiểm toán hệ thống)
-- Mục đích: Ghi nhận lịch sử thao tác của quản trị viên (thời gian, IP, hành động).
-- Nghiệp vụ: Bất biến, không cho phép chỉnh sửa hoặc xóa theo SRS.
-- ============================================================================

DROP TABLE IF EXISTS `system_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `user_id` bigint unsigned DEFAULT NULL COMMENT 'Người thực hiện hành động (NULL nếu là khách vãng lai hoặc hệ thống tự động)',
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hành động: CREATE, UPDATE, DELETE, LOGIN, EXPORT...',
  `module` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SYSTEM' COMMENT 'Phân hệ: PRODUCT, ORDER, AUTH, BRANCH...',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả chi tiết thao tác',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Địa chỉ IP (hỗ trợ IPv4 & IPv6)',
  `user_agent` text COLLATE utf8mb4_unicode_ci COMMENT 'Thông tin trình duyệt và thiết bị',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm ghi nhận nhật ký',
  PRIMARY KEY (`id`),
  KEY `system_logs_user_id_foreign` (`user_id`),
  KEY `system_logs_module_action_index` (`module`,`action`),
  CONSTRAINT `system_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=372 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký thao tác và audit log hệ thống';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_logs`
--

LOCK TABLES `system_logs` WRITE;
/*!40000 ALTER TABLE `system_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_logs` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 18/22: `user_permissions` (FR-039: Phân quyền riêng cho từng tài khoản)
-- Mục đích: Cấp hoặc thu hồi quyền chuyên biệt cho từng Admin Chi nhánh.
-- ============================================================================

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `user_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng users(id)',
  `permission_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại liên kết tới bảng permissions(id)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_perm` (`user_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng phân quyền riêng biệt cho từng tài khoản (FR-039)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 19/22: `users` (FR-001, FR-038: Quản lý tài khoản người dùng)
-- Mục đích: Lưu thông tin tài khoản đăng nhập (SĐT, mật khẩu mã hóa bcrypt, họ tên, vai trò).
-- Dữ liệu khởi tạo: CHỈ NẠP ĐÚNG 1 TÀI KHOẢN MẪU DUY NHẤT:
--   -> Tài khoản: Trần Vũ (Admin Tổng) | SĐT: 0929894248 | Mật khẩu hash chuẩn SRS
--   -> Khách hàng và Admin Chi nhánh sẽ do hệ thống tạo động hoặc khách tự đăng ký.
-- ============================================================================

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `role_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại tới bảng roles',
  `branch_id` bigint unsigned DEFAULT NULL COMMENT 'Khóa ngoại tới branches (nếu là quản trị chi nhánh)',
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ và tên',
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại duy nhất dùng đăng nhập',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mật khẩu đã mã hóa',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Địa chỉ mặc định',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 0: Bị khóa',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Token ghi nhớ đăng nhập',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_phone_unique` (`phone`),
  KEY `users_role_id_foreign` (`role_id`),
  KEY `users_branch_id_foreign` (`branch_id`),
  CONSTRAINT `users_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý tài khoản người dùng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,NULL,'Trần Vũ (Admin Tổng)','0929894248','$2b$10$2m8T5gwndtV1blYG2f2CbeDX2mNye3Y88G5psYUv.8Zo0H.6jZqTC','53 Võ Văn Ngân, Thủ Đức',1,'2026-10-28 06:30:18','2026-10-30 21:50:46',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

-- ============================================================================
-- BẢNG 20/22: `notifications` (FR-046: Hệ thống thông báo đẩy quản trị)
-- Mục đích: Quản trị viên phát thông báo cho toàn hệ thống, chi nhánh hoặc đích danh người nhận.
-- ============================================================================

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề thông báo',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nội dung chi tiết thông báo',
  `recipient_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ALL' COMMENT 'ALL, BRANCH_ADMIN, CUSTOMER, SPECIFIC',
  `recipient_ids` text COLLATE utf8mb4_unicode_ci COMMENT 'Danh sách ID nhận dạng JSON nếu là SPECIFIC',
  `recipient_names` text COLLATE utf8mb4_unicode_ci COMMENT 'Tên hiển thị người nhận',
  `sender_id` bigint unsigned NOT NULL COMMENT 'ID tài khoản quản trị gửi',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  KEY `idx_recipient` (`recipient_type`),
  KEY `idx_created` (`created_at`),
  KEY `fk_notifications_sender` (`sender_id`),
  CONSTRAINT `fk_notifications_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hệ thống thông báo đẩy quản trị (FR-046)';
/*!40101 SET character_set_client = @saved_cs_client */;

-- ============================================================================
-- BẢNG 21/22: `shipping_fees` (FR-044, BR-023: Quản lý cước phí vận chuyển)
-- Mục đích: Thiết lập mức cước phí giao hàng tự động theo cự ly khoảng cách (km).
-- Dữ liệu: Để trống (Không nạp mock data, Admin tự thêm các nấc phí qua UI).
-- ============================================================================

DROP TABLE IF EXISTS `shipping_fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_fees` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Mã định danh duy nhất (Khóa chính)',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên gói/nấc cước',
  `min_km` decimal(6,2) NOT NULL DEFAULT '0.00' COMMENT 'Khoảng cách từ (km)',
  `max_km` decimal(6,2) NOT NULL DEFAULT '0.00' COMMENT 'Khoảng cách đến (km)',
  `fee` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT 'Mức phí vận chuyển (VNĐ)',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Áp dụng, 0: Tạm dừng',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cấu hình nấc cước phí vận chuyển theo khoảng cách';
/*!40101 SET character_set_client = @saved_cs_client */;

-- ============================================================================
-- BẢNG 22/22: `system_settings` (FR-043: Quản lý cấu hình chung website)
-- Mục đích: Lưu nhận diện thương hiệu (tên, logo, hotline, email, địa chỉ) và 4 chính sách.
-- Quy tắc: Chỉ Admin Tổng có quyền chỉnh sửa. Thay đổi có hiệu lực ngay sau khi lưu.
-- Dữ liệu: Để trống (Không nạp mock data, Admin tự cấu hình và lưu trực tiếp từ UI).
-- ============================================================================

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã định danh cấu hình',
  `setting_value` text COLLATE utf8mb4_unicode_ci COMMENT 'Giá trị cấu hình JSON hoặc chuỗi',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cấu hình thông số hệ thống website';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` (`setting_key`, `setting_value`) VALUES ('date_format','dd/mm/yyyy');
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-02 13:18:15
