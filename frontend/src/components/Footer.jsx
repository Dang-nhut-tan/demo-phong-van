import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="_vt_footer_master_8b4k">
      {/* Trust badges strip */}
      <div className="_trustStrip_banner_1a7x">
        <div className="_container_inner_wrap _trustGrid_4col">
          <div className="_trustItem_card">
            <Award className="_trustIcon_accent" size={32} />
            <div>
              <h4>Thương Hiệu Hàng Đầu</h4>
              <p>Top 10 đơn vị lữ hành uy tín Việt Nam</p>
            </div>
          </div>
          <div className="_trustItem_card">
            <ShieldCheck className="_trustIcon_accent" size={32} />
            <div>
              <h4>Bảo Hiểm Toàn Diện</h4>
              <p>Gói bảo hiểm du lịch lên đến 1 tỷ đồng</p>
            </div>
          </div>
          <div className="_trustItem_card">
            <HeartHandshake className="_trustIcon_accent" size={32} />
            <div>
              <h4>Hỗ Trợ 24/7</h4>
              <p>Đội ngũ chuyên viên luôn sẵn sàng đồng hành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="_footerContent_main_wrap">
        <div className="_container_inner_wrap _footerGrid_columns">
          {/* Col 1: About */}
          <div className="_footerCol_block _col_about">
            <div className="_footerBrand_row">
              <Compass size={28} className="_footer_compass_svg" />
              <span className="_footerBrand_title">VietTravel</span>
            </div>
            <p className="_footerDesc_text">
              VietTravel tự hào mang đến cho quý khách những chuyến hành trình trải nghiệm tuyệt vời, chuẩn 5 sao với giá ưu đãi nhất thị trường.
            </p>
            <div className="_contactInfo_list">
              <div className="_contactInfo_item">
                <MapPin size={16} className="_item_icon" />
                <span>123 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM</span>
              </div>
              <div className="_contactInfo_item">
                <Phone size={16} className="_item_icon" />
                <span>Tổng đài: <strong>1900 8686</strong></span>
              </div>
              <div className="_contactInfo_item">
                <Mail size={16} className="_item_icon" />
                <span>Email: hello@viettravel.vn</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="_footerCol_block">
            <h4 className="_footerHeading_title">Khám Phá Tour</h4>
            <ul className="_footerLinks_unordered">
              <li><Link to="/category/tour-trong-nuoc">Tour Miền Bắc - Sapa, Hạ Long</Link></li>
              <li><Link to="/category/tour-trong-nuoc">Tour Miền Trung - Đà Nẵng, Huế</Link></li>
              <li><Link to="/category/tour-trong-nuoc">Tour Đảo Ngọc Phú Quốc</Link></li>
              <li><Link to="/category/tour-nuoc-ngoai">Tour Đông Nam Á - Thái Lan, Sing</Link></li>
              <li><Link to="/category/tour-nuoc-ngoai">Tour Đông Bắc Á - Nhật, Hàn</Link></li>
              <li><Link to="/category/tour-nuoc-ngoai">Tour Châu Âu Cổ Kính</Link></li>
            </ul>
          </div>

          {/* Col 3: Automation testing tools */}
          <div className="_footerCol_block">
            <h4 className="_footerHeading_title">Automation Testing</h4>
            <ul className="_footerLinks_unordered">
              <li><Link to="/challenges">🎯 15 Thử Thách Locator Playwright</Link></li>
              <li><Link to="/cart">Bảng dữ liệu giỏ hàng (Relative XPath)</Link></li>
              <li><Link to="/contact">Form liên hệ (Sibling & Ancestor)</Link></li>
              <li><Link to="/careers">Tuyển dụng (Modal & File Upload)</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="_footerCol_block _col_newsletter">
            <h4 className="_footerHeading_title">Đăng Ký Nhận Khuyến Mãi</h4>
            <p className="_newsletter_caption">
              Nhận ngay mã giảm giá <strong>500.000đ</strong> cho chuyến đi đầu tiên của bạn.
            </p>
            <form onSubmit={handleSubscribe} className="_newsletterForm_box">
              <div className="_newsletterInput_shell">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="_newsletter_input_field"
                  required
                />
                <button type="submit" className="_newsletter_submit_button" title="Gửi email">
                  <Send size={16} />
                </button>
              </div>
            </form>
            {subscribed && (
              <div className="_newsletter_success_alert">
                <CheckCircle2 size={16} />
                <span>Cảm ơn bạn đã đăng ký nhận tin!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copyright bottom bar */}
      <div className="_footerBottom_bar">
        <div className="_container_inner_wrap _bottomFlex_row">
          <p className="_copyright_text">© 2026 VietTravel. Bản quyền thuộc về VietTravel Corporation.</p>
          <div className="_bottomLegal_links">
            <Link to="/contact">Điều khoản sử dụng</Link>
            <Link to="/contact">Chính sách bảo mật</Link>
            <Link to="/challenges">Playwright Testing Lab</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
