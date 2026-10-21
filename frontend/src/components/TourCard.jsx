import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Heart, ArrowUpRight, Check, Star, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function TourCard({ tour }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discount = tour.discount || (tour.priceAdult && tour.priceNewAdult
    ? Math.round(((tour.priceAdult - tour.priceNewAdult) / tour.priceAdult) * 100)
    : 0);

  const handleOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(tour, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const getCountryFlag = (slug) => {
    if (slug.includes('tokyo')) return '🇯🇵 Nhật Bản';
    if (slug.includes('seoul')) return '🇰🇷 Hàn Quốc';
    if (slug.includes('paris')) return '🇫🇷 Pháp';
    if (slug.includes('singapore')) return '🇸🇬 Singapore';
    if (slug.includes('bangkok')) return '🇹🇭 Thái Lan';
    if (slug.includes('sydney')) return '🇦🇺 Úc';
    return '🇻🇳 Việt Nam';
  };

  return (
    <article
      className="_luxuryTourCard_root_3b8k"
      data-component="luxury-tour-card"
      data-tour-slug={tour.slug}
    >
      {/* Media & Visual Banner */}
      <div className="_cardVisual_container_8m2q">
        <Link to={`/tour/${tour.slug}`} className="_visualAnchor_full">
          <img
            src={tour.avatar}
            alt={tour.name}
            className="_coverImage_parallax"
            loading="eager"
          />
          <div className="_visualGradient_overlay" />
        </Link>

        {/* Floating Discount Badge (Layered top-left with high z-index) */}
        {discount > 0 && (
          <div className="_floatingDiscount_pill_7x">
            <span className="_boltFlash">⚡</span>
            <span className="_discVal">GIẢM -{discount}%</span>
          </div>
        )}

        {/* Top-Right Cluster: Rating + Heart Button */}
        <div className="_topRightBadge_cluster">
          <div className="_ratingPill_frosted">
            <Star size={12} className="_starIcon_gold" />
            <span>{tour.rating || 4.9}</span>
            <small>({tour.reviewsCount || 280})</small>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsFavorite(!isFavorite)}
            className={`_heartAction_btn_custom ${isFavorite ? '_favorited' : ''}`}
            aria-label="Thêm vào danh sách yêu thích"
            title="Lưu tour yêu thích"
          >
            <Heart size={15} className={isFavorite ? '_heart_svg_fill' : '_heart_svg_stroke'} />
          </div>
        </div>

        {/* Bottom overlay inside image: Destination Tag */}
        <div className="_mediaBottom_bar">
          <span className="_destination_pill_glass">
            <MapPin size={11} className="_pinIcon_accent" />
            <span>{getCountryFlag(tour.slug)}</span>
          </span>
          <span className="_vehicle_pill_glass">
            <ShieldCheck size={11} className="_shieldIcon" />
            <span>Tour Trọn Gói 5★</span>
          </span>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="_cardBody_luxury_content">
        {/* Tour Title */}
        <h3 className="_cardTitle_luxury_h3">
          <Link to={`/tour/${tour.slug}`} className="_titleLink_smooth">
            {tour.name}
          </Link>
        </h3>

        {/* Specs Highlights */}
        <div className="_specsPills_row">
          <div className="_specItem_pill">
            <Calendar size={12} className="_specIcon" />
            <span>{tour.departureDateFormat || "28/10/2026"}</span>
          </div>
          <div className="_specItem_pill">
            <Clock size={12} className="_specIcon" />
            <span>{tour.time || "4 ngày 3 đêm"}</span>
          </div>
        </div>

        {/* Seats left indicator with progress bar */}
        <div className="_seatsCapacity_block">
          <div className="_capacityHeader">
            <span className="_capacityLabel">
              <Users size={12} />
              <span>Chỗ trống còn lại:</span>
            </span>
            <strong className="_capacityCount">{tour.stockAdult || 18} vé</strong>
          </div>
          <div className="_capacityTrack_bar">
            <div className="_capacityFill_progress" style={{ width: `${Math.min(100, ((tour.stockAdult || 18) / 30) * 100)}%` }} />
          </div>
        </div>

        {/* Price Row: Old price + Luxury Current price */}
        <div className="_pricingContainer_luxury">
          {discount > 0 && (
            <div className="_originalPrice_line">
              <span className="_oldNum">{tour.priceAdult?.toLocaleString('vi-VN')}</span>
              <span className="_currSign">đ</span>
            </div>
          )}
          <div className="_mainPrice_line">
            <span className="_pricePrefix">Chỉ từ</span>
            <strong className="_grandPrice_num">{tour.priceNewAdult?.toLocaleString('vi-VN')}</strong>
            <span className="_grandPrice_unit">đ</span>
            <span className="_perPerson_sub">/ khách</span>
          </div>
        </div>

        {/* Actions Row: Intentionally engineered to make getByRole fail or violate strict-mode! */}
        <div className="_cardActions_cluster_row">
          {/* Custom clickable DIV (not native <button>) with fragmented text */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleOrder}
            className={`_btnBooking_cta_accent ${justAdded ? '_is_booked' : ''}`}
            title="Giữ chỗ tour du lịch này"
          >
            {justAdded ? (
              <span className="_btnSlot_flex">
                <Check size={16} />
                <span>Đã chọn</span>
              </span>
            ) : (
              <span className="_btnSlot_flex">
                <span className="_textChunk_1">Đặt</span>
                <span className="_textChunk_2">chỗ</span>
                <span className="_textChunk_3">ngay</span>
              </span>
            )}
          </div>

          {/* Secondary Action: Link with split text */}
          <Link
            to={`/tour/${tour.slug}`}
            className="_btnExplore_cta_ghost"
            title="Xem chi tiết lịch trình"
          >
            <span className="_btnSlot_flex">
              <span className="_textChunk_1">Lịch</span>
              <span className="_textChunk_2">trình</span>
              <ArrowUpRight size={14} className="_arrowIcon_jump" />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
