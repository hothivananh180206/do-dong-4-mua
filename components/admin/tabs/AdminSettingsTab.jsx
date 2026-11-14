'use client';

import React from 'react';
import {
  Settings, RefreshCw, CheckCircle2, Leaf, Eye, Upload, Crop,
  Truck, Plus, Lock, Unlock, Edit3, Trash2, ShieldCheck
} from 'lucide-react';

export default function AdminSettingsTab({
  siteSettings,
  setSiteSettings,
  savingSettings,
  handleSaveSettings,
  openLogoCropperWithCurrentUrl,
  handleLogoFileSelect,
  shippingFees,
  setShowAddShippingFeeModal,
  handleToggleShippingFeeStatus,
  setEditingShippingFee,
  setDeletingShippingFee
}) {
  return (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6">
                  {/* Header & Nút lưu */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-emerald-600" />
                        <span>Cấu Hình Website Hệ Thống</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Quản lý nhận diện thương hiệu, thông số vận hành và các văn bản chính sách pháp lý (Chỉ Admin Tổng)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={savingSettings}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-600/20 cursor-pointer transition"
                    >
                      {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>{savingSettings ? 'Đang lưu...' : 'Lưu Cấu Hình Website'}</span>
                    </button>
                  </div>

                  {/* Form 3 Khối Thẻ */}
                  <form onSubmit={handleSaveSettings} noValidate className="space-y-6">
                    {/* Khối 1: Thông tin thương hiệu & Liên hệ */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-sm text-slate-900">Thông Tin Thương Hiệu & Liên Hệ</h3>
                          <p className="text-[11px] text-slate-500">Thông tin xuất hiện ở tiêu đề trang, Header, Footer và hóa đơn</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Tên website / Thương hiệu *</label>
                          <input
                            type="text"
                            required
                            placeholder="Đổ Đống 4 Mùa"
                            value={siteSettings.site_name || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Hotline chăm sóc khách hàng *</label>
                          <input
                            type="text"
                            required
                            placeholder="0901.234.567"
                            value={siteSettings.hotline || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, hotline: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium font-mono focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Email hỗ trợ & liên hệ *</label>
                          <input
                            type="email"
                            required
                            placeholder="hotro@dodong4mua.vn"
                            value={siteSettings.contact_email || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Địa chỉ trụ sở công ty *</label>
                          <input
                            type="text"
                            required
                            placeholder="53 Võ Văn Ngân, TP. Thủ Đức, TP.HCM"
                            value={siteSettings.company_address || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, company_address: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500"
                          />
                        </div>
                      </div>

                      {/* Logo Upload & Preview (Có khung xem trước & căn chỉnh chuẩn Facebook) */}
                      <div className="pt-2">
                        <label className="block font-bold text-slate-700 mb-1.5 text-xs">Logo nhận diện thương hiệu</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                          <div
                            onClick={openLogoCropperWithCurrentUrl}
                            className="group relative w-20 h-20 rounded-full bg-slate-50 border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-brand-500 transition shadow-sm"
                            title="Bấm để mở khung xem trước và căn chỉnh logo"
                          >
                            {siteSettings.logo_url ? (
                              <img src={siteSettings.logo_url} alt="Logo Preview" className="w-full h-full object-cover" />
                            ) : (
                              <Leaf className="w-8 h-8 text-emerald-600" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-5 h-5" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-2 text-xs w-full">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <label className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl border border-emerald-200 transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Tải logo từ máy tính</span>
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                  onChange={handleLogoFileSelect}
                                  className="hidden"
                                />
                              </label>
                              {siteSettings.logo_url && (
                                <button
                                  type="button"
                                  onClick={openLogoCropperWithCurrentUrl}
                                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-300 transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                                  title="Mở khung xem trước & căn chỉnh"
                                >
                                  <Crop className="w-3.5 h-3.5" />
                                  <span>Xem trước & Căn chỉnh</span>
                                </button>
                              )}
                              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP &le; 5MB</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400 shrink-0">Hoặc dán URL:</span>
                              <input
                                type="text"
                                placeholder="/logo.png hoặc https://..."
                                value={siteSettings.logo_url || ''}
                                onChange={(e) => setSiteSettings({ ...siteSettings, logo_url: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-brand-500 font-mono"
                              />
                              {siteSettings.logo_url && (
                                <button
                                  type="button"
                                  onClick={openLogoCropperWithCurrentUrl}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-[11px] shrink-0 transition cursor-pointer"
                                  title="Mở xem trước ảnh từ URL này"
                                >
                                  Xem
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cấu hình Định dạng Ngày tháng (dd/mm/yyyy) */}
                      <div className="pt-2">
                        <label className="block font-bold text-slate-700 mb-1.5 text-xs">Định dạng ngày tháng toàn hệ thống</label>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="font-mono font-bold text-emerald-700 text-xs flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">dd/mm/yyyy</span>
                              <span className="text-slate-500 font-sans font-normal">(Ngày / Tháng / Năm - Tiêu chuẩn Việt Nam)</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">Áp dụng đồng bộ cho tất cả các bảng dữ liệu đơn hàng, lịch sử mua hàng, log kiểm toán và xuất báo cáo</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto shrink-0">
                            Đang áp dụng
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Khối 2: Cài đặt giao vận & Đơn hàng */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-sm text-slate-900">Cấu Hình Giao Vận & Đơn Hàng</h3>
                          <p className="text-[11px] text-slate-500">Thiết lập mức phí vận chuyển mặc định và đối tác giao nhận</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm shadow-teal-600/20">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                              Đối Tác Vận Chuyển Mặc Định
                            </div>
                            <div className="font-heading font-black text-sm text-teal-950 flex items-center gap-2 mt-0.5">
                              <span>GreenSM (GSM Logistics)</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Đang kích hoạt
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-teal-800 sm:text-right">
                          <p className="font-medium text-[11px] text-teal-700">Giao hàng hỏa tốc và tiêu chuẩn qua tài xế GreenSM</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Cước phí tự động áp dụng theo biểu cước bên dưới</p>
                        </div>
                      </div>

                      {/* Bảng Nấc Cước Phí Vận Chuyển Theo Khoảng Cách (FR-044 & BR-023) */}
                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-heading font-black text-xs text-slate-900 flex items-center gap-1.5">
                              <Truck className="w-4 h-4 text-emerald-600" />
                              <span>Biểu Cước Phí Vận Chuyển Theo Khoảng Cách</span>
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Hệ thống tự động tính cước giao GreenSM dựa trên bán kính khoảng cách khi khách hàng đặt hàng
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAddShippingFeeModal(true)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer self-start sm:self-auto"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Thêm Nấc Phí</span>
                          </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                                <th className="py-2.5 px-3">Gói / Nấc cước</th>
                                <th className="py-2.5 px-3">Khoảng cách (km)</th>
                                <th className="py-2.5 px-3">Mức phí giao hàng</th>
                                <th className="py-2.5 px-3">Trạng thái</th>
                                <th className="py-2.5 px-3 text-right">Thao tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {shippingFees.length === 0 ? (
                                <tr>
                                  <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">
                                    Chưa có nấc phí vận chuyển nào. Bấm &quot;Thêm Nấc Phí&quot; để thiết lập.
                                  </td>
                                </tr>
                              ) : (
                                shippingFees.map((sf) => (
                                  <tr key={sf.id} className="hover:bg-slate-50/70 transition">
                                    <td className="py-2.5 px-3 font-bold text-slate-900">
                                      {sf.name}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                        {parseFloat(sf.min_km)} km - {parseFloat(sf.max_km)} km
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 font-bold text-emerald-700">
                                      {parseFloat(sf.fee).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        sf.status === 1 
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                                      }`}>
                                        {sf.status === 1 ? 'Đang áp dụng' : 'Tạm dừng'}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleShippingFeeStatus(sf)}
                                          title={sf.status === 1 ? 'Tạm dừng áp dụng nấc phí này' : 'Kích hoạt lại nấc phí'}
                                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                                            sf.status === 1
                                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                          }`}
                                        >
                                          {sf.status === 1 ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setEditingShippingFee({ ...sf })}
                                          title="Chỉnh sửa nấc cước"
                                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => setDeletingShippingFee(sf)}
                                          title="Xóa nấc cước"
                                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Khối 3: Chính sách & Điều khoản pháp lý */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                          3
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-sm text-slate-900">Chính Sách & Điều Khoản Pháp Lý</h3>
                          
                        </div>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            1. Chính sách đổi trả
                          </label>
                          <textarea
                            rows={3}
                            value={siteSettings.exchange_policy || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, exchange_policy: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500 leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            2. Chính sách giao hàng
                          </label>
                          <textarea
                            rows={3}
                            value={siteSettings.shipping_policy || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, shipping_policy: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500 leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            3. Chính sách bảo mật thông tin khách hàng
                          </label>
                          <textarea
                            rows={3}
                            value={siteSettings.privacy_policy || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, privacy_policy: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500 leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            4. Điều khoản sử dụng dịch vụ
                          </label>
                          <textarea
                            rows={3}
                            value={siteSettings.terms_of_service || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, terms_of_service: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:border-brand-500 leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Chỉ tài khoản Admin Tổng mới có quyền lưu cấu hình. Dữ liệu có hiệu lực tức thì sau khi lưu.</span>
                      </div>
                      <button
                        type="submit"
                        disabled={savingSettings}
                        className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 cursor-pointer transition"
                      >
                        {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{savingSettings ? 'Đang lưu cấu hình...' : 'Lưu Thay Đổi Cấu Hình'}</span>
                      </button>
                    </div>
                  </form>
                </div>
  );
}
