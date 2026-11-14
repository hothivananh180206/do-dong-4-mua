'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, ShoppingCart, Package, Users, User, AlertTriangle,
  CheckCircle2, Clock, Truck, Plus, Eye, Edit3, Trash2, RefreshCw,
  ArrowLeft, Filter, Tag, Percent, Image as ImageIcon, MapPin,
  FileText, Play, Pause, XCircle, Search, Upload, Lock, LogOut,
  ExternalLink, ShieldCheck, Leaf, ChevronRight, Sparkles, Store,
  Box, BarChart3, PackageOpen, Layers, UserPlus, Unlock, KeyRound, ShieldAlert, EyeOff, Calendar, RotateCcw, X, Settings, Bell, Send, Download, ZoomIn, ZoomOut, Move, Globe, Crop, Check, Menu
} from 'lucide-react';
import Pagination from '@/components/Pagination';
import LogoCropperModal from '@/components/common/LogoCropperModal';
import { getAuthSession, saveAuthSession, clearAuthSession } from '@/lib/auth-session';
import { formatDate, formatDateTime } from '@/lib/date';

// ADMIN TABS (Modularized JSX)
import AdminOrdersTab from '@/components/admin/tabs/AdminOrdersTab';
import AdminProductsTab from '@/components/admin/tabs/AdminProductsTab';
import AdminCategoriesTab from '@/components/admin/tabs/AdminCategoriesTab';
import AdminPromotionsTab from '@/components/admin/tabs/AdminPromotionsTab';
import AdminBranchesTab from '@/components/admin/tabs/AdminBranchesTab';
import AdminBannersTab from '@/components/admin/tabs/AdminBannersTab';
import AdminUsersTab from '@/components/admin/tabs/AdminUsersTab';
import AdminCustomersTab from '@/components/admin/tabs/AdminCustomersTab';
import AdminLogsTab from '@/components/admin/tabs/AdminLogsTab';
import AdminReportsTab from '@/components/admin/tabs/AdminReportsTab';
import AdminSettingsTab from '@/components/admin/tabs/AdminSettingsTab';
import AdminNotificationsTab from '@/components/admin/tabs/AdminNotificationsTab';

// ADMIN MODALS (Modularized JSX)
import ProductModals from '@/components/admin/modals/ProductModals';
import CategoryModals from '@/components/admin/modals/CategoryModals';
import PromotionModals from '@/components/admin/modals/PromotionModals';
import BranchModals from '@/components/admin/modals/BranchModals';
import BannerModals from '@/components/admin/modals/BannerModals';
import UserAdminModals from '@/components/admin/modals/UserAdminModals';
import OrderDetailModals from '@/components/admin/modals/OrderDetailModals';
import CustomerDetailModal from '@/components/admin/modals/CustomerDetailModal';
import UserActionModal from '@/components/admin/modals/UserActionModal';
import ShippingFeeModals from '@/components/admin/modals/ShippingFeeModals';
import NotificationModals from '@/components/admin/modals/NotificationModals';


// 10 Nhóm chức năng phân quyền cụ thể theo SRS (FR-039 & BR-026)
const SRS_FUNCTIONAL_MODULES = [
  {
    id: 'orders',
    title: 'Quản lý đơn hàng',
    description: 'Xem danh sách, cập nhật trạng thái đơn và tiếp nhận đơn đặt hàng',
    permissionIds: [6, 7, 8],
    permissionNames: ['order.view', 'order.update', 'order.cancel'],
    tabKey: 'orders'
  },
  {
    id: 'inventory',
    title: 'Quản lý tồn kho',
    description: 'Kiểm kê, cảnh báo và cập nhật số lượng tồn kho trái cây chi nhánh',
    permissionIds: [16],
    permissionNames: ['inventory.manage'],
    tabKey: 'products'
  },
  {
    id: 'reports',
    title: 'Quản lý báo cáo doanh thu',
    description: 'Xem thống kê doanh thu, số lượng đơn hàng và biểu đồ kinh doanh',
    permissionIds: [13],
    permissionNames: ['report.view'],
    tabKey: 'reports'
  },
  {
    id: 'promotions',
    title: 'Quản lý chương trình giảm giá',
    description: 'Thiết lập mã giảm giá, voucher và chương trình ưu đãi mùa vụ',
    permissionIds: [10],
    permissionNames: ['promotion.manage'],
    tabKey: 'promotions'
  },
  {
    id: 'customers',
    title: 'Quản lý khách hàng',
    description: 'Tra cứu danh sách khách hàng, điểm tích lũy và thông tin liên hệ',
    permissionIds: [17],
    permissionNames: ['customer.view'],
    tabKey: 'customers'
  },
  {
    id: 'payments',
    title: 'Quản lý thanh toán',
    description: 'Xác nhận và kiểm tra đối soát thanh toán chuyển khoản',
    permissionIds: [18],
    permissionNames: ['payment.confirm'],
    tabKey: 'orders'
  },
  {
    id: 'shipments',
    title: 'Quản lý giao hàng',
    description: 'Tạo mã vận đơn, theo dõi lộ trình và kết nối tài xế GreenSM',
    permissionIds: [9],
    permissionNames: ['shipment.manage'],
    tabKey: 'orders'
  },
  {
    id: 'categories',
    title: 'Quản lý danh mục',
    description: 'Quản lý nhóm trái cây, phân loại sản phẩm theo mùa vụ',
    permissionIds: [5],
    permissionNames: ['category.manage'],
    tabKey: 'categories'
  },
  {
    id: 'products',
    title: 'Quản lý sản phẩm',
    description: 'Thêm, sửa thông tin, giá bán và hình ảnh trái cây nông sản',
    permissionIds: [1, 2, 3, 4],
    permissionNames: ['product.view', 'product.create', 'product.update', 'product.delete'],
    tabKey: 'products'
  },
  {
    id: 'banners',
    title: 'Quản lý cấu hình banner / website',
    description: 'Cập nhật banner quảng bá, chương trình hiển thị trang chủ',
    permissionIds: [12],
    permissionNames: ['banner.manage'],
    tabKey: 'banners'
  }
];

// Bảng chuyển đổi ngôn ngữ tự nhiên tiếng Việt cho Nhật Ký Kiểm Toán (FR-045)
const LOG_ACTION_LABELS = {
  // Đơn hàng & Vận chuyển
  UPDATE_STATUS: 'Đổi trạng thái đơn',
  UPDATE_ORDER_STATUS: 'Đổi trạng thái đơn',
  CREATE_ORDER: 'Tạo đơn hàng',
  CANCEL_ORDER: 'Hủy đơn hàng',
  CANCEL: 'Hủy đơn hàng',
  APPROVE: 'Duyệt đơn hàng',
  PAUSE: 'Tạm dừng đơn',
  RESUME: 'Tiếp tục xử lý',
  ORDER_NOTE: 'Thêm ghi chú',
  ADD_ORDER_NOTE: 'Thêm ghi chú',
  CREATE_SHIPMENT: 'Tạo vận đơn GreenSM',
  UPDATE_SHIPMENT: 'Cập nhật giao hàng',

  // Khách hàng & Tài khoản
  AUTO_REGISTER: 'Tự động tạo tài khoản',
  REGISTER: 'Đăng ký tài khoản',
  LOGIN: 'Đăng nhập',
  LOGOUT: 'Đăng xuất',
  CHANGE_PASSWORD: 'Đổi mật khẩu',
  RESET_PASSWORD: 'Đặt lại mật khẩu',
  FORGOT_PASSWORD: 'Quên mật khẩu',
  UPDATE_PROFILE: 'Cập nhật hồ sơ',
  LOCK: 'Khóa tài khoản',
  UNLOCK: 'Mở khóa',
  LOCK_USER: 'Khóa tài khoản',
  UNLOCK_USER: 'Mở khóa tài khoản',

  // Sản phẩm
  CREATE_PRODUCT: 'Thêm sản phẩm',
  UPDATE_PRODUCT: 'Sửa sản phẩm',
  PATCH_PRODUCT: 'Sửa nhanh sản phẩm',
  DELETE_PRODUCT: 'Xóa sản phẩm',
  UPDATE_STOCK: 'Cập nhật tồn kho',

  // Danh mục
  CREATE_CATEGORY: 'Thêm danh mục',
  UPDATE_CATEGORY: 'Sửa danh mục',
  DELETE_CATEGORY: 'Xóa danh mục',
  TOGGLE_CATEGORY_STATUS: 'Bật/Tắt danh mục',

  // Khuyến mãi
  CREATE_PROMOTION: 'Tạo khuyến mãi',
  UPDATE_PROMOTION: 'Sửa khuyến mãi',
  DELETE_PROMOTION: 'Xóa khuyến mãi',
  TOGGLE_PROMOTION: 'Bật/Tắt khuyến mãi',
  ASSIGN_PROMOTION_PRODUCTS: 'Gán SP khuyến mãi',
  REMOVE_PROMOTION_PRODUCT: 'Gỡ SP khuyến mãi',

  // Banner
  CREATE_BANNER: 'Thêm banner',
  UPDATE_BANNER: 'Sửa banner',
  DELETE_BANNER: 'Xóa banner',

  // Chi nhánh
  CREATE_BRANCH: 'Thêm chi nhánh',
  UPDATE_BRANCH: 'Sửa chi nhánh',
  DELETE_BRANCH: 'Xóa chi nhánh',

  // Cấu hình & Quản trị
  UPDATE_SETTINGS: 'Đổi cấu hình web',
  ASSIGN_PERMISSIONS: 'Phân quyền',
  UPDATE_PERMISSIONS: 'Cập nhật phân quyền',
  UPDATE_ROLE_PERMISSIONS: 'Cập nhật quyền vai trò',
  CREATE_ADMIN: 'Tạo quản trị viên',
  UPDATE_ADMIN: 'Sửa quản trị viên',
  DELETE_ADMIN: 'Xóa quản trị viên',

  // Nấc cước & Thông báo
  CREATE_SHIPPING_FEE: 'Thêm nấc cước phí',
  UPDATE_SHIPPING_FEE: 'Cập nhật nấc cước phí',
  DELETE_SHIPPING_FEE: 'Xóa nấc cước phí',
  CREATE_NOTIFICATION: 'Gửi thông báo',
  DELETE_NOTIFICATION: 'Xóa thông báo',

  // Thanh toán & Báo cáo
  PAYMENT: 'Thanh toán đơn hàng',
  PAYMENT_WEBHOOK: 'Xác nhận thanh toán',
  EXPORT_EXCEL: 'Xuất báo cáo Excel',
  EXPORT_PDF: 'Xuất báo cáo PDF',
  CREATE: 'Thêm mới',
  UPDATE: 'Cập nhật',
  DELETE: 'Xóa bỏ',
};

const LOG_MODULE_LABELS = {
  ORDER: 'Đơn hàng',
  PRODUCT: 'Sản phẩm',
  CATEGORY: 'Danh mục',
  PROMOTION: 'Khuyến mãi',
  BANNER: 'Banner',
  BRANCH: 'Chi nhánh',
  SYSTEM: 'Cấu hình hệ thống',
  SHIPMENT: 'Giao hàng',
  AUTH: 'Xác thực tài khoản',
  USER: 'Tài khoản & Khách',
  CUSTOMER: 'Khách hàng',
  ADMIN: 'Quản trị viên',
  PERMISSION: 'Phân quyền',
  PAYMENT: 'Thanh toán',
  NOTIFICATION: 'Thông báo',
  SHIPPING: 'Vận chuyển',
};

const getLogActionLabel = (action) => {
  if (!action) return 'Thao tác';
  if (LOG_ACTION_LABELS[action]) return LOG_ACTION_LABELS[action];
  const upper = String(action).toUpperCase();
  if (LOG_ACTION_LABELS[upper]) return LOG_ACTION_LABELS[upper];
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
};

const getLogModuleLabel = (module) => {
  if (!module) return 'Hệ thống';
  if (LOG_MODULE_LABELS[module]) return LOG_MODULE_LABELS[module];
  const upper = String(module).toUpperCase();
  if (LOG_MODULE_LABELS[upper]) return LOG_MODULE_LABELS[upper];
  return module
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
};

