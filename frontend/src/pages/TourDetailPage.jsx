import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Truck, Shield, Users, ShoppingBag, CheckCircle, ChevronRight, Star } from 'lucide-react';
import { fetchTourBySlug } from '../services/api';
import { useCart } from '../context/CartContext';

export default function TourDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [tour, setTour] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'schedule' | 'policy' | 'reviews'

  // Booking widget passenger states
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [babyCount, setBabyCount] = useState(0);
  const [departureLocation, setDepartureLocation] = useState('TP. Hồ Chí Minh');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function loadTour() {
      const data = await fetchTourBySlug(slug);
      setTour(data);
    }
    loadTour();
  }, [slug]);

  if (!tour) {
    return (
      <div className="_loadingTourDetail_center">
        <div className="_spinnerCircle" />
        <p>Đang tải chi tiết tour du lịch...</p>
      </div>
    );
  }

  const images = tour.images && tour.images.length > 0 ? tour.images : [tour.avatar];
  const priceAdult = tour.priceNewAdult || tour.priceAdult || 0;
  const priceChild = tour.priceNewChildren || Math.round(priceAdult * 0.7);
  const priceBaby = tour.priceNewBaby || Math.round(priceAdult * 0.15);

  const totalPrice = (adultCount * priceAdult) + (childCount * priceChild) + (babyCount * priceBaby);

  const handleAddToCart = () => {
    addToCart(tour, adultCount + childCount + babyCount);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBookNow = () => {
    addToCart(tour, adultCount + childCount + babyCount);
    navigate('/cart');
  };

  return (
    <div className="_vt_tourDetailPage_view">
      {/* Toast Notification */}
      {addedToast && (
        <div className="_floatingToast_alert">
          <CheckCircle size={18} className="_toastIcon" />
          <span>Đã thêm tour vào giỏ hàng thành công!</span>
          <Link to="/cart" className="_toastLink">Xem giỏ hàng</Link>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="_detailBreadcrumb_wrap">
        <div className="_container_inner_wrap">
          <nav className="_breadcrumb_nav_trail">
            <Link to="/" className="_bc_link">Trang chủ</Link>
            <span className="_bc_sep">/</span>
            <Link to={`/category/${tour.categorySlug || 'tour-trong-nuoc'}`} className="_bc_link">
              {tour.categoryName || "Danh mục tour"}
            </Link>
            <span className="_bc_sep">/</span>
            <span className="_bc_current">{tour.name}</span>
          </nav>
        </div>
      </div>

      <div className="_container_inner_wrap _detailGrid_container">
        {/* Left Column: Gallery, Overview, Tabs */}
        <div className="_detailLeft_col">
          {/* Header Title & Rating */}
          <div className="_detailHeader_block">
            <span className="_detailCode_pill">Mã tour: {tour.code || "VT-TOUR-01"}</span>
            <h1 className="_detailTitle_h1">{tour.name}</h1>
            <div className="_detailRating_row">
              <div className="_starsGroup">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={15} className="_starFilled" />
                ))}
              </div>
              <span className="_ratingScore">4.9 / 5</span>
              <span className="_reviewCount">({tour.reviewsCount || 500} đánh giá)</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="_galleryModule_box">
            <div className="_galleryMain_view">
              <img
                src={images[selectedImageIndex] || tour.avatar}
                alt={tour.name}
                className="_mainCover_image"
              />
            </div>
            {images.length > 1 && (
              <div className="_galleryThumbs_strip">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`_thumbBtn_item ${selectedImageIndex === idx ? '_thumb_active' : ''}`}
                    title={`Xem ảnh ${idx + 1}`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specs Strip */}
          <div className="_quickSpecs_strip_bar">
            <div className="_specPill_item">
              <Clock size={16} className="_pillIcon" />
              <div>
                <small>Thời gian:</small>
                <strong>{tour.time || "3 ngày 2 đêm"}</strong>
              </div>
            </div>
            <div className="_specPill_item">
              <Calendar size={16} className="_pillIcon" />
              <div>
                <small>Khởi hành:</small>
                <strong>{tour.departureDateFormat || "19/10/2026"}</strong>
              </div>
            </div>
            <div className="_specPill_item">
              <Truck size={16} className="_pillIcon" />
              <div>
                <small>Phương tiện:</small>
                <strong>{tour.vehicle || "Xe du lịch đời mới"}</strong>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="_tabsNav_bar_row">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`_tabItem_button ${activeTab === 'overview' ? '_tab_selected' : ''}`}
            >
              <span>Thông Tin Tour</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`_tabItem_button ${activeTab === 'schedule' ? '_tab_selected' : ''}`}
            >
              <span>Lịch Trình Chi Tiết</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('policy')}
              className={`_tabItem_button ${activeTab === 'policy' ? '_tab_selected' : ''}`}
            >
              <span>Chính Sách & Điều Khoản</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`_tabItem_button ${activeTab === 'reviews' ? '_tab_selected' : ''}`}
            >
              <span>Đánh Giá ({tour.reviewsCount || 500})</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="_tabContent_panel">
            {activeTab === 'overview' && (
              <div className="_overviewSection_body">
                <h3>Điểm Nhấn Hành Trình</h3>
                <p className="_overviewLead">{tour.information}</p>
                <div className="_highlightsGrid_2col">
                  <div className="_hlCard">
                    <CheckCircle size={18} className="_hlCheck" />
                    <span>Nghỉ dưỡng khách sạn tiêu chuẩn 4-5 sao trung tâm</span>
                  </div>
                  <div className="_hlCard">
                    <CheckCircle size={18} className="_hlCheck" />
                    <span>Thưởng thức ẩm thực địa phương đặc sắc trọn gói</span>
                  </div>
                  <div className="_hlCard">
                    <CheckCircle size={18} className="_hlCheck" />
                    <span>Bao gồm toàn bộ vé tham quan các danh lam thắng cảnh</span>
                  </div>
                  <div className="_hlCard">
                    <CheckCircle size={18} className="_hlCheck" />
                    <span>Bảo hiểm du lịch mức bồi thường tối đa 1.000.000.000đ</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="_scheduleTimeline_list">
                <h3>Lịch Trình Từng Ngày</h3>
                {(tour.schedules && tour.schedules.length > 0 ? tour.schedules : [
                  { title: "Ngày 1: Khởi hành - Tham quan điểm đến", description: "Xe và hướng dẫn viên đón quý khách tại điểm hẹn, bắt đầu hành trình khám phá." },
                  { title: "Ngày 2: Trải nghiệm văn hóa & Ẩm thực", description: "Tham quan các di tích lịch sử nổi tiếng và thưởng thức các món ăn truyền thống." },
                  { title: "Ngày 3: Mua sắm đặc sản - Trở về", description: "Tự do mua sắm quà lưu niệm và đáp chuyến xe/chuyến bay trở về." }
                ]).map((sch, i) => (
                  <div key={i} className="_scheduleItem_card">
                    <div className="_timelineDot">{i + 1}</div>
                    <div className="_scheduleContent">
                      <h4>{sch.title}</h4>
                      <p>{sch.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'policy' && (
              <div className="_policySection_body">
                <h3>Chính Sách Hoàn Hủy & Lưu Ý</h3>
                <ul>
                  <li>Hủy trước 15 ngày khởi hành: Miễn phí hoàn hủy 100% chi phí.</li>
                  <li>Hủy từ 7 đến 14 ngày: Phí phạt 30% giá trị tour.</li>
                  <li>Hủy trong vòng 3 ngày: Phí phạt 100% giá trị tour.</li>
                  <li>Trẻ em dưới 2 tuổi miễn phí vé máy bay/chỗ ngồi chung với bố mẹ.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="_reviewsSection_body">
                <h3>Nhận Xét Của Du Khách</h3>
                <div className="_reviewItem_row">
                  <div className="_reviewerAvatar">HM</div>
                  <div className="_reviewerContent">
                    <div className="_reviewerHeader">
                      <strong>Hoàng Minh (Hà Nội)</strong>
                      <span>2 ngày trước</span>
                    </div>
                    <div className="_starsRow">★★★★★</div>
                    <p>Tour rất chu đáo, đồ ăn ngon, hướng dẫn viên nhiệt tình vui tính!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget (Intentionally challenging locators) */}
        <aside className="_detailRight_col">
          <div className="_stickyBooking_card" data-component="sticky-booking-widget">
            <h3 className="_bookingWidget_title">Chuyến Đi Của Bạn</h3>

            {/* Tour mini thumbnail & title */}
            <div className="_miniTour_preview_row">
              <img src={tour.avatar} alt={tour.name} className="_miniAvatar" />
              <div className="_miniMeta">
                <h4>{tour.name}</h4>
                <span className="_miniCode">Mã: {tour.code || "VT-001"}</span>
              </div>
            </div>

            <hr className="_bookingDivider" />

            {/* Departure City Selector */}
            <div className="_widgetFormGroup">
              <label className="_widgetLabel">Khởi hành tại:</label>
              <select
                value={departureLocation}
                onChange={(e) => setDepartureLocation(e.target.value)}
                className="_widgetSelect_control"
              >
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (Tân Sơn Nhất)</option>
                <option value="Hà Nội">Hà Nội (Nội Bài)</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>

            {/* Passenger Count Table - CLASSIC RELATIVE LOCATOR CHALLENGE */}
            <div className="_passengerCounters_table" data-component="passenger-table">
              <label className="_widgetLabel">Số Lượng Hành Khách:</label>

              {/* Row 1: Người lớn */}
              <div className="_passengerRow_item" data-passenger-type="adult">
                <div className="_passengerType_info">
                  <span className="_typeName">Người lớn:</span>
                  <small className="_typePrice">{priceAdult.toLocaleString('vi-VN')}đ</small>
                </div>
                <div className="_stepperCluster">
                  <button
                    type="button"
                    onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                    className="_btnStepper _btnDec"
                  >
                    -
                  </button>
                  <span className="_stepperVal">{adultCount}</span>
                  <button
                    type="button"
                    onClick={() => setAdultCount(adultCount + 1)}
                    className="_btnStepper _btnInc"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Row 2: Trẻ em */}
              <div className="_passengerRow_item" data-passenger-type="child">
                <div className="_passengerType_info">
                  <span className="_typeName">Trẻ em (5-11 tuổi):</span>
                  <small className="_typePrice">{priceChild.toLocaleString('vi-VN')}đ</small>
                </div>
                <div className="_stepperCluster">
                  <button
                    type="button"
                    onClick={() => setChildCount(Math.max(0, childCount - 1))}
                    className="_btnStepper _btnDec"
                  >
                    -
                  </button>
                  <span className="_stepperVal">{childCount}</span>
                  <button
                    type="button"
                    onClick={() => setChildCount(childCount + 1)}
                    className="_btnStepper _btnInc"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Row 3: Em bé */}
              <div className="_passengerRow_item" data-passenger-type="baby">
                <div className="_passengerType_info">
                  <span className="_typeName">Em bé (&lt; 2 tuổi):</span>
                  <small className="_typePrice">{priceBaby.toLocaleString('vi-VN')}đ</small>
                </div>
                <div className="_stepperCluster">
                  <button
                    type="button"
                    onClick={() => setBabyCount(Math.max(0, babyCount - 1))}
                    className="_btnStepper _btnDec"
                  >
                    -
                  </button>
                  <span className="_stepperVal">{babyCount}</span>
                  <button
                    type="button"
                    onClick={() => setBabyCount(babyCount + 1)}
                    className="_btnStepper _btnInc"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total Price Sum */}
            <div className="_widgetTotal_row">
              <span className="_totalLabel">Tổng cộng:</span>
              <div className="_totalPrice_val">
                <strong className="_sumAmount">{totalPrice.toLocaleString('vi-VN')}</strong>
                <span className="_sumUnit">đ</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="_widgetActions_stack">
              <button
                type="button"
                onClick={handleAddToCart}
                className="_btnWidget_addToCart"
              >
                <ShoppingBag size={18} />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>
              <button
                type="button"
                onClick={handleBookNow}
                className="_btnWidget_bookNow"
              >
                <span>Đặt Tour Ngay</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
