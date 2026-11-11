'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

import ProfileBreadcrumbHeader from '@/components/profile/ProfileBreadcrumbHeader';
import ProfileSidebarCard from '@/components/profile/ProfileSidebarCard';
import ProfileInfoForm from '@/components/profile/ProfileInfoForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import { getAuthSession, saveAuthSession, clearAuthSession } from '@/lib/auth-session';

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile Form States (FR-005)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  // Password Form States (FR-004)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Alert Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const userObj = getAuthSession();
        if (!userObj) {
          setLoading(false);
          return;
        }
        setCurrentUser(userObj);

        // Fetch fresh profile from API
        const res = await fetch(`/api/customer/profile?user_id=${userObj.id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setFullName(data.data.full_name || userObj.full_name || '');
          setPhone(data.data.phone || userObj.phone || '');
          setAddress(data.data.address || userObj.address || '');
          setCreatedAt(data.data.created_at || '');
        } else {
          setFullName(userObj.full_name || '');
          setPhone(userObj.phone || '');
          setAddress(userObj.address || '');
        }
      } catch (err) {
        console.error('Lỗi tải thông tin cá nhân:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Xử lý Cập nhật thông tin cá nhân (FR-005)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Họ và tên không được để trống.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Địa chỉ nhận hàng không được để trống.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          full_name: fullName.trim(),
          address: address.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Cập nhật thông tin cá nhân thành công!');
        const updatedUser = {
          ...currentUser,
          full_name: fullName.trim(),
          address: address.trim(),
        };
        saveAuthSession(updatedUser);
        setCurrentUser(updatedUser);
      } else {
        setErrorMsg(data.message || 'Cập nhật thông tin thất bại');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  // Xử lý Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setErrorMsg('Mật khẩu mới phải chứa ít nhất 1 chữ in hoa, 1 chữ in thường và 1 chữ số.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Hai mật khẩu mới không trùng nhau.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          old_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          clearAuthSession();
          router.push('/dang-nhap');
        }, 2000);
      } else {
        setErrorMsg(data.message || 'Mật khẩu hiện tại không chính xác.');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  // Xử lý Đăng xuất (FR-002)
  const handleLogout = async () => {
    try {
      if (currentUser?.id) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id, phone: currentUser.phone })
        });
      }
    } catch (e) {}
    clearAuthSession();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500 font-medium">Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  // Khi chưa đăng nhập
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto border border-brand-100 shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Bạn chưa đăng nhập</h2>
        <p className="text-xs text-gray-500">Vui lòng đăng nhập để xem và quản lý thông tin cá nhân của bạn.</p>
        <Link
          href="/dang-nhap"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs shadow-md transition"
        >
          <span>Đăng Nhập Ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Breadcrumb Header */}
      <ProfileBreadcrumbHeader onLogout={handleLogout} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: User Profile Badge */}
        <ProfileSidebarCard
          currentUser={currentUser}
          fullName={fullName}
          phone={phone}
          createdAt={createdAt}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setErrorMsg('');
            setSuccessMsg('');
          }}
        />

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Alerts */}
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: FORM CẬP NHẬT THÔNG TIN CÁ NHÂN */}
          {activeTab === 'profile' && (
            <ProfileInfoForm
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              address={address}
              setAddress={setAddress}
              saving={saving}
              onSubmit={handleUpdateProfile}
            />
          )}

          {/* TAB 2: FORM ĐỔI MẬT KHẨU */}
          {activeTab === 'password' && (
            <ChangePasswordForm
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              saving={saving}
              onSubmit={handleChangePassword}
            />
          )}
        </div>
      </div>
    </div>
  );
}