const formatLogDescription = (desc) => {
  if (!desc || typeof desc !== 'string') return desc || '';
  return desc
    // Trạng thái đơn hàng
    .replace(/\bCHO_XAC_NHAN\b/g, 'Chờ xác nhận (COD)')
    .replace(/\bCHO_THANH_TOAN\b/g, 'Chờ thanh toán (VietQR)')
    .replace(/\bDA_XAC_NHAN\b/g, 'Đã xác nhận đơn hàng')
    .replace(/\bDANG_CHUAN_BI\b/g, 'Đang chuẩn bị hàng')
    .replace(/\bDANG_GIAO\b/g, 'Đang giao hàng (GreenSM)')
    .replace(/\bDA_GIAO\b/g, 'Giao hàng thành công')
    .replace(/\bTAM_DUNG\b/g, 'Tạm dừng xử lý')
    .replace(/\bDA_HUY\b/g, 'Đã hủy đơn hàng')
    // Vận chuyển & thanh toán
    .replace(/\bDA_TAO_VAN_DON\b/g, 'Đã tạo vận đơn')
    .replace(/\bDA_BAN_GIAO_GREENSM\b/g, 'Đã bàn giao GreenSM')
    .replace(/\bGIAO_THANH_CONG\b/g, 'Giao thành công')
    .replace(/\bGIAO_THAT_BAI\b/g, 'Giao thất bại')
    .replace(/\bPAID\b/g, 'Đã thanh toán')
    .replace(/\bUNPAID\b/g, 'Chưa thanh toán');
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'categories', 'promotions', 'branches', 'banners', 'admins', 'customers', 'logs', 'reports'
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(tab);
      }
      // SRS NFR-006: Kiểm tra phiên đăng nhập tự động hết hạn sau 24h
      // Khôi phục cấu hình website từ cache nếu có để tránh giật lag hiển thị
      try {
        const cachedSettings = localStorage.getItem('dodong4mua_site_settings');
        if (cachedSettings) {
          const parsed = JSON.parse(cachedSettings);
          if (parsed && parsed.site_name) setSiteSettings(parsed);
        }
      } catch (e) { }

      const u = getAuthSession();
      if (u && (u.isAdmin || u.role_id === 1 || u.role_id === 2)) {
        setCurrentUser(u);
        if (u.role_id === 2) {
          fetch(`/api/admin/permissions?user_id=${u.id}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.data) {
                const assignedIds = data.data.user_permission_ids || [];
                const permNames = [];
                SRS_FUNCTIONAL_MODULES.forEach((m) => {
                  if (m.permissionIds.some((id) => assignedIds.includes(id))) {
                    permNames.push(...m.permissionNames);
                  }
                });
                const updated = { ...u, permissions: Array.from(new Set(permNames)) };
                setCurrentUser(updated);
                saveAuthSession(updated);
              }
            })
            .catch(() => { });
        }
      }
    } catch (e) { }
    setCheckingAuth(false);
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!adminPhone || !adminPhone.trim()) {
      setLoginError('Vui lòng nhập số điện thoại Quản Trị!');
      return;
    }
    if (!adminPassword) {
      setLoginError('Vui lòng nhập mật khẩu Quản Trị!');
      return;
    }
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: adminPhone, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.user.isAdmin || data.user.role_id === 1 || data.user.role_id === 2) {
          saveAuthSession(data.user);
          setCurrentUser(data.user);
          loadData();
        } else {
          setLoginError('Tài khoản này là Khách Hàng, không có quyền truy cập trang Quản Trị!');
        }
      } else {
        setLoginError(data.message || 'Số điện thoại hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setLoginError('Lỗi kết nối máy chủ: ' + err.message);
    }
  };

  const handleAdminLogout = async () => {
    try {
      if (currentUser?.id) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id, phone: currentUser.phone })
        });
      }
    } catch (e) {
      console.warn('Lỗi gọi API đăng xuất admin:', e);
    }
    clearAuthSession();
    setCurrentUser(null);
  };

  // SRS NFR-006: Định kỳ kiểm tra phiên đăng nhập tự động hết hạn sau 24h
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      const activeSession = getAuthSession();
      if (!activeSession) {
        setCurrentUser(null);
        showToast('Phiên làm việc đã hết hạn sau 24 giờ. Vui lòng đăng nhập lại.', 'warning');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [banners, setBanners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStartDate, setOrderStartDate] = useState('');
  const [orderEndDate, setOrderEndDate] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('');

  // Promotions filter & pagination states
  const [promotionSearch, setPromotionSearch] = useState('');
  const [promotionStatusFilter, setPromotionStatusFilter] = useState('');
  const [promotionPage, setPromotionPage] = useState(1);
  const [promotionPageSize, setPromotionPageSize] = useState(10);

  useEffect(() => {
    setPromotionPage(1);
  }, [promotionSearch, promotionStatusFilter]);

  // Pagination states (Chuẩn KhoHang_JAVA: phân trang trượt + ô nhảy trang "Nhập...")
  const [productPage, setProductPage] = useState(1);
  const [productPageSize, setProductPageSize] = useState(10);
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(10);
  const [customerPage, setCustomerPage] = useState(1);
  const [customerPageSize, setCustomerPageSize] = useState(10);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('');
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [loadingCustomerDetail, setLoadingCustomerDetail] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [logPageSize, setLogPageSize] = useState(15);
  const [logSearch, setLogSearch] = useState('');
  const [logModuleFilter, setLogModuleFilter] = useState('ALL');
  const [logStats, setLogStats] = useState({ total: 0, today: 0, uniqueIps: 0 });
  const [refreshingLogs, setRefreshingLogs] = useState(false);

  useEffect(() => {
    setProductPage(1);
  }, [productSearch, productCategoryFilter, productStatusFilter]);

  useEffect(() => {
    setOrderPage(1);
  }, [orderStatusFilter, orderSearch, orderStartDate, orderEndDate]);

  // Order Detail Modal (FR-030)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState({
    isOpen: false,
    product: null,
    name: '',
    category_id: 1,
    price: '',
    discount_price: '',
    unit: 'kg',
    stock: 0,
    thumbnail: '',
    description: '',
    is_featured: 0,
    status: 1,
  });
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddPromotionModal, setShowAddPromotionModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [branchSearch, setBranchSearch] = useState('');
  const [branchStatusFilter, setBranchStatusFilter] = useState('');
  const [editingBranch, setEditingBranch] = useState(null);
  const [deletingBranch, setDeletingBranch] = useState(null);
  const [toggleStatusBranch, setToggleStatusBranch] = useState(null);
  const [bannerSearch, setBannerSearch] = useState('');
  const [bannerStatusFilter, setBannerStatusFilter] = useState('');
  const [editingBanner, setEditingBanner] = useState(null);
  const [deletingBanner, setDeletingBanner] = useState(null);

  // Quản lý cấu hình website (FR-043)
  const [siteSettings, setSiteSettings] = useState({
    site_name: '',
    logo_url: '',
    hotline: '',
    contact_email: '',
    company_address: '',
    exchange_policy: '',
    shipping_policy: '',
    privacy_policy: '',
    terms_of_service: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Quản lý phí vận chuyển theo khoảng cách (FR-044 & BR-023)
  const [shippingFees, setShippingFees] = useState([]);
  const [showAddShippingFeeModal, setShowAddShippingFeeModal] = useState(false);
  const [newShippingFee, setNewShippingFee] = useState({ name: '', min_km: '', max_km: '', fee: '' });
  const [editingShippingFee, setEditingShippingFee] = useState(null);
  const [deletingShippingFee, setDeletingShippingFee] = useState(null);

  // Quản lý thông báo hệ thống (FR-046)
  const [notifications, setNotifications] = useState([]);
  const [readAdminNotifIds, setReadAdminNotifIds] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dodong4mua_admin_read_notifs');
      if (stored) setReadAdminNotifIds(JSON.parse(stored));
    } catch (e) { }
  }, []);

  const unreadAdminNotifCount = notifications.filter((n) => !readAdminNotifIds.includes(n.id)).length;

  const markAllAdminNotifsAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const updated = Array.from(new Set([...readAdminNotifIds, ...allIds]));
    setReadAdminNotifIds(updated);
    try {
      localStorage.setItem('dodong4mua_admin_read_notifs', JSON.stringify(updated));
    } catch (e) { }
  };

  const markSingleAdminNotifAsRead = (id) => {
    if (!readAdminNotifIds.includes(id)) {
      const updated = [...readAdminNotifIds, id];
      setReadAdminNotifIds(updated);
      try {
        localStorage.setItem('dodong4mua_admin_read_notifs', JSON.stringify(updated));
      } catch (e) { }
    }
  };
  const [notificationSearch, setNotificationSearch] = useState('');
  const [notificationRecipientFilter, setNotificationRecipientFilter] = useState('ALL_FILTER');
  const [notificationPage, setNotificationPage] = useState(1);
  const [notificationPageSize, setNotificationPageSize] = useState(10);
  const [showCreateNotificationModal, setShowCreateNotificationModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    content: '',
    recipient_type: 'ALL',
  });
  const [sendingNotification, setSendingNotification] = useState(false);
  const [deletingNotification, setDeletingNotification] = useState(null);
  const [selectedNotificationDetail, setSelectedNotificationDetail] = useState(null);
  const [adminNotifOpen, setAdminNotifOpen] = useState(false);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState([]);
  const [userPickerSearch, setUserPickerSearch] = useState('');
  const [userPickerRoleFilter, setUserPickerRoleFilter] = useState('ALL');

  // Quản lý báo cáo doanh thu (FR-047 & BR-028)
  const [revenueData, setRevenueData] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueStartDate, setRevenueStartDate] = useState('');
  const [revenueEndDate, setRevenueEndDate] = useState('');

  // Báo cáo phân hệ Reporting & Báo cáo khách hàng (FR-048)
  const [reportSubTab, setReportSubTab] = useState('revenue'); // 'revenue' | 'customers'
  const [customerReportData, setCustomerReportData] = useState(null);
  const [customerReportLoading, setCustomerReportLoading] = useState(false);
  const [customerReportStartDate, setCustomerReportStartDate] = useState('');
  const [customerReportEndDate, setCustomerReportEndDate] = useState('');
  const [customerReportSearch, setCustomerReportSearch] = useState('');
  const [customerReportPage, setCustomerReportPage] = useState(1);
  const [customerReportPageSize, setCustomerReportPageSize] = useState(10);

  // Báo cáo hàng tồn kho (FR-049 & BR-029)
  const [inventoryReportData, setInventoryReportData] = useState(null);
  const [inventoryReportLoading, setInventoryReportLoading] = useState(false);
  const [inventoryReportSearch, setInventoryReportSearch] = useState('');
  const [inventoryReportCategory, setInventoryReportCategory] = useState('all');
  const [inventoryReportStockStatus, setInventoryReportStockStatus] = useState('all');
  const [inventoryReportStartDate, setInventoryReportStartDate] = useState('');
  const [inventoryReportEndDate, setInventoryReportEndDate] = useState('');
  const [inventoryReportPage, setInventoryReportPage] = useState(1);
  const [inventoryReportPageSize, setInventoryReportPageSize] = useState(10);

  // Báo cáo đơn hàng (FR-050 & BR-030)
  const [orderReportData, setOrderReportData] = useState(null);
  const [orderReportLoading, setOrderReportLoading] = useState(false);
  const [orderReportSearch, setOrderReportSearch] = useState('');
  const [orderReportStatus, setOrderReportStatus] = useState('all');
  const [orderReportPaymentStatus, setOrderReportPaymentStatus] = useState('all');
  const [orderReportStartDate, setOrderReportStartDate] = useState('');
  const [orderReportEndDate, setOrderReportEndDate] = useState('');
  const [orderReportPage, setOrderReportPage] = useState(1);
  const [orderReportPageSize, setOrderReportPageSize] = useState(10);
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  // Quản lý tài khoản Admin & Phân quyền chức năng
  const [editAdminModal, setEditAdminModal] = useState({
    isOpen: false,
    admin: null,
    full_name: '',
    phone: '',
    branch_id: 1,
  });
  const [resetPasswordModal, setResetPasswordModal] = useState({
    isOpen: false,
    admin: null,
    password: '',
    confirm_password: '',
  });
  const [permissionModal, setPermissionModal] = useState({
    isOpen: false,
    admin: null,
    selectedIds: [],
    loading: false,
    saving: false,
  });
  const [editCategoryModal, setEditCategoryModal] = useState({
    isOpen: false,
    category: null,
    name: '',
    description: '',
  });
  const [editPromotionModal, setEditPromotionModal] = useState({
    isOpen: false,
    promotion: null,
    title: '',
    description: '',
    discount_percent: 10,
    start_date: '',
    end_date: '',
    status: 1,
  });
  const [assignProductsModal, setAssignProductsModal] = useState({
    isOpen: false,
    promotion: null,
    assignedProducts: [],
    selectedProductId: '',
    loading: false,
    conflictError: '',
  });

  // Modal Xem trước & Căn chỉnh Logo Thương hiệu (Dùng component LogoCropperModal)
  const [logoCropperModal, setLogoCropperModal] = useState({
    isOpen: false,
    imageSrc: '',
    shape: 'circle',
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Form states
  const [newAdmin, setNewAdmin] = useState({
    full_name: '', phone: '', password: '', branch_id: 1, role_id: 2
  });
  const [newProduct, setNewProduct] = useState({
    name: '', category_id: 1, price: '', discount_price: '', unit: 'kg', stock: 50,
    thumbnail: '', description: '', is_featured: 1
  });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    description: '',
    discount_percent: 10,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });
  const [newBranch, setNewBranch] = useState({ branch_name: '', phone: '', address: '' });
  const [newBanner, setNewBanner] = useState({ title: '', image_url: '', link_url: '/', display_order: 1 });
  const [uploadingImage, setUploadingImage] = useState(false);

  // In-App Notification & Modern Confirm Dialog States (thay thế alert/confirm native)
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy bỏ',
    type: 'warning',
    onConfirm: null
  });

  // Modal xác nhận thao tác Đơn hàng (Đổi trạng thái, Tạm dừng, Tiếp tục, Hủy đơn - Chuẩn giao diện Đổ Đống 4 Mùa)
  const [orderActionModal, setOrderActionModal] = useState({
    isOpen: false,
    actionType: 'STATUS', // 'STATUS' | 'PAUSE' | 'RESUME' | 'CANCEL'
    order: null,
    title: '',
    message: '',
    targetStatus: null,
    targetShippingStatus: null,
    targetPaymentStatus: null,
    statusLabel: '',
    reason: '',
    requireReason: false,
    confirmText: 'Xác nhận',
    confirmColor: 'bg-brand-600 hover:bg-brand-700',
    iconType: 'status'
  });

  // Modal xác nhận thao tác Tài khoản (Chuẩn KhoHang_JAVA: lockModal, unlockModal, deleteModal)
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    actionType: 'lock', // 'lock' | 'unlock' | 'delete'
    targetUser: null,
  });

  const requestConfirm = ({ title, message, confirmText = 'Xác nhận', cancelText = 'Hủy bỏ', type = 'warning', onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm
    });
  };

  // Xử lý Upload Ảnh từ máy tính chuẩn SRS (JPG, PNG, WEBP <= 5MB)
  const handleFileUpload = async (e, type = 'product') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast(`Dung lượng ảnh (${(file.size / (1024 * 1024)).toFixed(2)} MB) vượt quá giới hạn 5 MB!`, 'warning');
      e.target.value = '';
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'webp'];
    if (!allowed.includes(ext)) {
      showToast('Định dạng không hợp lệ! Vui lòng chọn file ảnh có đuôi .jpg, .png hoặc .webp.', 'warning');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (type === 'product') {
          // Xóa ảnh tạm cũ nếu người dùng chọn đổi ảnh khác trước khi bấm Lưu
          if (newProduct.thumbnail && newProduct.thumbnail.startsWith('/uploads/')) {
            fetch(`/api/upload?url=${encodeURIComponent(newProduct.thumbnail)}`, { method: 'DELETE' }).catch(() => { });
          }
          setNewProduct((prev) => ({ ...prev, thumbnail: data.url }));
        } else if (type === 'edit_product') {
          // Xóa ảnh vừa upload đè trước đó nếu đổi ảnh tiếp trong cùng 1 phiên sửa
          if (editProductModal.tempUploaded && editProductModal.tempUploaded.startsWith('/uploads/')) {
            fetch(`/api/upload?url=${encodeURIComponent(editProductModal.tempUploaded)}`, { method: 'DELETE' }).catch(() => { });
          }
          setEditProductModal((prev) => ({ ...prev, thumbnail: data.url, tempUploaded: data.url }));
        } else if (type === 'product_extra') {
          handleAddExtraImage(data.url);
        } else if (type === 'banner') {
          if (newBanner.image_url && newBanner.image_url.startsWith('/uploads/')) {
            fetch(`/api/upload?url=${encodeURIComponent(newBanner.image_url)}`, { method: 'DELETE' }).catch(() => { });
          }
          setNewBanner((prev) => ({ ...prev, image_url: data.url }));
        } else if (type === 'edit_banner') {
          if (editingBanner && editingBanner.tempUploaded && editingBanner.tempUploaded.startsWith('/uploads/')) {
            fetch(`/api/upload?url=${encodeURIComponent(editingBanner.tempUploaded)}`, { method: 'DELETE' }).catch(() => { });
          }
          setEditingBanner((prev) => prev ? ({ ...prev, image_url: data.url, tempUploaded: data.url }) : prev);
        } else if (type === 'settings_logo') {
          setSiteSettings((prev) => ({ ...prev, logo_url: data.url }));
        }
      } else {
        showToast(data.message || 'Lỗi khi upload ảnh', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối tải ảnh: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Xử lý chọn ảnh Logo để mở Modal Căn chỉnh & Xem trước (Chuẩn Facebook)
  const handleLogoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast(`Dung lượng ảnh (${(file.size / (1024 * 1024)).toFixed(2)} MB) vượt quá giới hạn 5 MB!`, 'warning');
      e.target.value = '';
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'webp'];
    if (!allowed.includes(ext)) {
      showToast('Định dạng không hợp lệ! Vui lòng chọn file ảnh có đuôi .jpg, .png hoặc .webp.', 'warning');
      e.target.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLogoCropperModal({
      isOpen: true,
      imageSrc: objectUrl,
      shape: 'circle',
    });
    e.target.value = '';
  };

  const openLogoCropperWithCurrentUrl = () => {
    if (!siteSettings.logo_url) {
      showToast('Chưa có logo để xem trước! Vui lòng tải ảnh từ máy tính hoặc dán URL.', 'warning');
      return;
    }
    setLogoCropperModal({
      isOpen: true,
      imageSrc: siteSettings.logo_url,
      shape: 'circle',
    });
  };

  const loadData = async (forceLoading = false) => {
    if (forceLoading || !stats) {
      setLoading(true);
    }
    try {
      const [
        statsRes, ordersRes, prodsRes, catsRes,
        promosRes, branchesRes, bannersRes, custsRes, logsRes, usersRes, settingsRes, shippingFeesRes, notificationsRes, revenueRes, customerReportRes, inventoryReportRes, orderReportRes
      ] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/orders?limit=100${orderStatusFilter ? `&status=${orderStatusFilter}` : ''}${orderSearch ? `&search=${encodeURIComponent(orderSearch)}` : ''}${orderStartDate ? `&startDate=${orderStartDate}` : ''}${orderEndDate ? `&endDate=${orderEndDate}` : ''}`),
        fetch('/api/products?all=1&limit=200'),
        fetch('/api/categories?all=1'),
        fetch('/api/promotions?all=1'),
        fetch('/api/branches?all=true'),
        fetch('/api/banners?all=true'),
        fetch('/api/admin/customers'),
        fetch('/api/admin/logs'),
        fetch('/api/admin/users'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/shipping-fees'),
        fetch('/api/admin/notifications'),
        fetch('/api/admin/reports/revenue'),
        fetch('/api/admin/reports/customers'),
        fetch('/api/admin/reports/inventory'),
        fetch('/api/admin/reports/orders'),
      ]);

      const [
        statsData, ordersData, prodsData, catsData,
        promosData, branchesData, bannersData, custsData, logsData, usersData,
        settingsData, shippingFeesData, notificationsData, revenueDataRes, customerReportDataRes, inventoryReportDataRes, orderReportDataRes
      ] = await Promise.all([
        statsRes.json(), ordersRes.json(), prodsRes.json(), catsRes.json(),
        promosRes.json(), branchesRes.json(), bannersRes.json(), custsRes.json(), logsRes.json(), usersRes.json(), settingsRes.json(), shippingFeesRes.json(), notificationsRes.json(), revenueRes.json(), customerReportRes.json(), inventoryReportRes.json(), orderReportRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (ordersData.success) setOrders(ordersData.data);
      if (prodsData.success) setProducts(prodsData.data);
      if (catsData.success) setCategories(catsData.data);
      if (promosData.success) setPromotions(promosData.data);
      if (branchesData.success) setBranches(branchesData.data);
      if (bannersData.success) setBanners(bannersData.data);
      if (custsData.success) setCustomers(custsData.data);
      if (logsData.success) {
        setLogs(logsData.data);
        if (logsData.stats) setLogStats(logsData.stats);
      }
      if (usersData.success) setAdminUsers(usersData.data);
      if (settingsData && settingsData.success) {
        setSiteSettings(settingsData.data);
        try { localStorage.setItem('dodong4mua_site_settings', JSON.stringify(settingsData.data)); } catch (e) { }
      }
      if (shippingFeesData && shippingFeesData.success) setShippingFees(shippingFeesData.data);
      if (notificationsData && notificationsData.success) setNotifications(notificationsData.data);
      if (revenueDataRes && revenueDataRes.success) setRevenueData(revenueDataRes.data);
      if (customerReportDataRes && customerReportDataRes.success) setCustomerReportData(customerReportDataRes.data);
      if (inventoryReportDataRes && inventoryReportDataRes.success) setInventoryReportData(inventoryReportDataRes.data);
      if (orderReportDataRes && orderReportDataRes.success) setOrderReportData(orderReportDataRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, orderStatusFilter, orderSearch, orderStartDate, orderEndDate]);

  // Kiểm tra quyền hạn truy cập tab chức năng (BR-026 & FR-039)
  const hasPermissionForTab = (tabKey) => {
    if (!currentUser) return false;
    if (currentUser.role_id === 1) return true;

    // Các tab chỉ dành riêng cho Admin Tổng
    if (['admins', 'branches', 'logs', 'settings', 'notifications'].includes(tabKey)) {
      return false;
    }

    const perms = currentUser.permissions || [];
    if (perms.includes('*')) return true;

    switch (tabKey) {
      case 'orders':
        return perms.some((p) =>
          ['order.view', 'order.update', 'order.cancel', 'shipment.manage', 'payment.confirm'].includes(p)
        );
      case 'reports':
        return perms.includes('report.view');
      case 'products':
        return perms.some((p) =>
          ['product.view', 'product.create', 'product.update', 'product.delete', 'inventory.manage'].includes(p)
        );
      case 'categories':
        return perms.includes('category.manage');
      case 'promotions':
        return perms.includes('promotion.manage');
      case 'banners':
        return perms.includes('banner.manage');
      case 'customers':
        return perms.includes('customer.view');
      default:
        return false;
    }
  };

  // Tự động chuyển về tab được cấp phép nếu URL cố tình truy cập tab bị cấm (Activity Diagram 6.7.10)
  useEffect(() => {
    if (currentUser && !hasPermissionForTab(activeTab)) {
      const allTabs = ['orders', 'products', 'categories', 'promotions', 'reports', 'banners', 'customers'];
      const firstAllowed = allTabs.find((t) => hasPermissionForTab(t));
      if (firstAllowed) {
        setActiveTab(firstAllowed);
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `?tab=${firstAllowed}`);
        }
      }
    }
  }, [currentUser, activeTab]);

  const handleViewOrderDetail = async (orderItem) => {
    setSelectedOrder(orderItem);
    setLoadingOrderDetail(true);
    try {
      const res = await fetch(`/api/orders/${orderItem.order_code}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedOrder(data.data);
      }
    } catch (err) {
      console.error('Lỗi tải chi tiết đơn hàng:', err);
    } finally {
      setLoadingOrderDetail(false);
    }
  };

  const handleUpdateOrderStatus = async (orderCode, newOrderStatus, newShippingStatus = null, newPaymentStatus = null, reason = null) => {
    try {
      const body = {};
      if (newOrderStatus) body.order_status = newOrderStatus;
      if (newShippingStatus) body.shipping_status = newShippingStatus;
      if (newPaymentStatus) body.payment_status = newPaymentStatus;
      if (reason) body.reason = reason;

      const res = await fetch(`/api/orders/${orderCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Cập nhật trạng thái đơn hàng thành công!');
        loadData();
        setSelectedOrder((prev) => {
          if (!prev || prev.order_code !== orderCode) return prev;
          return {
            ...prev,
            ...(newOrderStatus ? { order_status: newOrderStatus } : {}),
            ...(newShippingStatus ? { shipping_status: newShippingStatus } : {}),
            ...(newPaymentStatus ? { payment_status: newPaymentStatus } : {}),
          };
        });
      } else {
        showToast(data.message || 'Cập nhật thất bại', 'error');
      }
    } catch (e) {
      showToast('Có lỗi xảy ra: ' + e.message, 'error');
    }
  };

  // 1. Mở modal Đổi trạng thái với thông báo & xác nhận rõ ràng
  const promptChangeOrderStatus = (order, newStatus, newShippingStatus = null, label = 'Duyệt đơn') => {
    let color = 'bg-brand-600 hover:bg-brand-700';
    if (newStatus === 'DA_XAC_NHAN') color = 'bg-purple-600 hover:bg-purple-700';
    else if (newStatus === 'DANG_CHUAN_BI') color = 'bg-blue-600 hover:bg-blue-700';
    else if (newStatus === 'DANG_GIAO') color = 'bg-teal-600 hover:bg-teal-700';
    else if (newStatus === 'DA_GIAO') color = 'bg-emerald-600 hover:bg-emerald-700';

    const statusNames = {
      DA_XAC_NHAN: 'Đã xác nhận',
      DANG_CHUAN_BI: 'Đang chuẩn bị đóng gói',
      DANG_GIAO: 'Đang giao (Bàn giao GreenSM)',
      DA_GIAO: 'Đã giao (Hoàn tất đơn hàng)',
    };

    setOrderActionModal({
      isOpen: true,
      actionType: 'STATUS',
      order,
      title: `Xác Nhận ${label}`,
      message: `Bạn có chắc chắn muốn chuyển đơn hàng #${order.order_code} sang trạng thái "${statusNames[newStatus] || newStatus}" không?`,
      targetStatus: newStatus,
      targetShippingStatus: newShippingStatus,
      targetPaymentStatus: null,
      statusLabel: label,
      reason: '',
      requireReason: false,
      confirmText: `Xác nhận ${label}`,
      confirmColor: color,
      iconType: 'status'
    });
  };

  // 2. Mở modal Tạm dừng (FR-034: có ô nhập lý do)
  const promptPauseOrder = (order) => {
    setOrderActionModal({
      isOpen: true,
      actionType: 'PAUSE',
      order,
      title: 'Tạm Dừng Xử Lý Đơn Hàng',
      message: `Tạm dừng đơn hàng #${order.order_code} khi có sự cố phát sinh. Vui lòng nhập lý do cụ thể (lý do này sẽ hiển thị cho khách hàng và lưu vết hệ thống):`,
      targetStatus: 'TAM_DUNG',
      targetShippingStatus: null,
      targetPaymentStatus: null,
      statusLabel: 'Tạm dừng',
      reason: 'Hết hàng tạm thời, chờ bổ sung đợt mới',
      requireReason: true,
      confirmText: 'Xác nhận Tạm dừng',
      confirmColor: 'bg-amber-500 hover:bg-amber-600',
      iconType: 'pause'
    });
  };

  // 3. Mở modal Tiếp tục xử lý (FR-035)
  const promptResumeOrder = (order) => {
    setOrderActionModal({
      isOpen: true,
      actionType: 'RESUME',
      order,
      title: 'Tiếp Tục Xử Lý Đơn Hàng',
      message: `Xác nhận đã khắc phục xong sự cố và tiếp tục xử lý đơn hàng #${order.order_code}? Đơn sẽ được chuyển về khâu Đang chuẩn bị đóng gói.`,
      targetStatus: 'DANG_CHUAN_BI',
      targetShippingStatus: null,
      targetPaymentStatus: null,
      statusLabel: 'Tiếp tục',
      reason: 'Đã giải quyết sự cố, tiếp tục đóng gói',
      requireReason: false,
      confirmText: 'Tiếp tục xử lý',
      confirmColor: 'bg-blue-600 hover:bg-blue-700',
      iconType: 'resume'
    });
  };

  // 4. Mở modal Hủy đơn hàng (FR-028 & BR-020)
  const promptCancelOrder = (order) => {
    setOrderActionModal({
      isOpen: true,
      actionType: 'CANCEL',
      order,
      title: 'Xác Nhận Hủy Đơn Hàng',
      message: `Cảnh báo: Hành động này sẽ hủy đơn hàng #${order.order_code} và tự động hoàn trả số lượng quả vào kho. Vui lòng nhập lý do hủy:`,
      targetStatus: 'DA_HUY',
      targetShippingStatus: null,
      targetPaymentStatus: null,
      statusLabel: 'Hủy đơn',
      reason: 'Khách hàng yêu cầu hủy đơn',
      requireReason: true,
      confirmText: 'Xác nhận Hủy Đơn',
      confirmColor: 'bg-red-600 hover:bg-red-700',
      iconType: 'cancel'
    });
  };

  // Thực thi thao tác từ modal
  const executeOrderActionModal = async () => {
    const { actionType, order, targetStatus, targetShippingStatus, targetPaymentStatus, reason, requireReason } = orderActionModal;
    if (!order) return;

    if (requireReason && (!reason || !reason.trim())) {
      showToast('Vui lòng nhập lý do để tiếp tục!', 'warning');
      return;
    }

    setOrderActionModal((prev) => ({ ...prev, isOpen: false }));

    if (actionType === 'CANCEL') {
      try {
        const res = await fetch(`/api/orders/${order.order_code}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'CANCEL', reason: reason ? reason.trim() : 'Quản trị viên hủy đơn' }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message || 'Đã hủy đơn hàng thành công!', 'success');
          loadData();
          setSelectedOrder((prev) => prev && prev.order_code === order.order_code ? { ...prev, order_status: 'DA_HUY' } : prev);
        } else {
          showToast(data.message || 'Hủy đơn thất bại', 'error');
        }
      } catch (e) {
        showToast('Lỗi kết nối: ' + e.message, 'error');
      }
      return;
    }

    // STATUS, PAUSE, RESUME
    handleUpdateOrderStatus(
      order.order_code,
      targetStatus,
      targetShippingStatus,
      targetPaymentStatus,
      reason ? reason.trim() : null
    );
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.name.trim()) {
      showToast('Vui lòng nhập tên trái cây!', 'warning');
      return;
    }
    if (!newProduct.price || isNaN(parseFloat(newProduct.price)) || parseFloat(newProduct.price) <= 0) {
      showToast('Vui lòng nhập giá bán hợp lệ lớn hơn 0đ!', 'warning');
      return;
    }
    if (newProduct.stock === '' || isNaN(parseInt(newProduct.stock, 10)) || parseInt(newProduct.stock, 10) < 0) {
      showToast('Vui lòng nhập số lượng tồn kho hợp lệ (≥ 0)!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          discount_price: newProduct.discount_price ? parseFloat(newProduct.discount_price) : null,
          stock: parseInt(newProduct.stock, 10),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddProductModal(false);
        setNewProduct({
          name: '', category_id: 1, price: '', discount_price: '', unit: 'kg', stock: 50,
          thumbnail: '', description: '', is_featured: 1
        });
        showToast('Thêm sản phẩm mới thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm sản phẩm', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const openEditProductModal = async (p) => {
    setEditProductModal({
      isOpen: true,
      product: p,
      name: p.name,
      category_id: p.category_id,
      price: p.price,
      discount_price: p.discount_price !== null && p.discount_price !== undefined ? p.discount_price : '',
      unit: p.unit || 'kg',
      stock: p.stock !== undefined ? p.stock : 0,
      thumbnail: p.thumbnail || '',
      description: p.description || '',
      is_featured: p.is_featured ? 1 : 0,
      status: p.status !== undefined ? p.status : 1,
      extraImages: [],
      loadingImages: true,
    });

    try {
      const res = await fetch(`/api/products/${p.id}/images`);
      const data = await res.json();
      if (data.success) {
        setEditProductModal((prev) => ({ ...prev, extraImages: data.data || [], loadingImages: false }));
      } else {
        setEditProductModal((prev) => ({ ...prev, loadingImages: false }));
      }
    } catch {
      setEditProductModal((prev) => ({ ...prev, loadingImages: false }));
    }
  };

  const handleAddExtraImage = async (imageUrl) => {
    if (!editProductModal.product || !imageUrl) return;
    try {
      const res = await fetch(`/api/products/${editProductModal.product.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, display_order: editProductModal.extraImages.length + 1 }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Thêm ảnh phụ thành công!', 'success');
        setEditProductModal((prev) => ({
          ...prev,
          extraImages: [...prev.extraImages, data.data],
        }));
      } else {
        showToast(data.message || 'Lỗi thêm ảnh phụ', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleDeleteExtraImage = async (imageId) => {
    if (!editProductModal.product) return;
    try {
      const res = await fetch(`/api/products/${editProductModal.product.id}/images?image_id=${imageId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Đã xóa ảnh phụ!', 'success');
        setEditProductModal((prev) => ({
          ...prev,
          extraImages: prev.extraImages.filter((img) => img.id !== imageId),
        }));
      } else {
        showToast(data.message || 'Lỗi xóa ảnh', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleUpdateProductSubmit = async (e) => {
    e.preventDefault();
    if (!editProductModal.product) return;

    if (!editProductModal.name || !editProductModal.name.trim()) {
      showToast('Vui lòng nhập tên trái cây!', 'warning');
      return;
    }

    const price = parseFloat(editProductModal.price);
    if (!editProductModal.price || isNaN(price) || price <= 0) {
      showToast('Giá bán của sản phẩm phải lớn hơn 0đ!', 'warning');
      return;
    }

    const discountPrice = editProductModal.discount_price !== '' && editProductModal.discount_price !== null ? parseFloat(editProductModal.discount_price) : null;
    if (discountPrice !== null && (isNaN(discountPrice) || discountPrice < 0 || discountPrice >= price)) {
      showToast('Giá khuyến mãi phải nhỏ hơn giá bán gốc và không được âm!', 'warning');
      return;
    }

    const stock = parseInt(editProductModal.stock, 10);
    if (isNaN(stock) || stock < 0) {
      showToast('Số lượng tồn kho không được âm!', 'warning');
      return;
    }

    try {
      const res = await fetch(`/api/products/${editProductModal.product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editProductModal.name.trim(),
          category_id: parseInt(editProductModal.category_id, 10),
          price,
          discount_price: discountPrice,
          unit: editProductModal.unit,
          stock,
          thumbnail: editProductModal.thumbnail,
          description: editProductModal.description,
          is_featured: editProductModal.is_featured ? 1 : 0,
          status: editProductModal.status ? 1 : 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Cập nhật thông tin sản phẩm thành công!', 'success');
        setEditProductModal({
          isOpen: false,
          product: null,
          name: '',
          category_id: 1,
          price: '',
          discount_price: '',
          unit: 'kg',
          stock: 0,
          thumbnail: '',
          description: '',
          is_featured: 0,
          status: 1,
        });
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật sản phẩm', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    }
  };

  const handleToggleProductStatus = async (p) => {
    const newStatus = p.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(newStatus === 1 ? `Đã hiển thị sản phẩm "${p.name}"!` : `Đã ẩn sản phẩm "${p.name}"!`, 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật trạng thái', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    }
  };

  const handleDeleteProduct = async (p) => {
    if (p.order_count > 0) {
      showToast(
        `Sản phẩm "${p.name}" đã có ${p.order_count} đơn hàng liên kết trong lịch sử. Theo quy định toàn vẹn dữ liệu, không thể xóa vĩnh viễn mà chỉ được phép ẩn sản phẩm!`,
        'warning'
      );
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "${p.name}"? Thao tác này không thể hoàn tác!`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã xóa sản phẩm thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa sản phẩm', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.name.trim()) {
      showToast('Vui lòng nhập tên danh mục!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          description: newCategory.description ? newCategory.description.trim() : '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddCategoryModal(false);
        setNewCategory({ name: '', description: '' });
        showToast('Thêm danh mục mới thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm danh mục', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const openEditCategoryModal = (cat) => {
    setEditCategoryModal({
      isOpen: true,
      category: cat,
      name: cat.name,
      description: cat.description || '',
    });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryModal.category) return;
    if (!editCategoryModal.name || !editCategoryModal.name.trim()) {
      showToast('Vui lòng nhập tên danh mục!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editCategoryModal.category.id,
          name: editCategoryModal.name.trim(),
          description: editCategoryModal.description ? editCategoryModal.description.trim() : '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditCategoryModal({ isOpen: false, category: null, name: '', description: '' });
        showToast(data.message || 'Cập nhật danh mục thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật danh mục', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleToggleCategoryStatus = async (cat) => {
    const newStatus = cat.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Cập nhật trạng thái danh mục thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật trạng thái', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (cat.product_count > 0) {
      showToast(
        `Danh mục "${cat.name}" đang có ${cat.product_count} sản phẩm liên kết. Không thể xóa mà chỉ được phép ẩn!`,
        'warning'
      );
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn danh mục "${cat.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories?id=${cat.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã xóa danh mục thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa danh mục', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    if (!newPromotion.title || !newPromotion.title.trim()) {
      showToast('Vui lòng nhập tên chương trình khuyến mãi!', 'warning');
      return;
    }
    const percent = parseInt(newPromotion.discount_percent, 10);
    if (!percent || isNaN(percent) || percent <= 0 || percent > 100) {
      showToast('Phần trăm giảm phải từ 1% đến 100%!', 'warning');
      return;
    }
    if (!newPromotion.start_date || !newPromotion.end_date) {
      showToast('Vui lòng chọn ngày bắt đầu và ngày kết thúc!', 'warning');
      return;
    }
    if (new Date(newPromotion.end_date) < new Date(newPromotion.start_date)) {
      showToast('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromotion),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddPromotionModal(false);
        setNewPromotion({
          title: '',
          description: '',
          discount_percent: 10,
          start_date: new Date().toISOString().slice(0, 10),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        });
        showToast('Thêm chương trình khuyến mãi thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm khuyến mãi', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const openEditPromotionModal = (pr) => {
    setEditPromotionModal({
      isOpen: true,
      promotion: pr,
      title: pr.title || '',
      description: pr.description || '',
      discount_percent: pr.discount_percent || 10,
      start_date: pr.start_date ? new Date(pr.start_date).toISOString().slice(0, 10) : '',
      end_date: pr.end_date ? new Date(pr.end_date).toISOString().slice(0, 10) : '',
      status: pr.status !== undefined ? pr.status : 1,
    });
  };

  const handleUpdatePromotion = async (e) => {
    e.preventDefault();
    if (!editPromotionModal.promotion) return;
    if (!editPromotionModal.title || !editPromotionModal.title.trim()) {
      showToast('Vui lòng nhập tên chương trình!', 'warning');
      return;
    }
    const percent = parseInt(editPromotionModal.discount_percent, 10);
    if (!percent || isNaN(percent) || percent <= 0 || percent > 100) {
      showToast('Phần trăm giảm phải từ 1% đến 100%!', 'warning');
      return;
    }
    if (!editPromotionModal.start_date || !editPromotionModal.end_date) {
      showToast('Vui lòng chọn ngày bắt đầu và kết thúc!', 'warning');
      return;
    }
    if (new Date(editPromotionModal.end_date) < new Date(editPromotionModal.start_date)) {
      showToast('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!', 'warning');
      return;
    }
    try {
      const res = await fetch(`/api/promotions/${editPromotionModal.promotion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editPromotionModal.title.trim(),
          description: editPromotionModal.description?.trim() || '',
          discount_percent: percent,
          start_date: editPromotionModal.start_date,
          end_date: editPromotionModal.end_date,
          status: editPromotionModal.status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditPromotionModal({ isOpen: false, promotion: null, title: '', description: '', discount_percent: 10, start_date: '', end_date: '', status: 1 });
        showToast(data.message || 'Cập nhật khuyến mãi thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật khuyến mãi', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleTogglePromotionStatus = async (pr) => {
    const newStatus = pr.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/promotions/${pr.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(newStatus === 1 ? `Đã kích hoạt chương trình "${pr.title}"!` : `Đã dừng chương trình "${pr.title}"!`, 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật trạng thái', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleDeletePromotion = async (pr) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chương trình khuyến mãi "${pr.title}"? Tất cả sản phẩm đang áp dụng sẽ tự động được xóa giá khuyến mãi về giá gốc.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/promotions/${pr.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã xóa chương trình khuyến mãi!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa khuyến mãi', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const openAssignProductsModal = async (pr) => {
    setAssignProductsModal({
      isOpen: true,
      promotion: pr,
      assignedProducts: [],
      selectedProductId: '',
      loading: true,
      conflictError: '',
    });
    try {
      const res = await fetch(`/api/promotions/${pr.id}/products`);
      const data = await res.json();
      if (data.success) {
        setAssignProductsModal(prev => ({
          ...prev,
          assignedProducts: data.data || [],
          loading: false,
        }));
      } else {
        setAssignProductsModal(prev => ({ ...prev, loading: false }));
        showToast(data.message || 'Lỗi tải danh sách sản phẩm', 'error');
      }
    } catch (e) {
      setAssignProductsModal(prev => ({ ...prev, loading: false }));
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleAddProductToPromotion = async (e) => {
    e.preventDefault();
    if (!assignProductsModal.selectedProductId) {
      showToast('Vui lòng chọn một sản phẩm cần gán vào khuyến mãi!', 'warning');
      return;
    }
    setAssignProductsModal(prev => ({ ...prev, conflictError: '' }));
    try {
      const pId = parseInt(assignProductsModal.selectedProductId, 10);
      const res = await fetch(`/api/promotions/${assignProductsModal.promotion.id}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_ids: [pId] }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã thêm sản phẩm vào chương trình khuyến mãi!', 'success');
        const refreshRes = await fetch(`/api/promotions/${assignProductsModal.promotion.id}/products`);
        const refreshData = await refreshRes.json();
        setAssignProductsModal(prev => ({
          ...prev,
          assignedProducts: refreshData.data || [],
          selectedProductId: '',
          conflictError: '',
        }));
        loadData();
      } else {
        setAssignProductsModal(prev => ({ ...prev, conflictError: data.message || 'Lỗi gán sản phẩm' }));
        showToast(data.message || 'Không thể gán sản phẩm!', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleRemoveProductFromPromotion = async (productId, productName) => {
    if (!window.confirm(`Gỡ sản phẩm "${productName}" khỏi chương trình khuyến mãi? Giá bán của sản phẩm sẽ trở lại giá gốc.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/promotions/${assignProductsModal.promotion.id}/products?product_id=${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đã gỡ sản phẩm khỏi khuyến mãi!', 'success');
        const refreshRes = await fetch(`/api/promotions/${assignProductsModal.promotion.id}/products`);
        const refreshData = await refreshRes.json();
        setAssignProductsModal(prev => ({
          ...prev,
          assignedProducts: refreshData.data || [],
        }));
        loadData();
      } else {
        showToast(data.message || 'Lỗi gỡ sản phẩm', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!newBranch.branch_name || !newBranch.branch_name.trim()) {
      showToast('Vui lòng nhập tên chi nhánh!', 'warning');
      return;
    }
    if (!newBranch.phone || !newBranch.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại chi nhánh!', 'warning');
      return;
    }
    if (!newBranch.address || !newBranch.address.trim()) {
      showToast('Vui lòng nhập địa chỉ chi nhánh!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBranch),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddBranchModal(false);
        setNewBranch({ branch_name: '', phone: '', address: '' });
        showToast('Thêm chi nhánh mới thành công!');
        loadData();
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('branches-change'));
      } else {
        showToast(data.message || 'Lỗi thêm chi nhánh', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };
  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    if (!editingBranch) return;
    if (!editingBranch.branch_name || !editingBranch.branch_name.trim()) {
      showToast('Vui lòng nhập tên chi nhánh!', 'warning');
      return;
    }
    if (!editingBranch.phone || !editingBranch.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại chi nhánh!', 'warning');
      return;
    }
    if (!editingBranch.address || !editingBranch.address.trim()) {
      showToast('Vui lòng nhập địa chỉ chi nhánh!', 'warning');
      return;
    }
    try {
      const res = await fetch(`/api/branches/${editingBranch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_name: editingBranch.branch_name,
          phone: editingBranch.phone,
          address: editingBranch.address,
          status: editingBranch.status
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingBranch(null);
        showToast('Cập nhật thông tin chi nhánh thành công!');
        loadData();
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('branches-change'));
      } else {
        showToast(data.message || 'Lỗi cập nhật chi nhánh', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleConfirmToggleBranchStatus = async () => {
    if (!toggleStatusBranch) return;
    const targetStatus = toggleStatusBranch.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/branches/${toggleStatusBranch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_name: toggleStatusBranch.branch_name,
          phone: toggleStatusBranch.phone,
          address: toggleStatusBranch.address,
          status: targetStatus
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          targetStatus === 1
            ? `Đã kích hoạt lại chi nhánh "${toggleStatusBranch.branch_name}"!`
            : `Đã tạm ngưng hoạt động chi nhánh "${toggleStatusBranch.branch_name}"!`
        );
        setToggleStatusBranch(null);
        loadData();
      } else {
        showToast(data.message || 'Không thể đổi trạng thái chi nhánh', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleConfirmDeleteBranch = async () => {
    if (!deletingBranch) return;
    try {
      const res = await fetch(`/api/branches/${deletingBranch.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa vĩnh viễn chi nhánh "${deletingBranch.branch_name}"!`);
        setDeletingBranch(null);
        loadData();
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('branches-change'));
      } else {
        showToast(data.message || 'Xóa chi nhánh thất bại!', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.title.trim()) {
      showToast('Vui lòng nhập tiêu đề banner!', 'warning');
      return;
    }
    if (!newBanner.image_url || !newBanner.image_url.trim()) {
      showToast('Vui lòng tải lên hoặc nhập liên kết ảnh banner!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddBannerModal(false);
        setNewBanner({ title: '', image_url: '', link_url: '/', display_order: 1 });
        showToast('Thêm banner quảng cáo thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm banner', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    if (!editingBanner) return;
    if (!editingBanner.title || !editingBanner.title.trim()) {
      showToast('Vui lòng nhập tiêu đề banner!', 'warning');
      return;
    }
    if (!editingBanner.image_url || !editingBanner.image_url.trim()) {
      showToast('Vui lòng tải lên hoặc nhập liên kết ảnh banner!', 'warning');
      return;
    }
    try {
      const res = await fetch(`/api/banners/${editingBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingBanner.title,
          image_url: editingBanner.image_url,
          link_url: editingBanner.link_url || '/',
          display_order: editingBanner.display_order !== undefined ? parseInt(editingBanner.display_order, 10) : 0,
          status: editingBanner.status !== undefined ? Number(editingBanner.status) : 1
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingBanner(null);
        showToast('Cập nhật banner thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật banner', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleToggleBannerStatus = async (banner) => {
    const targetStatus = banner.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: banner.title,
          image_url: banner.image_url,
          link_url: banner.link_url,
          display_order: banner.display_order,
          status: targetStatus
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          targetStatus === 1
            ? `Đã kích hoạt hiển thị banner "${banner.title}"!`
            : `Đã tạm ẩn banner "${banner.title}"!`
        );
        loadData();
      } else {
        showToast(data.message || 'Lỗi đổi trạng thái banner', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleConfirmDeleteBanner = async () => {
    if (!deletingBanner) return;
    try {
      const res = await fetch(`/api/banners/${deletingBanner.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa banner "${deletingBanner.title}" thành công!`);
        setDeletingBanner(null);
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa banner', 'error');
      }
    } catch (e) {
      showToast('Lỗi: ' + e.message, 'error');
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSiteSettings(data.data);
        try { localStorage.setItem('dodong4mua_site_settings', JSON.stringify(data.data)); } catch (e) { }
        showToast('Cập nhật cấu hình website thành công!');
        loadData();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('settings-change'));
        }
      } else {
        showToast(data.message || 'Lỗi cập nhật cấu hình', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateShippingFee = async (e) => {
    e.preventDefault();
    if (!newShippingFee.name || !newShippingFee.name.trim()) {
      showToast('Vui lòng nhập tên gói cước vận chuyển!', 'warning');
      return;
    }
    const minKm = parseFloat(newShippingFee.min_km);
    const maxKm = parseFloat(newShippingFee.max_km);
    const fee = parseFloat(newShippingFee.fee);

    if (isNaN(minKm) || isNaN(maxKm) || minKm < 0 || maxKm <= minKm) {
      showToast('Khoảng cách không hợp lệ! Khoảng cách đến phải lớn hơn khoảng cách từ (>= 0 km)', 'warning');
      return;
    }
    if (isNaN(fee) || fee < 0) {
      showToast('Mức phí vận chuyển phải lớn hơn hoặc bằng 0 đ!', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/admin/shipping-fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newShippingFee.name.trim(),
          min_km: minKm,
          max_km: maxKm,
          fee: fee,
          status: 1
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddShippingFeeModal(false);
        setNewShippingFee({ name: '', min_km: '', max_km: '', fee: '' });
        showToast('Thêm nấc cước vận chuyển mới thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi thêm nấc cước', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  const handleUpdateShippingFee = async (e) => {
    e.preventDefault();
    if (!editingShippingFee) return;
    if (!editingShippingFee.name || !editingShippingFee.name.trim()) {
      showToast('Vui lòng nhập tên gói cước vận chuyển!', 'warning');
      return;
    }
    const minKm = parseFloat(editingShippingFee.min_km);
    const maxKm = parseFloat(editingShippingFee.max_km);
    const fee = parseFloat(editingShippingFee.fee);

    if (isNaN(minKm) || isNaN(maxKm) || minKm < 0 || maxKm <= minKm) {
      showToast('Khoảng cách không hợp lệ! Khoảng cách đến phải lớn hơn khoảng cách từ (>= 0 km)', 'warning');
      return;
    }
    if (isNaN(fee) || fee < 0) {
      showToast('Mức phí vận chuyển phải lớn hơn hoặc bằng 0 đ!', 'warning');
      return;
    }

    try {
      const res = await fetch(`/api/admin/shipping-fees/${editingShippingFee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingShippingFee.name.trim(),
          min_km: minKm,
          max_km: maxKm,
          fee: fee,
          status: Number(editingShippingFee.status)
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingShippingFee(null);
        showToast('Cập nhật nấc phí vận chuyển thành công!');
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật nấc phí', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  const handleToggleShippingFeeStatus = async (tier) => {
    const targetStatus = tier.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/admin/shipping-fees/${tier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tier.name,
          min_km: tier.min_km,
          max_km: tier.max_km,
          fee: tier.fee,
          status: targetStatus
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(targetStatus === 1 ? `Đã kích hoạt nấc cước "${tier.name}"!` : `Đã tạm dừng nấc cước "${tier.name}"!`);
        loadData();
      } else {
        showToast(data.message || 'Lỗi đổi trạng thái nấc cước', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  // Quản lý thông báo hệ thống (FR-046)
  // Quản lý báo cáo doanh thu (FR-047 & BR-028)
  const loadRevenueReport = async (overrideStart, overrideEnd) => {
    const sDate = overrideStart !== undefined ? overrideStart : revenueStartDate;
    const eDate = overrideEnd !== undefined ? overrideEnd : revenueEndDate;

    if (sDate && eDate && sDate > eDate) {
      showToast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'warning');
      return;
    }

    setRevenueLoading(true);
    try {
      let url = '/api/admin/reports/revenue?';
      if (sDate) url += `startDate=${encodeURIComponent(sDate)}&`;
      if (eDate) url += `endDate=${encodeURIComponent(eDate)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRevenueData(data.data);
      } else {
        showToast(data.message || 'Lỗi tải báo cáo doanh thu', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ: ' + err.message, 'error');
    } finally {
      setRevenueLoading(false);
    }
  };

  const handleExportRevenueExcel = () => {
    let url = '/api/admin/reports/revenue?format=excel';
    if (revenueStartDate) url += `&startDate=${encodeURIComponent(revenueStartDate)}`;
    if (revenueEndDate) url += `&endDate=${encodeURIComponent(revenueEndDate)}`;
    window.open(url, '_blank');
    showToast('Đang tạo và tải tệp Excel báo cáo doanh thu...', 'success');
  };

  // API 76, FR-047: Xuất báo cáo doanh thu định dạng PDF có dấu thời gian
  const handleExportRevenuePdf = () => {
    let url = '/api/reports/export/pdf?type=revenue';
    if (revenueStartDate) url += `&startDate=${encodeURIComponent(revenueStartDate)}`;
    if (revenueEndDate) url += `&endDate=${encodeURIComponent(revenueEndDate)}`;
    window.open(url, '_blank');
    showToast('Đang tạo và tải tệp PDF báo cáo doanh thu...', 'success');
  };

  // Quản lý báo cáo khách hàng (FR-048)
  const loadCustomerReport = async (overrideStart, overrideEnd, overrideSearch) => {
    const sDate = overrideStart !== undefined ? overrideStart : customerReportStartDate;
    const eDate = overrideEnd !== undefined ? overrideEnd : customerReportEndDate;
    const sTerm = overrideSearch !== undefined ? overrideSearch : customerReportSearch;

    if (sDate && eDate && sDate > eDate) {
      showToast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'warning');
      return;
    }

    setCustomerReportLoading(true);
    try {
      let url = '/api/admin/reports/customers?';
      if (sDate) url += `startDate=${encodeURIComponent(sDate)}&`;
      if (eDate) url += `endDate=${encodeURIComponent(eDate)}&`;
      if (sTerm) url += `search=${encodeURIComponent(sTerm)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCustomerReportData(data.data);
      } else {
        showToast(data.message || 'Lỗi tải báo cáo khách hàng', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ: ' + err.message, 'error');
    } finally {
      setCustomerReportLoading(false);
    }
  };

  const handleExportCustomerExcel = () => {
    let url = '/api/admin/reports/customers?format=excel';
    if (customerReportStartDate) url += `&startDate=${encodeURIComponent(customerReportStartDate)}`;
    if (customerReportEndDate) url += `&endDate=${encodeURIComponent(customerReportEndDate)}`;
    if (customerReportSearch) url += `&search=${encodeURIComponent(customerReportSearch)}`;
    window.open(url, '_blank');
    showToast('Đang tạo và tải tệp Excel báo cáo khách hàng...', 'success');
  };

  // API 76, FR-048: Xuất báo cáo khách hàng định dạng PDF
  const handleExportCustomerPdf = () => {
    let url = '/api/reports/export/pdf?type=customers';
    if (customerReportStartDate) url += `&startDate=${encodeURIComponent(customerReportStartDate)}`;
    if (customerReportEndDate) url += `&endDate=${encodeURIComponent(customerReportEndDate)}`;
    if (customerReportSearch) url += `&search=${encodeURIComponent(customerReportSearch)}`;
    window.open(url, '_blank');
    showToast('Đang tạo và tải tệp PDF báo cáo khách hàng...', 'success');
  };

  // Quản lý báo cáo hàng tồn kho (FR-049 & BR-029)
  const loadInventoryReport = async (overrideCat, overrideStatus, overrideSearch, overrideStart, overrideEnd) => {
    const sCat = overrideCat !== undefined ? overrideCat : inventoryReportCategory;
    const sStatus = overrideStatus !== undefined ? overrideStatus : inventoryReportStockStatus;
    const sTerm = overrideSearch !== undefined ? overrideSearch : inventoryReportSearch;
    const sDate = overrideStart !== undefined ? overrideStart : inventoryReportStartDate;
    const eDate = overrideEnd !== undefined ? overrideEnd : inventoryReportEndDate;

    if (sDate && eDate && sDate > eDate) {
      showToast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'warning');
      return;
    }

    setInventoryReportLoading(true);
    try {
      let url = '/api/admin/reports/inventory?';
      if (sCat && sCat !== 'all') url += `categoryId=${encodeURIComponent(sCat)}&`;
      if (sStatus && sStatus !== 'all') url += `stockStatus=${encodeURIComponent(sStatus)}&`;
      if (sTerm) url += `search=${encodeURIComponent(sTerm)}&`;
      if (sDate) url += `startDate=${encodeURIComponent(sDate)}&`;
      if (eDate) url += `endDate=${encodeURIComponent(eDate)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setInventoryReportData(data.data);
      } else {
        showToast(data.message || 'Lỗi tải báo cáo tồn kho', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ: ' + err.message, 'error');
    } finally {
      setInventoryReportLoading(false);
    }
  };

  const exportInventoryReportCsv = () => {
    let url = '/api/admin/reports/inventory?format=excel';
    if (inventoryReportCategory && inventoryReportCategory !== 'all') url += `&categoryId=${encodeURIComponent(inventoryReportCategory)}`;
    if (inventoryReportStockStatus && inventoryReportStockStatus !== 'all') url += `&stockStatus=${encodeURIComponent(inventoryReportStockStatus)}`;
    if (inventoryReportSearch) url += `&search=${encodeURIComponent(inventoryReportSearch)}`;
    if (inventoryReportStartDate) url += `&startDate=${encodeURIComponent(inventoryReportStartDate)}`;
    if (inventoryReportEndDate) url += `&endDate=${encodeURIComponent(inventoryReportEndDate)}`;
    window.open(url, '_blank');
    showToast('Đang tạo và tải tệp Excel báo cáo hàng tồn kho...', 'success');
  };

  // API 76, FR-049: Xuất báo cáo hàng tồn kho định dạng PDF
  const exportInventoryReportPdf = () => {
    let url = '/api/reports/export/pdf?type=inventory';
    if (inventoryReportCategory && inventoryReportCategory !== 'all') url += `&categoryId=${encodeURIComponent(inventoryReportCategory)}`;
    if (inventoryReportStockStatus && inventoryReportStockStatus !== 'all') url += `&stockStatus=${encodeURIComponent(inventoryReportStockStatus)}`;
    if (inventoryReportSearch) url += `&search=${encodeURIComponent(inventoryReportSearch)}`;
    if (inventoryReportStartDate) url += `&startDate=${encodeURIComponent(inventoryReportStartDate)}`;
    if (inventoryReportEndDate) url += `&endDate=${encodeURIComponent(inventoryReportEndDate)}`;
    window.open(url, '_blank');
    showToast('Đang tạo và tải tệp PDF báo cáo hàng tồn kho...', 'success');
  };

  // Quản lý báo cáo đơn hàng (FR-050 & BR-030)
  const loadOrderReport = async (overrideStatus, overridePay, overrideSearch, overrideStart, overrideEnd) => {
    const sStatus = overrideStatus !== undefined ? overrideStatus : orderReportStatus;
    const sPay = overridePay !== undefined ? overridePay : orderReportPaymentStatus;
    const sTerm = overrideSearch !== undefined ? overrideSearch : orderReportSearch;
    const sDate = overrideStart !== undefined ? overrideStart : orderReportStartDate;
    const eDate = overrideEnd !== undefined ? overrideEnd : orderReportEndDate;

    if (sDate && eDate && sDate > eDate) {
      showToast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'warning');
      return;
    }

    setOrderReportLoading(true);
    try {
      let url = '/api/admin/reports/orders?';
      if (sStatus && sStatus !== 'all') url += `orderStatus=${encodeURIComponent(sStatus)}&`;
      if (sPay && sPay !== 'all') url += `paymentStatus=${encodeURIComponent(sPay)}&`;
      if (sTerm) url += `search=${encodeURIComponent(sTerm)}&`;
      if (sDate) url += `startDate=${encodeURIComponent(sDate)}&`;
      if (eDate) url += `endDate=${encodeURIComponent(eDate)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrderReportData(data.data);
      } else {
        showToast(data.message || 'Lỗi tải báo cáo đơn hàng', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ: ' + err.message, 'error');
    } finally {
      setOrderReportLoading(false);
    }
  };

  const exportOrderReportCsv = () => {
    let url = '/api/admin/reports/orders?format=excel';
    if (orderReportStatus && orderReportStatus !== 'all') url += `&orderStatus=${encodeURIComponent(orderReportStatus)}`;
    if (orderReportPaymentStatus && orderReportPaymentStatus !== 'all') url += `&paymentStatus=${encodeURIComponent(orderReportPaymentStatus)}`;
    if (orderReportSearch) url += `&search=${encodeURIComponent(orderReportSearch)}`;
    if (orderReportStartDate) url += `&startDate=${encodeURIComponent(orderReportStartDate)}`;
    if (orderReportEndDate) url += `&endDate=${encodeURIComponent(orderReportEndDate)}`;
    window.open(url, '_blank');
    showToast('Đang tạo và tải tệp Excel báo cáo đơn hàng...', 'success');
  };

  // API 76, FR-050: Xuất báo cáo danh sách đơn hàng định dạng PDF có dấu thời gian
  const exportOrderReportPdf = () => {
    let url = '/api/reports/export/pdf?type=orders';
    if (orderReportStatus && orderReportStatus !== 'all') url += `&status=${encodeURIComponent(orderReportStatus)}`;
    if (orderReportStartDate) url += `&startDate=${encodeURIComponent(orderReportStartDate)}`;
    if (orderReportEndDate) url += `&endDate=${encodeURIComponent(orderReportEndDate)}`;
    window.open(url, '_blank');
    showToast('Đang tạo và tải tệp PDF báo cáo đơn hàng...', 'success');
  };

  const getLocalDateString = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleQuickCustomerDateFilter = (days) => {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    if (days === 0) {
      setCustomerReportStartDate(todayStr);
      setCustomerReportEndDate(todayStr);
      loadCustomerReport(todayStr, todayStr, customerReportSearch);
    } else if (days === -1) {
      setCustomerReportStartDate('');
      setCustomerReportEndDate('');
      loadCustomerReport('', '', customerReportSearch);
    } else {
      const past = new Date();
      past.setDate(past.getDate() - days);
      const pastStr = getLocalDateString(past);
      setCustomerReportStartDate(pastStr);
      setCustomerReportEndDate(todayStr);
      loadCustomerReport(pastStr, todayStr, customerReportSearch);
    }
  };

  const handleQuickDateFilter = (days) => {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    if (days === 0) {
      setRevenueStartDate(todayStr);
      setRevenueEndDate(todayStr);
      loadRevenueReport(todayStr, todayStr);
    } else if (days === -1) {
      setRevenueStartDate('');
      setRevenueEndDate('');
      loadRevenueReport('', '');
    } else {
      const past = new Date();
      past.setDate(past.getDate() - days);
      const pastStr = getLocalDateString(past);
      setRevenueStartDate(pastStr);
      setRevenueEndDate(todayStr);
      loadRevenueReport(pastStr, todayStr);
    }
  };

  const handleQuickOrderDateFilter = (days) => {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    if (days === 0) {
      setOrderReportStartDate(todayStr);
      setOrderReportEndDate(todayStr);
      loadOrderReport(orderReportStatus, orderReportPaymentStatus, orderReportSearch, todayStr, todayStr);
    } else if (days === -1) {
      setOrderReportStartDate('');
      setOrderReportEndDate('');
      loadOrderReport(orderReportStatus, orderReportPaymentStatus, orderReportSearch, '', '');
    } else {
      const past = new Date();
      past.setDate(past.getDate() - days);
      const pastStr = getLocalDateString(past);
      setOrderReportStartDate(pastStr);
      setOrderReportEndDate(todayStr);
      loadOrderReport(orderReportStatus, orderReportPaymentStatus, orderReportSearch, pastStr, todayStr);
    }
  };

  const handleQuickInventoryDateFilter = (days) => {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    if (days === 0) {
      setInventoryReportStartDate(todayStr);
      setInventoryReportEndDate(todayStr);
      loadInventoryReport(inventoryReportCategory, inventoryReportStockStatus, inventoryReportSearch, todayStr, todayStr);
    } else if (days === -1) {
      setInventoryReportStartDate('');
      setInventoryReportEndDate('');
      loadInventoryReport(inventoryReportCategory, inventoryReportStockStatus, inventoryReportSearch, '', '');
    } else {
      const past = new Date();
      past.setDate(past.getDate() - days);
      const pastStr = getLocalDateString(past);
      setInventoryReportStartDate(pastStr);
      setInventoryReportEndDate(todayStr);
      loadInventoryReport(inventoryReportCategory, inventoryReportStockStatus, inventoryReportSearch, pastStr, todayStr);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!newNotification.title || !newNotification.title.trim()) {
      showToast('Vui lòng nhập tiêu đề thông báo!', 'warning');
      return;
    }
    if (!newNotification.content || !newNotification.content.trim()) {
      showToast('Vui lòng nhập nội dung thông báo!', 'warning');
      return;
    }

    if (newNotification.recipient_type === 'SPECIFIC') {
      if (!selectedRecipientIds || selectedRecipientIds.length === 0) {
        showToast('Vui lòng tích chọn ít nhất 1 người nhận cụ thể!', 'warning');
        return;
      }
    }

    setSendingNotification(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNotification.title.trim(),
          content: newNotification.content.trim(),
          recipient_type: newNotification.recipient_type,
          recipient_ids: newNotification.recipient_type === 'SPECIFIC' ? selectedRecipientIds : [],
          sender_id: currentUser?.id || 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Gửi thông báo thành công!');
        setShowCreateNotificationModal(false);
        setNewNotification({ title: '', content: '', recipient_type: 'ALL' });
        setSelectedRecipientIds([]);
        loadData();
      } else {
        showToast(data.message || 'Lỗi gửi thông báo', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    } finally {
      setSendingNotification(false);
    }
  };

  const handleConfirmDeleteNotification = async () => {
    if (!deletingNotification) return;
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingNotification.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa thông báo "${deletingNotification.title}" thành công!`);
        setDeletingNotification(null);
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa thông báo', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  const handleConfirmDeleteShippingFee = async () => {
    if (!deletingShippingFee) return;
    try {
      const res = await fetch(`/api/admin/shipping-fees/${deletingShippingFee.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa nấc cước "${deletingShippingFee.name}" thành công!`);
        setDeletingShippingFee(null);
        loadData();
      } else {
        showToast(data.message || 'Lỗi xóa nấc cước', 'error');
      }
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  // Quản lý tài khoản Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.full_name || !newAdmin.full_name.trim()) {
      showToast('Vui lòng nhập họ và tên quản trị viên!', 'warning');
      return;
    }
    if (!newAdmin.phone || !newAdmin.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại quản trị viên!', 'warning');
      return;
    }
    if (!newAdmin.password || newAdmin.password.length < 8) {
      showToast('Mật khẩu quản trị phải có tối thiểu 8 ký tự!', 'warning');
      return;
    }
    if (!/[A-Z]/.test(newAdmin.password) || !/[a-z]/.test(newAdmin.password) || !/[0-9]/.test(newAdmin.password)) {
      showToast('Mật khẩu quản trị phải gồm ít nhất 1 chữ in hoa, 1 chữ in thường và 1 chữ số!', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddAdminModal(false);
        setNewAdmin({ full_name: '', phone: '', password: '', branch_id: 1, role_id: 2 });
        showToast('Tạo tài khoản quản trị thành công!', 'success');
        loadData();
      } else {
        showToast(data.message || 'Lỗi tạo tài khoản quản trị', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  // Chỉnh sửa thông tin Admin
  const openEditAdminModal = (admin) => {
    setEditAdminModal({
      isOpen: true,
      admin,
      full_name: admin.full_name,
      phone: admin.phone,
      branch_id: admin.branch_id || 1,
    });
  };

  const handleUpdateAdminSubmit = async (e) => {
    e.preventDefault();
    if (!editAdminModal.admin) return;
    if (!editAdminModal.full_name || !editAdminModal.full_name.trim()) {
      showToast('Vui lòng nhập họ và tên quản trị viên!', 'warning');
      return;
    }
    if (!editAdminModal.phone || !editAdminModal.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại quản trị viên!', 'warning');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${editAdminModal.admin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: editAdminModal.full_name,
          phone: editAdminModal.phone,
          branch_id: editAdminModal.branch_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Cập nhật thông tin Admin thành công!', 'success');
        setEditAdminModal({ isOpen: false, admin: null, full_name: '', phone: '', branch_id: 1 });
        loadData();
      } else {
        showToast(data.message || 'Lỗi cập nhật thông tin Admin', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  // Đặt lại mật khẩu Admin
  const openResetPasswordModal = (admin) => {
    setResetPasswordModal({
      isOpen: true,
      admin,
      password: '',
      confirm_password: '',
    });
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetPasswordModal.admin) return;
    if (!resetPasswordModal.password || resetPasswordModal.password.length < 8) {
      showToast('Mật khẩu mới phải có tối thiểu 8 ký tự!', 'error');
      return;
    }
    if (!/[A-Z]/.test(resetPasswordModal.password) || !/[a-z]/.test(resetPasswordModal.password) || !/[0-9]/.test(resetPasswordModal.password)) {
      showToast('Mật khẩu mới phải gồm ít nhất 1 chữ in hoa, 1 chữ in thường và 1 chữ số!', 'error');
      return;
    }
    if (!resetPasswordModal.confirm_password) {
      showToast('Vui lòng nhập xác nhận mật khẩu mới!', 'error');
      return;
    }
    if (resetPasswordModal.password !== resetPasswordModal.confirm_password) {
      showToast('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${resetPasswordModal.admin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: resetPasswordModal.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Đặt lại mật khẩu thành công!', 'success');
        setResetPasswordModal({ isOpen: false, admin: null, password: '', confirm_password: '' });
      } else {
        showToast(data.message || 'Lỗi đặt lại mật khẩu', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    }
  };

  // Xem chi tiết khách hàng và lịch sử mua sắm (FR-040 & UC-18)
  const handleViewCustomerDetail = async (customer) => {
    setLoadingCustomerDetail(true);
    setSelectedCustomerDetail({ ...customer, orders: [] });
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCustomerDetail(data.data);
      } else {
        showToast(data.message || 'Lỗi tải chi tiết khách hàng', 'error');
      }
    } catch (e) {
      showToast('Lỗi kết nối: ' + e.message, 'error');
    } finally {
      setLoadingCustomerDetail(false);
    }
  };

  // Phân quyền chức năng cho Admin Chi nhánh (FR-039)
  const openAssignPermissionsModal = async (admin) => {
    if (admin.id === 1) {
      showToast('Admin Tổng luôn nắm giữ toàn bộ quyền hạn hệ thống.', 'warning');
      return;
    }
    setPermissionModal({
      isOpen: true,
      admin,
      selectedIds: [],
      loading: true,
      saving: false,
    });
    try {
      const res = await fetch(`/api/admin/permissions?user_id=${admin.id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setPermissionModal({
          isOpen: true,
          admin,
          selectedIds: data.data.user_permission_ids || [],
          loading: false,
          saving: false,
        });
      } else {
        showToast(data.message || 'Không thể tải danh sách quyền', 'error');
        setPermissionModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      showToast('Lỗi kết nối khi tải quyền: ' + err.message, 'error');
      setPermissionModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const toggleModulePermissions = (module) => {
    setPermissionModal((prev) => {
      const allSelected = module.permissionIds.every((id) => prev.selectedIds.includes(id));
      let updated;
      if (allSelected) {
        updated = prev.selectedIds.filter((id) => !module.permissionIds.includes(id));
      } else {
        const toAdd = module.permissionIds.filter((id) => !prev.selectedIds.includes(id));
        updated = [...prev.selectedIds, ...toAdd];
      }
      return { ...prev, selectedIds: updated };
    });
  };

  const handleSelectAllPermissions = () => {
    const allIds = SRS_FUNCTIONAL_MODULES.flatMap((m) => m.permissionIds);
    setPermissionModal((prev) => ({ ...prev, selectedIds: Array.from(new Set(allIds)) }));
  };

  const handleDeselectAllPermissions = () => {
    setPermissionModal((prev) => ({ ...prev, selectedIds: [] }));
  };

  const handleSavePermissionsSubmit = async (e) => {
    e?.preventDefault();
    if (!permissionModal.admin) return;
    setPermissionModal((prev) => ({ ...prev, saving: true }));
    try {
      const res = await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: permissionModal.admin.id,
          permission_ids: permissionModal.selectedIds,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Phân quyền thành công!', 'success');
        if (currentUser && currentUser.id === permissionModal.admin.id) {
          const allPermNames = [];
          SRS_FUNCTIONAL_MODULES.forEach((m) => {
            if (m.permissionIds.some((id) => permissionModal.selectedIds.includes(id))) {
              allPermNames.push(...m.permissionNames);
            }
          });
          const updatedUser = { ...currentUser, permissions: Array.from(new Set(allPermNames)) };
          setCurrentUser(updatedUser);
          saveAuthSession(updatedUser);
        }
        setPermissionModal({ isOpen: false, admin: null, selectedIds: [], loading: false, saving: false });
        loadData();
      } else {
        showToast(data.message || 'Lỗi lưu phân quyền', 'error');
        setPermissionModal((prev) => ({ ...prev, saving: false }));
      }
    } catch (err) {
      showToast('Lỗi kết nối: ' + err.message, 'error');
      setPermissionModal((prev) => ({ ...prev, saving: false }));
    }
  };

  // Mở các modal xác nhận chuẩn phong cách KhoHang_JAVA (lockModal, unlockModal, deleteModal)
  const openLockModal = (user) => {
    if (user.id === 1) {
      showToast('Không thể khóa tài khoản Admin Tổng mặc định!', 'warning');
      return;
    }
    setActionModal({ isOpen: true, actionType: 'lock', targetUser: user });
  };

  const openUnlockModal = (user) => {
    setActionModal({ isOpen: true, actionType: 'unlock', targetUser: user });
  };

  const openDeleteModal = (user) => {
    if (user.id === 1) {
      showToast('Không thể xóa tài khoản Admin Tổng mặc định!', 'warning');
      return;
    }
    setActionModal({ isOpen: true, actionType: 'delete', targetUser: user });
  };

  const executeActionModal = async () => {
    const user = actionModal.targetUser;
    if (!user) return;
    const { actionType } = actionModal;
    setActionModal({ isOpen: false, actionType: 'lock', targetUser: null });

    if (actionType === 'lock' || actionType === 'unlock') {
      const newStatus = actionType === 'lock' ? 0 : 1;
      try {
        const res = await fetch(`/api/admin/users/${user.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(
            actionType === 'lock'
              ? `Tài khoản ${user.full_name} đã bị vô hiệu hóa!`
              : `Đã mở khóa tài khoản ${user.full_name} thành công!`,
            'success'
          );
          loadData();
        } else {
          showToast(data.message || 'Lỗi cập nhật trạng thái', 'error');
        }
      } catch (e) {
        showToast('Lỗi kết nối máy chủ: ' + e.message, 'error');
      }
    } else if (actionType === 'delete') {
      try {
        const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          showToast(`Đã thu hồi và xóa vĩnh viễn tài khoản ${user.full_name}!`, 'success');
          loadData();
        } else {
          showToast(data.message || 'Lỗi xóa tài khoản', 'error');
        }
      } catch (e) {
        showToast('Lỗi kết nối máy chủ: ' + e.message, 'error');
      }
    }
  };

  // 1. Màn hình chờ xác thực
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3 bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800 shadow-xl">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          <span className="font-bold text-sm">Đang xác thực cổng Quản Trị...</span>
        </div>
      </div>
    );
  }

  // 2. Màn hình Đăng Nhập Quản Trị
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-8 shadow-2xl text-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
              <ShieldCheck className="w-9 h-9 text-slate-950" />
            </div>
            <h1 className="text-2xl font-black tracking-tight font-heading text-white">CỔNG QUẢN TRỊ VIÊN</h1>
            <p className="text-xs text-emerald-300/80 font-medium">{siteSettings?.site_name ? `Hệ Thống Bán Trái Cây ${siteSettings.site_name}` : "Hệ Thống Quản Trị Trái Cây Đặc Sản"}</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} noValidate className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Số điện thoại Quản Trị</label>
              <input
                type="tel"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="0988888888"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Mật khẩu Quản Trị</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-slate-950 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
            >
              Đăng Nhập Vào Hệ Thống Quản Trị
            </button>
          </form>


          <div className="pt-2 text-center border-t border-slate-800">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Về trang chủ mua hàng của khách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar Menu Groups
  const navigationGroups = [
    {
      group: 'BÁN HÀNG & GIAO VẬN',
      items: [
        { key: 'orders', label: 'Đơn Hàng & GreenSM', icon: ShoppingCart, count: orders.length },
        { key: 'reports', label: 'Báo Cáo Doanh Thu', icon: BarChart3 },
      ]
    },
    {
      group: 'QUẢN LÝ NÔNG SẢN',
      items: [
        { key: 'products', label: 'Sản Phẩm 4 Mùa', icon: Package, count: products.length },
        { key: 'categories', label: 'Danh Mục Mùa Vụ', icon: Tag, count: categories.length },
        { key: 'promotions', label: 'Khuyến Mãi & Voucher', icon: Percent, count: promotions.length },
      ]
    },
    {
      group: 'HỆ THỐNG & VẬN HÀNH',
      items: [
        { key: 'admins', label: 'Tài Khoản Quản Trị', icon: ShieldCheck, count: adminUsers.length },
        { key: 'branches', label: 'Chi Nhánh Cửa Hàng', icon: MapPin, count: branches.length },
        { key: 'banners', label: 'Banner Quảng Cáo', icon: ImageIcon, count: banners.length },
        { key: 'customers', label: 'Khách Hàng', icon: Users, count: customers.length },
        { key: 'logs', label: 'Nhật Ký Hoạt Động', icon: FileText, count: logs.length },
        { key: 'settings', label: 'Cấu Hình Website', icon: Settings },
        { key: 'notifications', label: 'Quản Lý Thông Báo', icon: Bell, count: notifications.length },
      ]
    }
  ];

  // Lọc thanh điều hướng theo phân quyền thực tế của tài khoản (BR-026)
  const visibleNavGroups = navigationGroups
    .map((grp) => ({
      ...grp,
      items: grp.items.filter((item) => hasPermissionForTab(item.key)),
    }))
    .filter((grp) => grp.items.length > 0);

  const currentTabLabel = navigationGroups.flatMap(g => g.items).find(i => i.key === activeTab)?.label || 'Bảng Điều Khiển';

  // Filtered products & pagination slices (Chuẩn KhoHang_JAVA)
  const filteredProducts = products.filter(p => {
    const matchSearch = productSearch ? p.name.toLowerCase().includes(productSearch.toLowerCase()) : true;
    const matchCategory = productCategoryFilter ? p.category_id === parseInt(productCategoryFilter, 10) : true;
    const matchStatus = productStatusFilter !== '' ? p.status === parseInt(productStatusFilter, 10) : true;
    return matchSearch && matchCategory && matchStatus;
  });

  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productPageSize,
    productPage * productPageSize
  );

  const paginatedOrders = orders.slice(
    (orderPage - 1) * orderPageSize,
    orderPage * orderPageSize
  );

  const filteredCustomers = customers.filter(cu => {
    const matchSearch = customerSearch
      ? ((cu.full_name && cu.full_name.toLowerCase().includes(customerSearch.toLowerCase())) ||
        (cu.phone && cu.phone.includes(customerSearch)) ||
        (cu.address && cu.address.toLowerCase().includes(customerSearch.toLowerCase())))
      : true;
    const matchStatus = customerStatusFilter !== ''
      ? cu.status === parseInt(customerStatusFilter, 10)
      : true;
    return matchSearch && matchStatus;
  });

  const filteredBanners = banners.filter((bn) => {
    const matchSearch = bannerSearch ? bn.title.toLowerCase().includes(bannerSearch.toLowerCase()) : true;
    const matchStatus = bannerStatusFilter === 'ACTIVE'
      ? bn.status === 1
      : bannerStatusFilter === 'INACTIVE'
        ? bn.status === 0
        : true;
    return matchSearch && matchStatus;
  });

  const paginatedCustomers = filteredCustomers.slice(
    (customerPage - 1) * customerPageSize,
    customerPage * customerPageSize
  );

  // Compatibility aliases for modularized sub-tabs
  const handlePromptChangeOrderStatus = promptChangeOrderStatus;
  const handlePromptPauseOrder = promptPauseOrder;
  const handlePromptResumeOrder = promptResumeOrder;
  const handlePromptCancelOrder = promptCancelOrder;
  const handleOpenEditProductModal = openEditProductModal;
  const handleOpenAssignProductsModal = openAssignProductsModal;
  const handleOpenAssignPermissionsModal = openAssignPermissionsModal;
  const loadLogs = () => reloadLogs();

  const reloadLogs = async () => {
    setRefreshingLogs(true);
    try {
      const res = await fetch('/api/admin/logs?limit=300');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        if (data.stats) setLogStats(data.stats);
        showToast('Đã làm mới nhật ký kiểm toán!');
      }
    } catch (err) {
      showToast('Lỗi tải nhật ký: ' + err.message, 'error');
    } finally {
      setRefreshingLogs(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    const matchesModule = logModuleFilter === 'ALL' || l.module === logModuleFilter;
    const term = logSearch.toLowerCase().trim();
    const actionLabel = (LOG_ACTION_LABELS[l.action] || '').toLowerCase();
    const moduleLabel = (LOG_MODULE_LABELS[l.module] || '').toLowerCase();
    const matchesSearch = !term ||
      (l.user_name && l.user_name.toLowerCase().includes(term)) ||
      (l.phone && l.phone.includes(term)) ||
      (l.role_name && l.role_name.toLowerCase().includes(term)) ||
      (l.action && l.action.toLowerCase().includes(term)) ||
      actionLabel.includes(term) ||
      (l.module && l.module.toLowerCase().includes(term)) ||
      moduleLabel.includes(term) ||
      (l.description && l.description.toLowerCase().includes(term)) ||
      (l.ip_address && l.ip_address.includes(term));
    return matchesModule && matchesSearch;
  });

  const paginatedLogs = filteredLogs.slice(
    (logPage - 1) * logPageSize,
    logPage * logPageSize
  );

  const filteredPromotions = promotions.filter(pr => {
    const matchSearch = promotionSearch ? pr.title.toLowerCase().includes(promotionSearch.toLowerCase()) : true;
    const matchStatus = promotionStatusFilter !== '' ? pr.status === parseInt(promotionStatusFilter, 10) : true;
    return matchSearch && matchStatus;
  });

  // Danh sách người dùng để chọn người nhận thông báo đích danh (FR-046)
  const allAvailableUsers = [
    ...adminUsers.map(a => ({ id: a.id, full_name: a.full_name, phone: a.phone, role_name: a.role_name || 'Admin Chi nhánh', type: 'ADMIN' })),
    ...customers.map(c => ({ id: c.id, full_name: c.full_name, phone: c.phone, role_name: 'Khách hàng', type: 'CUSTOMER' }))
  ].filter((u, idx, arr) => arr.findIndex(x => x.id === u.id) === idx);

  const filteredPickerUsers = allAvailableUsers.filter(u => {
    const matchRole = userPickerRoleFilter === 'ALL' || u.type === userPickerRoleFilter;
    const term = userPickerSearch.toLowerCase().trim();
    const matchSearch = !term ||
      (u.full_name && u.full_name.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term));
    return matchRole && matchSearch;
  });

  const filteredNotifications = notifications.filter((n) => {
    const matchType = notificationRecipientFilter === 'ALL_FILTER' || n.recipient_type === notificationRecipientFilter;
    const term = notificationSearch.toLowerCase().trim();
    const matchSearch = !term ||
      (n.title && n.title.toLowerCase().includes(term)) ||
      (n.content && n.content.toLowerCase().includes(term)) ||
      (n.sender_name && n.sender_name.toLowerCase().includes(term));
    return matchType && matchSearch;
  });

  // Phân trang danh sách Báo cáo khách hàng (FR-048)
  const custReportList = customerReportData?.customers || [];
  const paginatedCustReport = custReportList.slice(
    (customerReportPage - 1) * customerReportPageSize,
    customerReportPage * customerReportPageSize
  );

  const paginatedNotifications = filteredNotifications.slice(
    (notificationPage - 1) * notificationPageSize,
    notificationPage * notificationPageSize
  );

  const paginatedPromotions = filteredPromotions.slice(
    (promotionPage - 1) * promotionPageSize,
    promotionPage * promotionPageSize
  );

  const filteredBranches = branches.filter(b => {
    const matchSearch = branchSearch
      ? ((b.branch_name && b.branch_name.toLowerCase().includes(branchSearch.toLowerCase())) ||
        (b.phone && b.phone.includes(branchSearch)) ||
        (b.address && b.address.toLowerCase().includes(branchSearch.toLowerCase())))
      : true;
    const matchStatus = branchStatusFilter === 'ACTIVE'
      ? b.status === 1
      : branchStatusFilter === 'INACTIVE'
        ? b.status === 0
        : true;
    return matchSearch && matchStatus;
  });

  const isSuperAdmin = currentUser?.role_id === 1;

  return (
    <div className="h-screen bg-slate-50/80 flex font-sans relative overflow-hidden">
      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* 1. LEFT SIDEBAR (MODERN ENTERPRISE STUDIO - RESPONSIVE DRAWER) */}
      <aside className={`fixed inset-y-0 left-0 lg:static z-50 lg:z-30 h-full w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 shadow-2xl transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Logo Header (Có hiệu ứng làm mờ khi chưa có dữ liệu để tránh hardcode) */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
            {siteSettings?.site_name ? (
              <>
                {siteSettings.logo_url ? (
                  <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 border border-emerald-500/30">
                    <img src={siteSettings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25 shrink-0">
                    <Leaf className="w-6 h-6 text-slate-950" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-black text-white text-lg tracking-tight leading-none truncate">
                    <span>{siteSettings.site_name.trim()}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Admin Studio Pro</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 w-full filter blur-[1.5px] opacity-40 animate-pulse transition-all duration-300">
                <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-slate-600" />
                </div>
                <div className="space-y-1.5 flex-1 py-1">
                  <div className="h-4 w-28 bg-slate-700 rounded-md"></div>
                  <div className="h-2.5 w-20 bg-slate-800 rounded-md"></div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items (Grouped) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
            {visibleNavGroups.map((grp) => (
              <div key={grp.group} className="space-y-1.5">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-2">
                  {grp.group}
                </div>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveTab(item.key);
                        setIsMobileSidebarOpen(false);
                        window.history.replaceState(null, '', `?tab=${item.key}`);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-black'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive
                          ? 'bg-slate-950 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                          }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Sidebar: Admin Profile & Logout */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                  AD
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-white font-bold text-xs truncate">{currentUser?.full_name || 'Admin'}</div>
                  <div className="text-emerald-400 text-[11px] font-semibold truncate flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{currentUser?.role_name || 'Admin Tổng'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAdminLogout}
                title="Đăng xuất khỏi Quản Trị"
                className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shrink-0 z-20 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition mr-1"
              aria-label="Mở danh mục quản trị"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
              <span>Hệ Thống</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900 font-extrabold">{currentTabLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Branch Selector Badge */}
            {(() => {
              const currentBranch = branches?.find((b) => Number(b.id) === Number(currentUser?.branch_id));
              const branchBadgeText = isSuperAdmin
                ? 'Toàn hệ thống'
                : (currentBranch?.branch_name || (currentUser?.branch_id ? `Chi nhánh ${currentUser.branch_id}` : 'Chi nhánh trực thuộc'));

              return (
                <div
                  title={isSuperAdmin ? `Admin Tổng - Quản lý toàn bộ hệ thống (${branches?.length || 0} chi nhánh)` : `Admin Chi nhánh: ${branchBadgeText}`}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{branchBadgeText}</span>
                </div>
              );
            })()}

            {/* Refresh Button */}
            <button
              onClick={() => loadData(true)}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Làm mới</span>
            </button>

            {/* Admin Notification Bell Dropdown (FR-046) */}
            <div id="admin-notif-container" className="relative">
              <button
                type="button"
                onClick={() => {
                  const nextState = !adminNotifOpen;
                  setAdminNotifOpen(nextState);
                  if (nextState) {
                    markAllAdminNotifsAsRead();
                  }
                }}
                className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center cursor-pointer shadow-2xs border border-slate-200/60"
                title="Thông báo hệ thống"
                aria-label="Xem thông báo quản trị"
              >
                <Bell className="w-4.5 h-4.5 text-slate-700" />
                {unreadAdminNotifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                    {unreadAdminNotifCount > 99 ? '99+' : unreadAdminNotifCount}
                  </span>
                )}
              </button>

              {/* Admin Notification Dropdown */}
              {adminNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span className="font-extrabold text-sm text-slate-900">Thông Báo Hệ Thống</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {notifications.length} bản tin
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAdminNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 space-y-1">
                        <Bell className="w-7 h-7 mx-auto text-slate-300 mb-1" />
                        <p className="text-xs font-semibold text-slate-600">Chưa có thông báo nào</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markSingleAdminNotifAsRead(n.id);
                            setSelectedNotificationDetail(n);
                            setAdminNotifOpen(false);
                          }}
                          className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{n.content}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                              <span>Gửi tới: {n.recipient_type}</span>
                              <span>{formatDate(n.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Open Storefront */}
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem Cửa Hàng</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Content Canvas */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto min-w-0">
          {!hasPermissionForTab(activeTab) ? (
            <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto my-16 border border-slate-200/80 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-black text-xl text-slate-900 mb-2">Quyền truy cập bị giới hạn</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Tài khoản quản trị của bạn chưa được phân quyền truy cập chức năng này theo quy định của hệ thống. Vui lòng liên hệ Admin Tổng để được cấp quyền.
              </p>
              <button
                type="button"
                onClick={() => {
                  const allowed = ['orders', 'products', 'categories', 'promotions', 'reports', 'banners', 'customers'].find((t) => hasPermissionForTab(t));
                  if (allowed) {
                    setActiveTab(allowed);
                    window.history.replaceState(null, '', `?tab=${allowed}`);
                  }
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition cursor-pointer shadow-md shadow-emerald-600/20"
              >
                Quay lại chức năng được cấp quyền
              </button>
            </div>
          ) : (
            <>
              {/* 4 MODERN KPI CARDS ROW (DÀNH RIÊNG CHO ADMIN TỔNG, SKELETON KHI CHƯA LOAD) */}
              {isSuperAdmin && (
                loading && !stats ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
                        <div className="space-y-3 w-3/4">
                          <div className="h-3 w-24 bg-slate-200 rounded-md" />
                          <div className="h-7 w-32 bg-slate-300 rounded-lg" />
                          <div className="h-4 w-28 bg-slate-200 rounded-md" />
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : stats ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Doanh thu */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng doanh thu</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1 font-heading">
                          {parseFloat(stats.totalRevenue).toLocaleString('vi-VN')} đ
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Cập nhật trực tiếp</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                        <TrendingUp className="w-6 h-6 stroke-[2.2]" />
                      </div>
                    </div>

                    {/* Card 2: Đơn hàng */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng đơn hàng</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1 font-heading">
                          {orders.length} đơn
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-2 bg-blue-50 px-2 py-0.5 rounded-md inline-flex">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Đơn hàng toàn hệ thống</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                        <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
                      </div>
                    </div>

                    {/* Card 3: Sản phẩm */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm 4 mùa</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1 font-heading">
                          {stats.totalProducts} mặt hàng
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-2 bg-amber-50 px-2 py-0.5 rounded-md inline-flex">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Đang kinh doanh</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                        <Package className="w-6 h-6 stroke-[2.2]" />
                      </div>
                    </div>

                    {/* Card 4: Tồn kho ít */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cảnh báo tồn kho (&le;10)</p>
                        <h3 className={`text-2xl font-black mt-1 font-heading ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                          {stats.lowStockCount} sản phẩm
                        </h3>
                        <div className={`flex items-center gap-1 text-[11px] font-bold mt-2 px-2 py-0.5 rounded-md inline-flex ${stats.lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{stats.lowStockCount > 0 ? 'Cần nhập thêm' : 'Tồn kho ổn định'}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${stats.lowStockCount > 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                      </div>
                    </div>
                  </div>
                ) : null
              )}

              {/* TAB CONTENT (SKELETON KHI CHƯA LOAD XONG & LÀM MỜ KHI LÀM MỚI DỮ LIỆU) */}
              {loading && !stats && orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6 animate-pulse">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="h-9 w-64 bg-slate-200 rounded-xl" />
                    <div className="flex gap-2 w-full sm:w-auto">
                      <div className="h-9 w-32 bg-slate-200 rounded-xl" />
                      <div className="h-9 w-28 bg-slate-200 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 bg-slate-100 rounded-xl w-full" />
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-14 bg-slate-50/70 border border-slate-100 rounded-xl w-full flex items-center px-4 gap-4">
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                        <div className="h-4 w-40 bg-slate-200 rounded" />
                        <div className="h-4 w-24 bg-slate-200 rounded ml-auto" />
                        <div className="h-4 w-20 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {/* TAB 1: QUẢN LÝ ĐƠN HÀNG & GREENSM */}

                  {/* TAB 1: QUẢN LÝ ĐƠN HÀNG & GREENSM */}
                  {activeTab === 'orders' && (
                    <AdminOrdersTab
                      orders={orders}
                      paginatedOrders={paginatedOrders}
                      orderSearch={orderSearch}
                      setOrderSearch={setOrderSearch}
                      orderStatusFilter={orderStatusFilter}
                      setOrderStatusFilter={setOrderStatusFilter}
                      orderStartDate={orderStartDate}
                      setOrderStartDate={setOrderStartDate}
                      orderEndDate={orderEndDate}
                      setOrderEndDate={setOrderEndDate}
                      orderPage={orderPage}
                      setOrderPage={setOrderPage}
                      orderPageSize={orderPageSize}
                      setOrderPageSize={setOrderPageSize}
                      onViewOrderDetail={(o) => setSelectedOrder(o)}
                      onPromptChangeOrderStatus={promptChangeOrderStatus}
                      onPromptPauseOrder={promptPauseOrder}
                      onPromptResumeOrder={promptResumeOrder}
                      onPromptCancelOrder={promptCancelOrder}
                    />
                  )}

                  {/* TAB 2: QUẢN LÝ SẢN PHẨM */}
                  {activeTab === 'products' && (
                    <AdminProductsTab
                      categories={categories}
                      filteredProducts={filteredProducts}
                      paginatedProducts={paginatedProducts}
                      productSearch={productSearch}
                      setProductSearch={setProductSearch}
                      productCategoryFilter={productCategoryFilter}
                      setProductCategoryFilter={setProductCategoryFilter}
                      productStatusFilter={productStatusFilter}
                      setProductStatusFilter={setProductStatusFilter}
                      productPage={productPage}
                      setProductPage={setProductPage}
                      productPageSize={productPageSize}
                      setProductPageSize={setProductPageSize}
                      onOpenAddProductModal={() => setShowAddProductModal(true)}
                      onOpenEditProductModal={openEditProductModal}
                      onToggleProductStatus={handleToggleProductStatus}
                      onDeleteProduct={handleDeleteProduct}
                    />
                  )}

                  {/* TAB 3: QUẢN LÝ DANH MỤC */}
                  {activeTab === 'categories' && (
                    <AdminCategoriesTab
                      categories={categories}
                      onOpenAddCategoryModal={() => setShowAddCategoryModal(true)}
                      onOpenEditCategoryModal={(c) => setEditCategoryModal({ isOpen: true, category: { ...c } })}
                      onToggleCategoryStatus={handleToggleCategoryStatus}
                      onDeleteCategory={handleDeleteCategory}
                    />
                  )}

                  {/* TAB 4: QUẢN LÝ KHUYẾN MÃI */}
                  {activeTab === 'promotions' && (
                    <AdminPromotionsTab
                      promotions={promotions}
                      filteredPromotions={filteredPromotions}
                      paginatedPromotions={paginatedPromotions}
                      promotionSearch={promotionSearch}
                      setPromotionSearch={setPromotionSearch}
                      promotionStatusFilter={promotionStatusFilter}
                      setPromotionStatusFilter={setPromotionStatusFilter}
                      promotionPage={promotionPage}
                      setPromotionPage={setPromotionPage}
                      promotionPageSize={promotionPageSize}
                      setPromotionPageSize={setPromotionPageSize}
                      onOpenAddPromotionModal={() => setShowAddPromotionModal(true)}
                      onOpenEditPromotionModal={(p) => setEditPromotionModal({ isOpen: true, promotion: { ...p } })}
                      onOpenAssignProductsModal={openAssignProductsModal}
                      onTogglePromotionStatus={handleTogglePromotionStatus}
                      onDeletePromotion={handleDeletePromotion}
                    />
                  )}

                  {/* TAB 5: QUẢN LÝ CHI NHÁNH */}
                  {activeTab === 'branches' && (
                    <AdminBranchesTab
                      branches={branches}
                      filteredBranches={filteredBranches}
                      branchSearch={branchSearch}
                      setBranchSearch={setBranchSearch}
                      branchStatusFilter={branchStatusFilter}
                      setBranchStatusFilter={setBranchStatusFilter}
                      onOpenAddBranchModal={() => setShowAddBranchModal(true)}
                      onEditBranch={(b) => setEditingBranch({ ...b })}
                      onToggleStatusBranch={(b) => setToggleStatusBranch(b)}
                      onDeleteBranch={(b) => setDeletingBranch(b)}
                    />
                  )}

                  {/* TAB 6: QUẢN LÝ BANNER & MARKETING */}
                  {activeTab === 'banners' && (
                    <AdminBannersTab
                      banners={banners}
                      filteredBanners={filteredBanners}
                      bannerSearch={bannerSearch}
                      setBannerSearch={setBannerSearch}
                      bannerStatusFilter={bannerStatusFilter}
                      setBannerStatusFilter={setBannerStatusFilter}
                      onOpenAddBannerModal={() => setShowAddBannerModal(true)}
                      onToggleBannerStatus={handleToggleBannerStatus}
                      onEditBanner={(banner) => setEditingBanner({ ...banner })}
                      onDeleteBanner={(banner) => setDeletingBanner(banner)}
                    />
                  )}

                  {/* TAB 7: QUẢN LÝ ADMIN CHI NHÁNH */}
                  {activeTab === 'admins' && (
                    <AdminUsersTab
                      adminUsers={adminUsers}
                      onOpenAddAdminModal={() => {
                        setNewAdmin({
                          full_name: '',
                          phone: '',
                          password: '',
                          branch_id: branches.length > 0 ? branches[0].id : '',
                          role_id: 2
                        });
                        setShowAddAdminModal(true);
                      }}
                      onOpenEditAdminModal={(a) => setEditAdminModal({
                        isOpen: true,
                        admin: { ...a },
                        full_name: a.full_name,
                        phone: a.phone,
                        branch_id: a.branch_id || (branches.length > 0 ? branches[0].id : '')
                      })}
                      onOpenResetPasswordModal={(a) => setResetPasswordModal({ isOpen: true, admin: a, password: '', confirm_password: '' })}
                      onOpenAssignPermissionsModal={openAssignPermissionsModal}
                      onLockUser={(a) => setActionModal({ isOpen: true, actionType: 'lock', targetUser: a })}
                      onUnlockUser={(a) => setActionModal({ isOpen: true, actionType: 'unlock', targetUser: a })}
                      onDeleteUser={(a) => setActionModal({ isOpen: true, actionType: 'delete', targetUser: a })}
                    />
                  )}

                  {/* TAB 8: QUẢN LÝ KHÁCH HÀNG */}
                  {activeTab === 'customers' && (
                    <AdminCustomersTab
                      customers={customers}
                      filteredCustomers={filteredCustomers}
                      paginatedCustomers={paginatedCustomers}
                      customerSearch={customerSearch}
                      setCustomerSearch={setCustomerSearch}
                      customerStatusFilter={customerStatusFilter}
                      setCustomerStatusFilter={setCustomerStatusFilter}
                      customerPage={customerPage}
                      setCustomerPage={setCustomerPage}
                      customerPageSize={customerPageSize}
                      setCustomerPageSize={setCustomerPageSize}
                      onViewCustomerDetail={handleViewCustomerDetail}
                      onLockCustomer={(c) => setActionModal({ isOpen: true, actionType: 'lock', targetUser: c })}
                      onUnlockCustomer={(c) => setActionModal({ isOpen: true, actionType: 'unlock', targetUser: c })}
                    />
                  )}

                  {/* TAB 9: NHẬT KÝ HỆ THỐNG */}
                  {activeTab === 'logs' && (
                    <AdminLogsTab
                      logs={logs}
                      logStats={logStats}
                      filteredLogs={filteredLogs}
                      paginatedLogs={paginatedLogs}
                      logSearch={logSearch}
                      setLogSearch={setLogSearch}
                      logModuleFilter={logModuleFilter}
                      setLogModuleFilter={setLogModuleFilter}
                      logPage={logPage}
                      setLogPage={setLogPage}
                      logPageSize={logPageSize}
                      setLogPageSize={setLogPageSize}
                      reloadLogs={reloadLogs}
                      refreshingLogs={refreshingLogs}
                    />
                  )}

                  {/* TAB 10: BÁO CÁO THỐNG KÊ */}
                  {activeTab === 'reports' && (
                    <AdminReportsTab
                      reportSubTab={reportSubTab}
                      setReportSubTab={setReportSubTab}
                      revenueData={revenueData}
                      revenueLoading={revenueLoading}
                      revenueStartDate={revenueStartDate}
                      setRevenueStartDate={setRevenueStartDate}
                      revenueEndDate={revenueEndDate}
                      setRevenueEndDate={setRevenueEndDate}
                      handleExportRevenueExcel={handleExportRevenueExcel}
                      handleExportRevenuePdf={handleExportRevenuePdf}
                      loadRevenueReport={loadRevenueReport}
                      handleQuickDateFilter={handleQuickDateFilter}
                      customerReportData={customerReportData}
                      customerReportLoading={customerReportLoading}
                      customerReportStartDate={customerReportStartDate}
                      setCustomerReportStartDate={setCustomerReportStartDate}
                      customerReportEndDate={customerReportEndDate}
                      setCustomerReportEndDate={setCustomerReportEndDate}
                      customerReportSearch={customerReportSearch}
                      setCustomerReportSearch={setCustomerReportSearch}
                      handleExportCustomerExcel={handleExportCustomerExcel}
                      handleExportCustomerPdf={handleExportCustomerPdf}
                      handleQuickCustomerDateFilter={handleQuickCustomerDateFilter}
                      loadCustomerReport={loadCustomerReport}
                      customerReportPage={customerReportPage}
                      setCustomerReportPage={setCustomerReportPage}
                      customerReportPageSize={customerReportPageSize}
                      setCustomerReportPageSize={setCustomerReportPageSize}
                      inventoryReportData={inventoryReportData}
                      inventoryReportLoading={inventoryReportLoading}
                      inventoryReportSearch={inventoryReportSearch}
                      setInventoryReportSearch={setInventoryReportSearch}
                      inventoryReportPage={inventoryReportPage}
                      setInventoryReportPage={setInventoryReportPage}
                      inventoryReportCategory={inventoryReportCategory}
                      setInventoryReportCategory={setInventoryReportCategory}
                      inventoryReportStockStatus={inventoryReportStockStatus}
                      setInventoryReportStockStatus={setInventoryReportStockStatus}
                      inventoryReportStartDate={inventoryReportStartDate}
                      setInventoryReportStartDate={setInventoryReportStartDate}
                      inventoryReportEndDate={inventoryReportEndDate}
                      setInventoryReportEndDate={setInventoryReportEndDate}
                      inventoryReportPageSize={inventoryReportPageSize}
                      setInventoryReportPageSize={setInventoryReportPageSize}
                      exportInventoryReportCsv={exportInventoryReportCsv}
                      exportInventoryReportPdf={exportInventoryReportPdf}
                      loadInventoryReport={loadInventoryReport}
                      handleQuickInventoryDateFilter={handleQuickInventoryDateFilter}
                      orderReportData={orderReportData}
                      orderReportLoading={orderReportLoading}
                      orderReportSearch={orderReportSearch}
                      setOrderReportSearch={setOrderReportSearch}
                      orderReportPage={orderReportPage}
                      setOrderReportPage={setOrderReportPage}
                      orderReportStatus={orderReportStatus}
                      setOrderReportStatus={setOrderReportStatus}
                      orderReportPaymentStatus={orderReportPaymentStatus}
                      setOrderReportPaymentStatus={setOrderReportPaymentStatus}
                      orderReportStartDate={orderReportStartDate}
                      setOrderReportStartDate={setOrderReportStartDate}
                      orderReportEndDate={orderReportEndDate}
                      setOrderReportEndDate={setOrderReportEndDate}
                      orderReportPageSize={orderReportPageSize}
                      setOrderReportPageSize={setOrderReportPageSize}
                      exportOrderReportCsv={exportOrderReportCsv}
                      exportOrderReportPdf={exportOrderReportPdf}
                      loadOrderReport={loadOrderReport}
                      handleQuickOrderDateFilter={handleQuickOrderDateFilter}
                      categories={categories}
                    />
                  )}

                  {/* TAB 11: CẤU HÌNH WEBSITE */}
                  {activeTab === 'settings' && (
                    <AdminSettingsTab
                      siteSettings={siteSettings}
                      setSiteSettings={setSiteSettings}
                      savingSettings={savingSettings}
                      handleSaveSettings={handleSaveSettings}
                      openLogoCropperWithCurrentUrl={openLogoCropperWithCurrentUrl}
                      handleLogoFileSelect={handleLogoFileSelect}
                      shippingFees={shippingFees}
                      setShowAddShippingFeeModal={setShowAddShippingFeeModal}
                      handleToggleShippingFeeStatus={handleToggleShippingFeeStatus}
                      setEditingShippingFee={setEditingShippingFee}
                      setDeletingShippingFee={setDeletingShippingFee}
                    />
                  )}

                  {/* TAB 12: QUẢN LÝ THÔNG BÁO */}
                  {activeTab === 'notifications' && (
                    <AdminNotificationsTab
                      notifications={notifications}
                      filteredNotifications={filteredNotifications}
                      paginatedNotifications={paginatedNotifications}
                      notificationSearch={notificationSearch}
                      setNotificationSearch={setNotificationSearch}
                      notificationRecipientFilter={notificationRecipientFilter}
                      setNotificationRecipientFilter={setNotificationRecipientFilter}
                      notificationPage={notificationPage}
                      setNotificationPage={setNotificationPage}
                      notificationPageSize={notificationPageSize}
                      setNotificationPageSize={setNotificationPageSize}
                      onOpenCreateNotificationModal={() => setShowCreateNotificationModal(true)}
                      onSelectNotificationDetail={(n) => setSelectedNotificationDetail(n)}
                      onDeleteNotification={(n) => setDeletingNotification(n)}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>


      {/* MODALS MODULARIZED */}
      <ProductModals
        showAddProductModal={showAddProductModal}
        setShowAddProductModal={setShowAddProductModal}
        handleCreateProduct={handleCreateProduct}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
        handleFileUpload={handleFileUpload}
        uploadingImage={uploadingImage}
        editProductModal={editProductModal}
        setEditProductModal={setEditProductModal}
        handleUpdateProductSubmit={handleUpdateProductSubmit}
        handleDeleteExtraImage={handleDeleteExtraImage}
      />

      <CategoryModals
        showAddCategoryModal={showAddCategoryModal}
        setShowAddCategoryModal={setShowAddCategoryModal}
        handleCreateCategory={handleCreateCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        editCategoryModal={editCategoryModal}
        setEditCategoryModal={setEditCategoryModal}
        handleUpdateCategory={handleUpdateCategory}
      />

      <PromotionModals
        showAddPromotionModal={showAddPromotionModal}
        setShowAddPromotionModal={setShowAddPromotionModal}
        handleCreatePromotion={handleCreatePromotion}
        newPromotion={newPromotion}
        setNewPromotion={setNewPromotion}
        editPromotionModal={editPromotionModal}
        setEditPromotionModal={setEditPromotionModal}
        handleUpdatePromotion={handleUpdatePromotion}
        assignProductsModal={assignProductsModal}
        setAssignProductsModal={setAssignProductsModal}
        handleAddProductToPromotion={handleAddProductToPromotion}
        products={products}
        handleRemoveProductFromPromotion={handleRemoveProductFromPromotion}
      />

      <BranchModals
        showAddBranchModal={showAddBranchModal}
        setShowAddBranchModal={setShowAddBranchModal}
        handleCreateBranch={handleCreateBranch}
        newBranch={newBranch}
        setNewBranch={setNewBranch}
        editingBranch={editingBranch}
        setEditingBranch={setEditingBranch}
        handleUpdateBranch={handleUpdateBranch}
        toggleStatusBranch={toggleStatusBranch}
        setToggleStatusBranch={setToggleStatusBranch}
        handleConfirmToggleBranchStatus={handleConfirmToggleBranchStatus}
        deletingBranch={deletingBranch}
        setDeletingBranch={setDeletingBranch}
        handleConfirmDeleteBranch={handleConfirmDeleteBranch}
      />

      <BannerModals
        showAddBannerModal={showAddBannerModal}
        setShowAddBannerModal={setShowAddBannerModal}
        handleCreateBanner={handleCreateBanner}
        newBanner={newBanner}
        setNewBanner={setNewBanner}
        handleFileUpload={handleFileUpload}
        uploadingImage={uploadingImage}
        editingBanner={editingBanner}
        setEditingBanner={setEditingBanner}
        handleUpdateBanner={handleUpdateBanner}
        deletingBanner={deletingBanner}
        setDeletingBanner={setDeletingBanner}
        handleConfirmDeleteBanner={handleConfirmDeleteBanner}
      />

      <UserAdminModals
        showAddAdminModal={showAddAdminModal}
        setShowAddAdminModal={setShowAddAdminModal}
        handleCreateAdmin={handleCreateAdmin}
        newAdmin={newAdmin}
        setNewAdmin={setNewAdmin}
        branches={branches}
        editAdminModal={editAdminModal}
        setEditAdminModal={setEditAdminModal}
        handleUpdateAdminSubmit={handleUpdateAdminSubmit}
        resetPasswordModal={resetPasswordModal}
        setResetPasswordModal={setResetPasswordModal}
        handleResetPasswordSubmit={handleResetPasswordSubmit}
        permissionModal={permissionModal}
        setPermissionModal={setPermissionModal}
        handleSelectAllPermissions={handleSelectAllPermissions}
        handleDeselectAllPermissions={handleDeselectAllPermissions}
        SRS_FUNCTIONAL_MODULES={SRS_FUNCTIONAL_MODULES}
        handleSavePermissionsSubmit={handleSavePermissionsSubmit}
        toggleModulePermissions={toggleModulePermissions}
      />

      <OrderDetailModals
        orderActionModal={orderActionModal}
        setOrderActionModal={setOrderActionModal}
        executeOrderActionModal={executeOrderActionModal}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        loadingOrderDetail={loadingOrderDetail}
        requestConfirm={requestConfirm}
        promptChangeOrderStatus={promptChangeOrderStatus}
        promptPauseOrder={promptPauseOrder}
        promptResumeOrder={promptResumeOrder}
        promptCancelOrder={promptCancelOrder}
      />

      <CustomerDetailModal
        selectedCustomerDetail={selectedCustomerDetail}
        setSelectedCustomerDetail={setSelectedCustomerDetail}
        loadingCustomerDetail={loadingCustomerDetail}
        openLockModal={openLockModal}
        openUnlockModal={openUnlockModal}
      />

      <UserActionModal
        actionModal={actionModal}
        setActionModal={setActionModal}
        executeActionModal={executeActionModal}
      />

      <ShippingFeeModals
        showAddShippingFeeModal={showAddShippingFeeModal}
        setShowAddShippingFeeModal={setShowAddShippingFeeModal}
        handleCreateShippingFee={handleCreateShippingFee}
        newShippingFee={newShippingFee}
        setNewShippingFee={setNewShippingFee}
        editingShippingFee={editingShippingFee}
        setEditingShippingFee={setEditingShippingFee}
        handleUpdateShippingFee={handleUpdateShippingFee}
        deletingShippingFee={deletingShippingFee}
        setDeletingShippingFee={setDeletingShippingFee}
        handleConfirmDeleteShippingFee={handleConfirmDeleteShippingFee}
      />

      <NotificationModals
        showCreateNotificationModal={showCreateNotificationModal}
        setShowCreateNotificationModal={setShowCreateNotificationModal}
        handleCreateNotification={handleCreateNotification}
        newNotification={newNotification}
        setNewNotification={setNewNotification}
        sendingNotification={sendingNotification}
        branches={branches}
        userPickerSearch={userPickerSearch}
        setUserPickerSearch={setUserPickerSearch}
        userPickerRoleFilter={userPickerRoleFilter}
        setUserPickerRoleFilter={setUserPickerRoleFilter}
        filteredPickerUsers={filteredPickerUsers}
        selectedRecipientIds={selectedRecipientIds}
        setSelectedRecipientIds={setSelectedRecipientIds}
        selectedNotificationDetail={selectedNotificationDetail}
        setSelectedNotificationDetail={setSelectedNotificationDetail}
        deletingNotification={deletingNotification}
        setDeletingNotification={setDeletingNotification}
        handleConfirmDeleteNotification={handleConfirmDeleteNotification}
      />

      {/* MODAL CĂN CHỈNH & XEM TRƯỚC LOGO (ĐÃ TÁCH COMPONENT ĐỘC LẬP) */}
      <LogoCropperModal
        isOpen={logoCropperModal.isOpen}
        imageSrc={logoCropperModal.imageSrc}
        siteName={siteSettings?.site_name || ''}
        siteSlogan={siteSettings?.site_slogan || ''}
        initialShape={logoCropperModal.shape}
        onClose={() => setLogoCropperModal(prev => ({ ...prev, isOpen: false }))}
        onSave={async (blob) => {
          const formData = new FormData();
          formData.append('file', blob, `brand-logo-${Date.now()}.png`);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.success && data.url) {
            setSiteSettings(prev => ({ ...prev, logo_url: data.url }));
            showToast('Đã căn chỉnh và cập nhật logo thương hiệu thành công!', 'success');
          } else {
            throw new Error(data.message || 'Lỗi khi tải ảnh lên máy chủ');
          }
        }}
      />

      {/* TOAST NOTIFICATION (Độ tương phản cao, màu nổi bật, tách biệt hoàn toàn khỏi nền trắng) */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-top-4 fade-in duration-300 max-w-md">
          <div
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border transition-all ${toast.type === 'error'
                ? 'bg-rose-600 border-rose-400 text-white shadow-rose-950/40 ring-4 ring-rose-500/20'
                : toast.type === 'warning'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-amber-950/30 ring-4 ring-amber-500/20'
                  : 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-950/40 ring-4 ring-emerald-500/20'
              }`}
          >
            <div className="shrink-0">
              {toast.type === 'error' ? (
                <div className="w-9 h-9 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-xs">
                  <XCircle className="w-5 h-5 stroke-[2.5]" />
                </div>
              ) : toast.type === 'warning' ? (
                <div className="w-9 h-9 rounded-xl bg-slate-950/15 text-slate-950 border border-black/10 flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
              )}
            </div>
            <div className="flex-1 pr-1">
              <span className={`text-xs font-black font-sans leading-relaxed drop-shadow-xs ${toast.type === 'warning' ? 'text-slate-950' : 'text-white'
                }`}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => setToast(null)}
              className={`ml-auto p-1.5 rounded-lg transition cursor-pointer text-xs font-bold ${toast.type === 'warning'
                  ? 'text-slate-800 hover:text-black hover:bg-black/10'
                  : 'text-white/80 hover:text-white hover:bg-white/20'
                }`}
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}