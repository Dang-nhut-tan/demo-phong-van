import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, LogOut, Compass, Sparkles, MapPin, PhoneCall } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { totalCount } = useCart();
  const { user, isLoggedIn, logout, openAuthModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="_vt_header_main_9x8a">
      {/* Top utility bar */}
      <div className="_topBar_sub_4k2m">
        <div className="_container_inner_wrap">
          <div className="_topBar_left_group">
            <span className="_topBar_item_pill">
              <PhoneCall size={13} className="_icon_inline" />
              <span>Hotline 24/7: </span>
              <strong>1900 8686</strong>
            </span>
            <span className="_topBar_item_pill _hide_mobile">
              <MapPin size={13} className="_icon_inline" />
              <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
            </span>
          </div>
          <div className="_topBar_right_group">
            <Link to="/challenges" className="_challenge_banner_link">
              <Sparkles size={14} className="_sparkle_icon_spin" />
              <span className="_highlight_text">Phòng Thực Hành Locator (Playwright / XPath)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="_mainHeader_nav_wrap">
        <div className="_container_inner_wrap _header_flex_row">
          {/* Brand Logo */}
          <Link to="/" className="_brandLogo_link_8c2p" aria-label="VietTravel Home">
            <div className="_logoMark_circle">
              <Compass size={28} className="_compass_svg" />
            </div>
            <div className="_logoText_wrap">
              <span className="_brandName_primary">Viet<span className="_brandName_accent">Travel</span></span>
              <span className="_brandTagline_tiny">Khám Phá Thế Giới</span>
            </div>
          </Link>

          {/* Search box - Challenging nested locator */}
          <form onSubmit={handleSearch} className="_searchForm_container_7m1k">
            <div className="_searchInput_outer_shell">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm điểm đến: Tokyo, Sapa, Paris, Phú Quốc..."
                className="_inputField_naked_3p8x"
                autoComplete="off"
              />
              <button
                type="submit"
                className="_btnSearch_icon_wrap_6v4n"
                title="Bấm để tìm tour"
              >
                <Search size={18} className="_search_svg_node" />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="_mainNav_links_5r3q">
            <Link to="/" className="_navItem_anchor_9a1z">
              <span>Trang chủ</span>
            </Link>
            <Link to="/category/tour-trong-nuoc" className="_navItem_anchor_9a1z">
              <span>Tour trong nước</span>
            </Link>
            <Link to="/category/tour-nuoc-ngoai" className="_navItem_anchor_9a1z">
              <span>Tour nước ngoài</span>
            </Link>
            <Link to="/careers" className="_navItem_anchor_9a1z">
              <span>Tuyển dụng</span>
            </Link>
            <Link to="/contact" className="_navItem_anchor_9a1z">
              <span>Liên hệ</span>
            </Link>
          </nav>

          {/* Right action group: Cart + User Auth */}
          <div className="_rightActions_group_2b8k">
            {/* Cart Button */}
            <Link to="/cart" className="_cartAction_btn_4m7p" title="Giỏ tour của bạn">
              <div className="_iconSlot_cart">
                <ShoppingBag size={22} className="_bag_svg_node" />
                {totalCount > 0 && (
                  <span className="_cartBadge_counter_3x">{totalCount}</span>
                )}
              </div>
              <span className="_cartText_label _hide_mobile">
                <span>Giỏ</span> <span>tour</span>
              </span>
            </Link>

            {/* Auth Action */}
            {isLoggedIn ? (
              <div className="_userDropdown_wrapper_8d3m">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="_userAvatar_btn_5k9z"
                >
                  <div className="_avatarInitial">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="_userName_label _hide_mobile">{user.fullName || user.email}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="_userPopover_card_9f1a">
                    <div className="_popoverHeader">
                      <strong>{user.fullName || "Khách hàng"}</strong>
                      <small>{user.email}</small>
                    </div>
                    <hr className="_divider_hairline" />
                    <Link to="/cart" onClick={() => setIsUserMenuOpen(false)} className="_popoverItem_link">
                      Đơn tour của tôi
                    </Link>
                    <Link to="/challenges" onClick={() => setIsUserMenuOpen(false)} className="_popoverItem_link">
                      Thực hành Playwright 🎯
                    </Link>
                    <button
                      type="button"
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="_popoverItem_btnDanger"
                    >
                      <LogOut size={15} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="_authTrigger_btn_primary_1k6v"
              >
                <span className="_btnIcon_slot">
                  <User size={17} />
                </span>
                <span className="_btnText_slot">
                  <span>Đăng</span>&nbsp;<span>nhập</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
