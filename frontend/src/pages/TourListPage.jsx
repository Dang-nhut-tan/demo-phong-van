import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, RotateCcw, AlertCircle } from 'lucide-react';
import TourCard from '../components/TourCard';
import { fetchTours } from '../services/api';

export default function TourListPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || 'all');
  const [priceRange, setPriceRange] = useState('all'); // 'all' | 'under5' | '5to10' | '10to20' | 'above20'
  const [sortOption, setSortOption] = useState('default');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    if (categorySlug) setSelectedCategory(categorySlug);
  }, [categorySlug]);

  useEffect(() => {
    async function loadTours() {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (sortOption !== 'default') params.sort = sortOption;

      if (priceRange === 'under5') {
        params.maxPrice = 5000000;
      } else if (priceRange === '5to10') {
        params.minPrice = 5000000;
        params.maxPrice = 10000000;
      } else if (priceRange === '10to20') {
        params.minPrice = 10000000;
        params.maxPrice = 20000000;
      } else if (priceRange === 'above20') {
        params.minPrice = 20000000;
      }

      const data = await fetchTours(params);
      setTours(data);
      setLoading(false);
    }
    loadTours();
  }, [selectedCategory, searchQuery, priceRange, sortOption]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortOption('default');
    setSearchParams({});
  };

  const getPageTitle = () => {
    if (searchQuery) return `Kết quả tìm kiếm cho: "${searchQuery}"`;
    if (selectedCategory === 'tour-trong-nuoc') return 'Tour Du Lịch Trong Nước';
    if (selectedCategory === 'tour-nuoc-ngoai') return 'Tour Du Lịch Nước Ngoài';
    return 'Tất Cả Các Gói Tour Du Lịch';
  };

  const sortLabels = {
    'default': 'Mặc định (Nổi bật nhất)',
    'price-asc': 'Giá: Từ thấp đến cao',
    'price-desc': 'Giá: Từ cao đến thấp',
    'discount-desc': 'Ưu đãi giảm giá nhiều nhất'
  };

  return (
    <div className="_vt_tourListPage_view">
      {/* Category Hero / Breadcrumb */}
      <div className="_categoryHero_banner">
        <div className="_container_inner_wrap">
          <nav className="_breadcrumb_nav_trail">
            <Link to="/" className="_bc_link">Trang chủ</Link>
            <span className="_bc_sep">/</span>
            <span className="_bc_current">{getPageTitle()}</span>
          </nav>
          <h1 className="_categoryHero_h1">{getPageTitle()}</h1>
          <p className="_categoryHero_lead">
            Lựa chọn tour lý tưởng với dịch vụ chuẩn quốc tế, bảo hiểm toàn diện và hướng dẫn viên chuyên nghiệp.
          </p>
        </div>
      </div>

      <div className="_container_inner_wrap _listLayout_container">
        {/* Left Filter Sidebar */}
        <aside className="_filterSidebar_col" data-component="filter-sidebar">
          <div className="_filterSidebar_card">
            <div className="_sidebarHeading_flex">
              <div className="_headingLeft">
                <Filter size={18} className="_filter_icon" />
                <h3 className="_sidebar_h3">Bộ Lọc Tour</h3>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="_btnReset_filters_link"
                title="Xóa tất cả bộ lọc"
              >
                <RotateCcw size={13} />
                <span>Thiết lập lại</span>
              </button>
            </div>

            <hr className="_filterDivider_hairline" />

            {/* Filter Group: Category */}
            <div className="_filterGroup_block">
              <h4 className="_filterGroup_title">Danh Mục Tour</h4>
              <div className="_filterOptions_stack">
                <label className="_filterCheckbox_label">
                  <input
                    type="radio"
                    name="catGroup"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="_hiddenRadio_control"
                  />
                  <span className="_customRadio_dot"></span>
                  <span className="_checkboxText_label">Tất cả điểm đến</span>
                </label>
                <label className="_filterCheckbox_label">
                  <input
                    type="radio"
                    name="catGroup"
                    checked={selectedCategory === 'tour-trong-nuoc'}
                    onChange={() => setSelectedCategory('tour-trong-nuoc')}
                    className="_hiddenRadio_control"
                  />
                  <span className="_customRadio_dot"></span>
                  <span className="_checkboxText_label">Tour trong nước</span>
                  <span className="_countBadge_muted">(5)</span>
                </label>
                <label className="_filterCheckbox_label">
                  <input
                    type="radio"
                    name="catGroup"
                    checked={selectedCategory === 'tour-nuoc-ngoai'}
                    onChange={() => setSelectedCategory('tour-nuoc-ngoai')}
                    className="_hiddenRadio_control"
                  />
                  <span className="_customRadio_dot"></span>
                  <span className="_checkboxText_label">Tour nước ngoài</span>
                  <span className="_countBadge_muted">(3)</span>
                </label>
              </div>
            </div>

            <hr className="_filterDivider_hairline" />

            {/* Filter Group: Price Range */}
            <div className="_filterGroup_block">
              <h4 className="_filterGroup_title">Mức Giá / Người Lớn</h4>
              <div className="_filterOptions_stack">
                <label className="_filterCheckbox_label">
                  <input
                    type="radio"
                    name="priceGroup"
                    checked={priceRange === 'all'}
                    onChange={() => setPriceRange('all')}
                    className="_hiddenRadio_control"
                  />
                  <span className="_customRadio_dot"></span>
                  <span className="_checkboxText_label">Mọi mức giá</span>
                </label>
                <label className="_filterCheckbox_label">
                  <input
                    type="radio"
                    name="priceGroup"
                    checked={priceRange === 'under5'}
                    onChange={() => setPriceRange('under5')}
                    className="_hiddenRadio_control"
                  />
                  <span className="_customRadio_dot"></span>
                  <span className="_checkboxText_label">Dưới 5.000.000đ</span>
                </label>
                <label className="_filterCheckbox_label">
                  <input
                    type="radio"
                    name="priceGroup"
                    checked={priceRange === '5to10'}
                    onChange={() => setPriceRange('5to10')}
                    className="_hiddenRadio_control"
                  />
                  <span className="_customRadio_dot"></span>
                  <span className="_checkboxText_label">Từ 5 - 10 triệu</span>
                </label>
                <label className="_filterCheckbox_label">
                  <input
                    type="radio"
                    name="priceGroup"
                    checked={priceRange === '10to20'}
                    onChange={() => setPriceRange('10to20')}
                    className="_hiddenRadio_control"
                  />
                  <span className="_customRadio_dot"></span>
                  <span className="_checkboxText_label">Từ 10 - 20 triệu</span>
                </label>
                <label className="_filterCheckbox_label">
                  <input
                    type="radio"
                    name="priceGroup"
                    checked={priceRange === 'above20'}
                    onChange={() => setPriceRange('above20')}
                    className="_hiddenRadio_control"
                  />
                  <span className="_customRadio_dot"></span>
                  <span className="_checkboxText_label">Trên 20.000.000đ</span>
                </label>
              </div>
            </div>

            <hr className="_filterDivider_hairline" />

            {/* Locator Practice Hint Box in Sidebar */}
            <div className="_locatorHint_box_sidebar">
              <div className="_hintHeader">
                <SlidersHorizontal size={14} />
                <strong>Gợi ý Selector Test:</strong>
              </div>
              <p>
                Để click radio "Từ 5 - 10 triệu", dùng XPath:
                <code>//label[contains(., 'Từ 5 - 10 triệu')]//input</code>
              </p>
            </div>
          </div>
        </aside>

        {/* Right Main Content: Sort Toolbar + Tour Grid */}
        <main className="_tourGridContent_col">
          {/* Toolbar */}
          <div className="_resultsToolbar_strip">
            <div className="_resultsCount_left">
              <span>Hiển thị </span>
              <strong className="_countVal">{tours.length}</strong>
              <span> tour du lịch</span>
            </div>

            {/* Sort custom dropdown */}
            <div className="_sortDropdown_group">
              <label className="_sortLabel_text">Sắp xếp theo:</label>
              <div className="_customSortSelect_wrap">
                <div
                  role="combobox"
                  aria-expanded={isSortDropdownOpen}
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="_sortTrigger_button"
                >
                  <span>{sortLabels[sortOption]}</span>
                  <ChevronDown size={14} />
                </div>
                {isSortDropdownOpen && (
                  <ul role="listbox" className="_sortOptions_popover">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <li
                        key={key}
                        role="option"
                        aria-selected={sortOption === key}
                        onClick={() => { setSortOption(key); setIsSortDropdownOpen(false); }}
                        className={`_sortOption_row ${sortOption === key ? '_is_active' : ''}`}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Tour Grid */}
          {loading ? (
            <div className="_loadingSpinner_block">
              <div className="_spinnerCircle" />
              <p>Đang tải danh sách tour...</p>
            </div>
          ) : tours.length === 0 ? (
            <div className="_emptyState_card">
              <AlertCircle size={40} className="_emptyIcon" />
              <h3>Không tìm thấy tour phù hợp</h3>
              <p>Vui lòng điều chỉnh lại bộ lọc giá hoặc danh mục để xem thêm tour.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="_btnReset_empty_state"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="_toursGrid_responsive_3col">
              {tours.map(tour => (
                <TourCard key={tour._id || tour.id} tour={tour} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
