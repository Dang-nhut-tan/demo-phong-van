import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, Flame, ArrowRight, ShieldCheck, Sparkles, ChevronDown, Award, Globe, Compass, Star, Clock } from 'lucide-react';
import TourCard from '../components/TourCard';
import { fetchTours } from '../services/api';

export default function HomePage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search filter states
  const [activeSearchTab, setActiveSearchTab] = useState('package'); // 'package' | 'cruise' | 'combo'
  const [destination, setDestination] = useState('');
  const [departureCity, setDepartureCity] = useState('TP. Hồ Chí Minh');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState('2026-10-28');
  const [passengers, setPassengers] = useState(2);

  // Live Countdown Timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 45, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cityOptions = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchTours();
      setTours(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleHeroSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = new URLSearchParams();
    if (destination) query.set('search', destination);
    if (departureCity) query.set('from', departureCity);
    navigate(`/category/all?${query.toString()}`);
  };

  const domesticTours = tours.filter(t => t.categorySlug === 'tour-trong-nuoc');
  const internationalTours = tours.filter(t => t.categorySlug === 'tour-nuoc-ngoai');
  const flashSaleTours = tours.filter(t => (t.discount || 0) >= 10);

  return (
    <div className="_vt_homePage_view">
      {/* =========================================================================
          HERO BANNER - $10,000 Luxury Grade with Dark Gradient Mesh
          ========================================================================= */}
      <section className="_heroSection_luxury_canvas">
        <div className="_heroGradient_mesh_ambient" />
        <div className="_container_inner_wrap _heroContent_constrained">
          {/* Eyebrow badge */}
          <div className="_heroEyebrow_capsule">
            <Sparkles size={14} className="_gold_sparkle_anim" />
            <span className="_eyebrow_text">HÀNH TRÌNH ĐẲNG CẤP • DỊCH VỤ 5 SAO VIETTRAVEL</span>
          </div>

          {/* Luxury Display Heading */}
          <h1 className="_heroHeadline_luxury">
            Khám Phá Thế Giới Theo Phong Cách <span className="_headline_gradient_luxury">Thượng Lưu</span>
          </h1>
          <p className="_heroSubtext_refined">
            Hơn 1.000+ hành trình trải nghiệm độc quyền tại Châu Á, Châu Âu và danh thắng Việt Nam, chuẩn bị chu đáo từng khoảnh khắc cho bạn và gia đình.
          </p>

          {/* Multi-Tab Luxury Search Widget */}
          <div className="_searchWidget_luxury_card" data-component="luxury-search-widget">
            {/* Search Category Tabs */}
            <div className="_searchTabs_luxury_bar">
              <button
                type="button"
                onClick={() => setActiveSearchTab('package')}
                className={`_tabSearch_btn ${activeSearchTab === 'package' ? '_active_tab' : ''}`}
              >
                <span>🏖️ Tour trọn gói</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSearchTab('cruise')}
                className={`_tabSearch_btn ${activeSearchTab === 'cruise' ? '_active_tab' : ''}`}
              >
                <span>🚢 Du thuyền 5 sao</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSearchTab('combo')}
                className={`_tabSearch_btn ${activeSearchTab === 'combo' ? '_active_tab' : ''}`}
              >
                <span>✈️ Vé bay + Khách sạn</span>
              </button>
            </div>

            {/* Form Fields Grid */}
            <form onSubmit={handleHeroSearch} className="_searchInputs_luxury_grid">
              {/* Field 1: Departure Combobox (Non-native dropdown!) */}
              <div className="_fieldModule_wrap _mod_departure">
                <div className="_fieldLabel_luxury">
                  <MapPin size={13} className="_labelIcon_accent" />
                  <span>Điểm khởi hành</span>
                </div>
                <div className="_customCombobox_root">
                  <div
                    role="combobox"
                    aria-expanded={isCityDropdownOpen}
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="_triggerBox_luxury"
                  >
                    <span className="_triggerValue_bold">{departureCity}</span>
                    <ChevronDown size={14} className={`_chevron_toggle ${isCityDropdownOpen ? '_open' : ''}`} />
                  </div>
                  {isCityDropdownOpen && (
                    <ul role="listbox" className="_comboboxDropdown_portal">
                      {cityOptions.map((city) => (
                        <li
                          key={city}
                          role="option"
                          aria-selected={departureCity === city}
                          onClick={() => { setDepartureCity(city); setIsCityDropdownOpen(false); }}
                          className={`_comboboxOption_item ${departureCity === city ? '_is_selected' : ''}`}
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Field 2: Destination */}
              <div className="_fieldModule_wrap _mod_destination">
                <div className="_fieldLabel_luxury">
                  <Compass size={13} className="_labelIcon_accent" />
                  <span>Bạn muốn đến đâu?</span>
                </div>
                <div className="_inputShell_luxury">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Tokyo, Paris, Sapa, Phú Quốc..."
                    className="_nakedControl_input"
                  />
                </div>
              </div>

              {/* Field 3: Date */}
              <div className="_fieldModule_wrap _mod_date">
                <div className="_fieldLabel_luxury">
                  <Calendar size={13} className="_labelIcon_accent" />
                  <span>Ngày khởi hành</span>
                </div>
                <div className="_inputShell_luxury">
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="_nakedControl_input"
                  />
                </div>
              </div>

              {/* Field 4: Passengers Stepper (Custom interactive DIVs, not buttons!) */}
              <div className="_fieldModule_wrap _mod_passengers">
                <div className="_fieldLabel_luxury">
                  <Users size={13} className="_labelIcon_accent" />
                  <span>Hành khách</span>
                </div>
                <div className="_stepperCluster_luxury">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="_stepperDiv_action _dec"
                    title="Giảm khách"
                  >
                    -
                  </div>
                  <span className="_stepperCount_display">{passengers} Khách</span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setPassengers(passengers + 1)}
                    className="_stepperDiv_action _inc"
                    title="Tăng khách"
                  >
                    +
                  </div>
                </div>
              </div>

              {/* Field 5: Submit CTA - Custom DIV with fragmented text to trick getByRole! */}
              <div className="_fieldModule_wrap _mod_submit">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleHeroSearch}
                  className="_btnHeroSearch_primary_9x8f"
                  title="Tìm kiếm chuyến đi"
                >
                  <Search size={18} />
                  <span className="_btnSlotText">
                    <span className="_segA">Tìm</span>&nbsp;<span className="_segB">chuyến</span>&nbsp;<span className="_segC">đi</span>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TRENDING DESTINATIONS BENTO GRID - Ultra Luxury Visuals
          ========================================================================= */}
      <section className="_trendingBento_section">
        <div className="_container_inner_wrap">
          <div className="_sectionHeader_luxury_center">
            <span className="_sectionKicker_pill">ĐIỂM ĐẾN XU HƯỚNG 2026</span>
            <h2 className="_sectionHeadline_bold">Những Tọa Độ Đang Được Yêu Thích Nhất</h2>
            <p className="_sectionSub_muted">Khám phá các kỳ quan thiên nhiên và kinh đô văn hóa hàng đầu</p>
          </div>

          <div className="_bentoGrid_container">
            {/* Tile 1: Tokyo Large */}
            <Link to="/tour/tokyo-nui-phu-si" className="_bentoTile_card _tile_large">
              <img
                src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80"
                alt="Tokyo"
                className="_bentoCover_img"
              />
              <div className="_bentoGradient_overlay" />
              <div className="_bentoContent_meta">
                <span className="_bentoTag">🇯🇵 Nhật Bản</span>
                <h3>Tokyo & Núi Phú Sĩ</h3>
                <p>Khám phá mùa hoa anh đào rực rỡ và suối nước nóng Onsen</p>
                <div className="_bentoBottomRow">
                  <span className="_bentoPrice">Chỉ từ 26.010.000đ</span>
                  <span className="_bentoLinkPill">Xem 8 tour →</span>
                </div>
              </div>
            </Link>

            {/* Tile 2: Paris Wide */}
            <Link to="/tour/paris-kinh-do-anh-sang" className="_bentoTile_card _tile_wide">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
                alt="Paris"
                className="_bentoCover_img"
              />
              <div className="_bentoGradient_overlay" />
              <div className="_bentoContent_meta">
                <span className="_bentoTag">🇫🇷 Pháp</span>
                <h3>Paris - Kinh Đô Ánh Sáng</h3>
                <p>Du thuyền trên sông Seine & bảo tàng Louvre</p>
                <div className="_bentoBottomRow">
                  <span className="_bentoPrice">Chỉ từ 53.910.000đ</span>
                  <span className="_bentoLinkPill">Xem 5 tour →</span>
                </div>
              </div>
            </Link>

            {/* Tile 3: Sapa */}
            <Link to="/tour/sapa-mua-may" className="_bentoTile_card">
              <img
                src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80"
                alt="Sapa"
                className="_bentoCover_img"
              />
              <div className="_bentoGradient_overlay" />
              <div className="_bentoContent_meta">
                <span className="_bentoTag">🇻🇳 Miền Bắc</span>
                <h3>Sapa Mùa Mây & Fansipan</h3>
                <div className="_bentoBottomRow">
                  <span className="_bentoPrice">6.600.000đ</span>
                </div>
              </div>
            </Link>

            {/* Tile 4: Phú Quốc */}
            <Link to="/tour/kham-pha-phu-quoc" className="_bentoTile_card">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                alt="Phú Quốc"
                className="_bentoCover_img"
              />
              <div className="_bentoGradient_overlay" />
              <div className="_bentoContent_meta">
                <span className="_bentoTag">🇻🇳 Đảo Ngọc</span>
                <h3>Phú Quốc Hoàng Hôn</h3>
                <div className="_bentoBottomRow">
                  <span className="_bentoPrice">4.500.000đ</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FLASH SALE WITH LIVE COUNTDOWN TIMER
          ========================================================================= */}
      <section className="_flashSale_luxury_section">
        <div className="_container_inner_wrap">
          <div className="_flashSale_banner_box">
            <div className="_flashSale_header_row">
              <div className="_flashHeader_left">
                <div className="_flashBadge_pulse">
                  <Flame size={16} className="_flame_svg" />
                  <span>GIỜ VÀNG GIÁ SỐC</span>
                </div>
                <h2>Deal Khởi Hành Tuần Này - Giảm Đến 40%</h2>
              </div>

              {/* Countdown Clock */}
              <div className="_countdownClock_cluster">
                <span className="_clockLabel">Kết thúc trong:</span>
                <div className="_clockBoxes_row">
                  <div className="_timeBox"><strong>{String(timeLeft.days).padStart(2, '0')}</strong><small>Ngày</small></div>
                  <span className="_colon">:</span>
                  <div className="_timeBox"><strong>{String(timeLeft.hours).padStart(2, '0')}</strong><small>Giờ</small></div>
                  <span className="_colon">:</span>
                  <div className="_timeBox"><strong>{String(timeLeft.minutes).padStart(2, '0')}</strong><small>Phút</small></div>
                  <span className="_colon">:</span>
                  <div className="_timeBox"><strong>{String(timeLeft.seconds).padStart(2, '0')}</strong><small>Giây</small></div>
                </div>
              </div>
            </div>

            {/* Flash Sale Grid */}
            <div className="_toursGrid_responsive_4col">
              {flashSaleTours.slice(0, 4).map(tour => (
                <TourCard key={tour._id || tour.id} tour={tour} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DOMESTIC TOURS - VIETNAM HERITAGE
          ========================================================================= */}
      <section className="_sectionStandard_block">
        <div className="_container_inner_wrap">
          <div className="_sectionTitle_row_luxury">
            <div className="_titleGroup_left">
              <span className="_subKicker_luxury">VIỆT NAM TƯƠI ĐẸP</span>
              <h2 className="_mainH2_luxury">Tour Du Lịch Trong Nước Hàng Đầu</h2>
              <p className="_leadText_luxury">Trọn gói nghỉ dưỡng, xe Limousine cao cấp và khách sạn 4-5 sao</p>
            </div>
            <Link to="/category/tour-trong-nuoc" className="_btnSeeAll_luxury_link">
              <span>Xem tất cả tour trong nước ({domesticTours.length || 8})</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="_toursGrid_responsive_4col">
            {(domesticTours.length > 0 ? domesticTours : tours).slice(0, 4).map(tour => (
              <TourCard key={tour._id || tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERNATIONAL TOURS - OUTBOUND
          ========================================================================= */}
      <section className="_sectionStandard_block _bg_subtle">
        <div className="_container_inner_wrap">
          <div className="_sectionTitle_row_luxury">
            <div className="_titleGroup_left">
              <span className="_subKicker_luxury">VƯƠN TẦM THẾ GIỚI</span>
              <h2 className="_mainH2_luxury">Tour Du Lịch Quốc Tế Đẳng Cấp</h2>
              <p className="_leadText_luxury">Trải nghiệm những nền văn minh lâu đời tại Nhật Bản, Hàn Quốc, Pháp và Úc</p>
            </div>
            <Link to="/category/tour-nuoc-ngoai" className="_btnSeeAll_luxury_link">
              <span>Xem tất cả tour nước ngoài ({internationalTours.length || 6})</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="_toursGrid_responsive_4col">
            {(internationalTours.length > 0 ? internationalTours : tours).slice(0, 4).map(tour => (
              <TourCard key={tour._id || tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          VIETTRAVEL LUXURY PROMISES - 5 STAR GUARANTEES
          ========================================================================= */}
      <section className="_luxuryGuarantees_section">
        <div className="_container_inner_wrap">
          <div className="_guaranteesGrid_4col">
            <div className="_guaranteeCard_item">
              <div className="_guaranteeIcon_circle">
                <ShieldCheck size={28} />
              </div>
              <h4>Bảo Hiểm Tối Đa 1 Tỷ</h4>
              <p>Cam kết an toàn tuyệt đối cho mọi hành trình cả trong nước và quốc tế.</p>
            </div>

            <div className="_guaranteeCard_item">
              <div className="_guaranteeIcon_circle">
                <Award size={28} />
              </div>
              <h4>Khách Sạn 4 - 5 Sao</h4>
              <p>Chỉ hợp tác với các chuỗi khách sạn và resort sang trọng, tiện nghi bậc nhất.</p>
            </div>

            <div className="_guaranteeCard_item">
              <div className="_guaranteeIcon_circle">
                <Globe size={28} />
              </div>
              <h4>Hướng Dẫn Viên Bản Địa</h4>
              <p>Đội ngũ chuyên nghiệp, am tường văn hóa lịch sử và tận tâm chăm sóc.</p>
            </div>

            <div className="_guaranteeCard_item">
              <div className="_guaranteeIcon_circle">
                <Clock size={28} />
              </div>
              <h4>Hỗ Trợ Khẩn Cấp 24/7</h4>
              <p>Tổng đài viên và điều hành tour sẵn sàng giải quyết phát sinh mọi lúc, mọi nơi.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
