import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Navigation, Car, Train, HeartHandshake } from 'lucide-react';
import { submitContact } from '../services/api';

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await submitContact({ email, fullName, phone, content });
    setLoading(false);
    setSubmitted(true);
    setEmail('');
    setFullName('');
    setPhone('');
    setContent('');
  };

  return (
    <div className="_vt_contactPage_view">
      {/* Hero Header */}
      <div className="_contactHero_header">
        <div className="_container_inner_wrap _textCenter">
          <span className="_eyebrow_pill">LIÊN HỆ VỚI CHÚNG TÔI</span>
          <h1 className="_hero_h1">VietTravel Luôn Sẵn Sàng Lắng Nghe Bạn</h1>
          <p className="_hero_lead">
            Mọi thắc mắc về tour du lịch, đặt dịch vụ hoặc đóng góp ý kiến, vui lòng liên hệ với chúng tôi qua thông tin bên dưới hoặc ghé thăm văn phòng.
          </p>
        </div>
      </div>

      <div className="_container_inner_wrap _contactGrid_layout">
        {/* Left Column: Office info & Consultation Form */}
        <div className="_contactLeft_card" data-component="contact-info-card">
          <div className="_cardSection_header">
            <span className="_badge_chip">KÊNH HỖ TRỢ TRỰC TIẾP</span>
            <h2 className="_sectionTitle">Thông Tin Trụ Sở</h2>
          </div>

          <div className="_infoItems_list">
            <div className="_infoItem_row">
              <div className="_infoIcon_box"><MapPin size={20} /></div>
              <div className="_infoDetails">
                <strong>Địa chỉ trụ sở chính</strong>
                <p>123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>

            <div className="_infoItem_row">
              <div className="_infoIcon_box"><Phone size={20} /></div>
              <div className="_infoDetails">
                <strong>Hotline tư vấn 24/7</strong>
                <p>1900 8686 - (028) 3822 8899</p>
              </div>
            </div>

            <div className="_infoItem_row">
              <div className="_infoIcon_box"><Mail size={20} /></div>
              <div className="_infoDetails">
                <strong>Hòm thư điện tử</strong>
                <p>hello@viettravel.vn - info@viettravel.com</p>
              </div>
            </div>

            <div className="_infoItem_row">
              <div className="_infoIcon_box"><Clock size={20} /></div>
              <div className="_infoDetails">
                <strong>Giờ làm việc</strong>
                <p>Thứ Hai - Chủ Nhật: 08:00 - 18:00 (Kể cả ngày lễ)</p>
              </div>
            </div>
          </div>

          <hr className="_contactDivider" />

          {/* Consultation Form */}
          <form onSubmit={handleSubmit} className="_contactForm_nested" data-component="contact-form">
            <h3 className="_formTitle">Để Lại Thông Tin Tư Vấn</h3>

            {submitted && (
              <div className="_alertSuccess_box">
                <CheckCircle2 size={18} />
                <span>Cảm ơn bạn! Yêu cầu tư vấn đã được gửi thành công.</span>
              </div>
            )}

            <div className="_contactFormGroup">
              <label className="_formGroupLabel">
                Địa chỉ email của bạn <span className="_reqStar">*</span>
              </label>
              <div className="_controlInputShell">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="_contactInput_naked"
                  required
                />
              </div>
            </div>

            <div className="_contactFormGroup">
              <label className="_formGroupLabel">Họ và tên của bạn</label>
              <div className="_controlInputShell">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="_contactInput_naked"
                />
              </div>
            </div>

            <div className="_contactFormGroup">
              <label className="_formGroupLabel">Số điện thoại liên hệ</label>
              <div className="_controlInputShell">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  className="_contactInput_naked"
                />
              </div>
            </div>

            <div className="_contactFormGroup">
              <label className="_formGroupLabel">Nội dung cần hỗ trợ hoặc tư vấn tour</label>
              <div className="_controlInputShell">
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tôi muốn tư vấn tour Nhật Bản cho gia đình 4 người..."
                  className="_contactTextarea_naked"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="_btnSubmitContact_primary"
            >
              {loading ? (
                <span>Đang gửi...</span>
              ) : (
                <span className="_btnSlot_row">
                  <Send size={16} />
                  <span>Gửi</span>&nbsp;<span>yêu cầu</span>&nbsp;<span>tư vấn</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Upgraded Elegant Google Map Card */}
        <div className="_contactRight_card" data-component="contact-map-card">
          <div className="_mapCard_header">
            <div className="_mapHeader_left">
              <span className="_badge_chip _chip_blue">VỊ TRÍ VĂN PHÒNG</span>
              <h2 className="_sectionTitle">Trụ Sở Chính VietTravel</h2>
              <p className="_mapAddress_text">
                <MapPin size={15} className="_pinIcon_red" />
                <span>123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=123+Nguy%E1%BB%85n+Hu%E1%BB%87,+Qu%E1%BA%ADn+1,+TP.HCM"
              target="_blank"
              rel="noopener noreferrer"
              className="_btnDirections_link"
              title="Mở Google Maps chỉ đường"
            >
              <Navigation size={15} />
              <span>Chỉ đường</span>
            </a>
          </div>

          {/* Map Frame Container */}
          <div className="_mapWrapper_frame">
            <iframe
              title="VietTravel Headquarters Google Map"
              src="https://maps.google.com/maps?q=123+Nguy%E1%BB%85n+Hu%E1%BB%87,+Qu%E1%BA%ADn+1,+TP.HCM&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="_mapIframe_embed"
            />
            <div className="_mapOverlay_badge">
              <Navigation size={13} className="_badgeIcon_spin" />
              <span>Google Maps tương tác 360°</span>
            </div>
          </div>

          {/* Highlights strip below map */}
          <div className="_mapFeatures_strip">
            <div className="_featurePill_box">
              <Car size={16} className="_featIcon" />
              <span>Bãi đỗ xe ô tô & xe máy</span>
            </div>
            <div className="_featurePill_box">
              <Train size={16} className="_featIcon" />
              <span>Gần tuyến Metro Bến Thành</span>
            </div>
            <div className="_featurePill_box">
              <HeartHandshake size={16} className="_featIcon" />
              <span>Đón tiếp chu đáo tận tâm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
