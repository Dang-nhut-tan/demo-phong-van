import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Mail, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, authError, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      await login(email, password);
    } else {
      // Mock register
      setRegisterSuccess(true);
      setTimeout(() => {
        setRegisterSuccess(false);
        setActiveTab('login');
      }, 1500);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@viettravel.vn');
      setPassword('Admin@123');
    } else {
      setEmail('user@viettravel.vn');
      setPassword('Test@123');
    }
  };

  return (
    <div className="_modalBackdrop_overlay_8m4q" onClick={closeAuthModal}>
      <div
        className="_modalDialog_window_3k9f"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button with aria-label */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="_modalClose_btn_8z"
          aria-label="Đóng cửa sổ"
          title="Đóng modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header Tabs */}
        <div className="_modalHeader_tabs_row">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`_tabHeader_btn ${activeTab === 'login' ? '_is_selected' : ''}`}
          >
            <span>Đăng nhập tài khoản</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`_tabHeader_btn ${activeTab === 'register' ? '_is_selected' : ''}`}
          >
            <span>Đăng ký thành viên</span>
          </button>
        </div>

        {/* Demo Quick Fill for testers! */}
        <div className="_demoHint_banner_box">
          <span className="_hint_title">Tài khoản thử nghiệm:</span>
          <div className="_demoButton_row">
            <button
              type="button"
              onClick={() => handleFillDemo('user')}
              className="_btnDemo_pill"
            >
              Khách hàng (user@viettravel.vn)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="_btnDemo_pill _admin_pill"
            >
              Admin (admin@viettravel.vn)
            </button>
          </div>
        </div>

        {authError && (
          <div className="_errorMessage_alert_banner">
            <span>{authError}</span>
          </div>
        )}

        {registerSuccess && (
          <div className="_successMessage_alert_banner">
            <CheckCircle size={16} />
            <span>Đăng ký thành công! Đang chuyển sang màn hình đăng nhập...</span>
          </div>
        )}

        {/* Form Body - Intentionally structured without simple IDs */}
        <form onSubmit={handleSubmit} className="_authForm_body_container">
          {activeTab === 'register' && (
            <div className="_formField_row_7v1a">
              <label className="_formLabel_text">
                Họ và tên của bạn <span className="_reqAsterisk">*</span>
              </label>
              <div className="_inputContainer_nested_2p">
                <span className="_inputIcon_slot"><User size={16} /></span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="_inputControl_naked"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="_formField_row_7v1a">
            <label className="_formLabel_text">
              Địa chỉ email đăng nhập <span className="_reqAsterisk">*</span>
            </label>
            <div className="_inputContainer_nested_2p">
              <span className="_inputIcon_slot"><Mail size={16} /></span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="_inputControl_naked"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="_formField_row_7v1a">
            <div className="_labelAndForgot_row">
              <label className="_formLabel_text">
                Mật khẩu truy cập <span className="_reqAsterisk">*</span>
              </label>
              {activeTab === 'login' && (
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Vui lòng liên hệ hotline 1900 8686 để reset mật khẩu."); }} className="_forgotPass_anchor">
                  Quên mật khẩu?
                </a>
              )}
            </div>
            <div className="_inputContainer_nested_2p">
              <span className="_inputIcon_slot"><Lock size={16} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="_inputControl_naked"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="_btnTogglePassword_iconOnly"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Custom Checkbox - Remember login */}
          {activeTab === 'login' && (
            <div className="_rememberMe_row">
              <label className="_checkboxWrap_3a">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="_hiddenCheck_1z"
                />
                <span className="_customBox_8x"></span>
                <span className="_checkLabel_4q">Ghi nhớ đăng nhập trên thiết bị này</span>
              </label>
            </div>
          )}

          {/* Submit Button with fragmented text */}
          <div className="_submitWrapper_btn_cluster">
            <button
              type="submit"
              disabled={loading}
              className="_btnSubmit_auth_9x"
            >
              {loading ? (
                <span>Đang xử lý...</span>
              ) : activeTab === 'login' ? (
                <span className="_slotWrap_flex">
                  <span className="_textSeg_1">Đăng</span>&nbsp;
                  <span className="_textSeg_2">nhập</span>&nbsp;
                  <span className="_textSeg_3">ngay</span>
                </span>
              ) : (
                <span className="_slotWrap_flex">
                  <span className="_textSeg_1">Hoàn</span>&nbsp;
                  <span className="_textSeg_2">tất</span>&nbsp;
                  <span className="_textSeg_3">đăng ký</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
