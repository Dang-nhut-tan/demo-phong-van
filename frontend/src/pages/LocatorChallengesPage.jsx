import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, CheckCircle2, Search, ExternalLink, Lightbulb, Code2, AlertTriangle, HelpCircle } from 'lucide-react';

export const challengesList = [
  {
    id: 1,
    title: "Nút 'Đăng nhập' ở Header",
    level: "Cơ bản",
    targetPage: "/",
    description: "Bắt nút 'Đăng nhập' trên thanh Header để mở modal tài khoản.",
    difficultyNote: "Nút không dùng ID tĩnh, class name dạng module/hash, chữ bên trong bị tách thành hai thẻ con <span>Đăng</span> và <span>nhập</span>."
  },
  {
    id: 2,
    title: "Ô input tìm kiếm trên Header",
    level: "Cơ bản",
    targetPage: "/",
    description: "Nhập từ khóa tìm kiếm tour vào ô input ở thanh Header.",
    difficultyNote: "Thẻ input không có thuộc tính name, không có id, chỉ có placeholder dài và nằm trong container custom."
  },
  {
    id: 3,
    title: "Huy hiệu đếm số lượng giỏ hàng",
    level: "Cơ bản",
    targetPage: "/",
    description: "Lấy giá trị số lượng hiển thị trên badge đỏ của icon Giỏ hàng.",
    difficultyNote: "Nằm lồng sâu bên trong thẻ đường dẫn giỏ hàng và không có id độc lập."
  },
  {
    id: 4,
    title: "Nút đặt tour của tour 'Tokyo - Núi Phú Sĩ'",
    level: "Trung bình",
    targetPage: "/",
    description: "Trên trang chủ có nhiều tour card với các nút đặt tour giống hệt nhau. Bạn cần bấm đúng nút của riêng tour Tokyo.",
    difficultyNote: "Mọi tour card trên trang đều dùng chung class name và cùng chứa text. Bắt buộc phải áp dụng kỹ thuật scoping theo container hoặc điều hướng ancestor từ tiêu đề tour."
  },
  {
    id: 5,
    title: "Huy hiệu giảm giá của tour 'Sapa Mùa Mây'",
    level: "Trung bình",
    targetPage: "/",
    description: "Lấy nội dung badge giảm giá (ví dụ: '⚡ GIẢM -7%') của tour Sapa.",
    difficultyNote: "Huy hiệu nằm ở góc trên ảnh tour của card Sapa. Cần định vị chính xác container của tour này mà không bắt nhầm sang tour khác."
  },
  {
    id: 6,
    title: "Giá tiền khuyến mãi của tour 'Paris - Kinh Đô Ánh Sáng'",
    level: "Trung bình",
    targetPage: "/",
    description: "Đọc số tiền khuyến mãi nổi bật (giá mới) của tour Paris.",
    difficultyNote: "Trong mỗi card có cả giá cũ gạch ngang và giá mới, cần chọn chính xác phần tử mang giá mới của đúng tour Paris."
  },
  {
    id: 7,
    title: "Nút tăng số lượng '+' trong bảng giỏ hàng",
    level: "Khó",
    targetPage: "/cart",
    description: "Tăng số lượng tour 'Tokyo - Núi Phú Sĩ' trong bảng giỏ hàng.",
    difficultyNote: "Mỗi hàng trong table đều có nút '+' mang class và chữ giống nhau. Bắt buộc phải xác định hàng <tr> chứa tên tour trước, rồi tìm nút '+' bên trong hàng đó."
  },
  {
    id: 8,
    title: "Nút thùng rác 'Xóa' của tour thứ 2 trong giỏ hàng",
    level: "Khó",
    targetPage: "/cart",
    description: "Bấm nút xóa tour thứ 2 khỏi danh sách giỏ hàng.",
    difficultyNote: "Nút xóa chỉ hiển thị icon SVG thùng rác, không chứa chữ trực tiếp. Cần định vị theo chỉ số hàng và cấu trúc con của hàng đó."
  },
  {
    id: 9,
    title: "Radio filter 'Từ 5 - 10 triệu' ở trang danh sách tour",
    level: "Khó",
    targetPage: "/tours",
    description: "Chọn khoảng giá 'Từ 5 - 10 triệu' ở sidebar bộ lọc.",
    difficultyNote: "Thẻ <input type='radio'> bị ẩn CSS, click trực tiếp vào input có thể bị fail. Cần xác định nhãn hoặc container bọc ngoài để trigger sự kiện click."
  },
  {
    id: 10,
    title: "Custom Combobox: Chọn điểm khởi hành 'Hà Nội'",
    level: "Khó",
    targetPage: "/",
    description: "Mở dropdown chọn điểm khởi hành ở Hero Search và chọn 'Hà Nội'.",
    difficultyNote: "Không phải thẻ <select> chuẩn HTML, mà là custom component kết hợp role='combobox' và role='option'. Cần tương tác tuần tự 2 bước: mở dropdown rồi chọn option."
  },
  {
    id: 11,
    title: "Ô input 'Số điện thoại' ở trang Liên Hệ",
    level: "Cực khó",
    targetPage: "/contact",
    description: "Nhập số điện thoại vào form liên hệ.",
    difficultyNote: "Thẻ input không có thuộc tính id, thẻ <label> không có thuộc tính 'for'. Buộc phải dùng following-sibling trong XPath hoặc filter container trong Playwright."
  },
  {
    id: 12,
    title: "Tăng số lượng 'Trẻ em' trong widget Chi Tiết Tour",
    level: "Cực khó",
    targetPage: "/tour/tokyo-nui-phu-si",
    description: "Bấm nút '+' để thêm 1 vé trẻ em ở cột bên phải trang chi tiết tour.",
    difficultyNote: "Có 3 hàng cấu trúc tương tự nhau: Người lớn, Trẻ em, Em bé. Bắt buộc phải định vị chính xác khối chứa text 'Trẻ em' trước khi click nút '+'."
  },
  {
    id: 13,
    title: "Checkbox 'Ghi nhớ đăng nhập' trong Modal Đăng nhập",
    level: "Cực khó",
    targetPage: "/",
    description: "Mở modal đăng nhập và click vào ô 'Ghi nhớ đăng nhập'.",
    difficultyNote: "Checkbox nằm trong modal popup, input native bị ẩn và thay thế bằng custom indicator."
  },
  {
    id: 14,
    title: "Upload file CV trong Modal Ứng tuyển",
    level: "Cực khó",
    targetPage: "/careers",
    description: "Mở form ứng tuyển vị trí bất kỳ và thực hiện upload file CV mẫu.",
    difficultyNote: "Thẻ input[type='file'] bị ẩn trong vùng kéo thả file (dropzone). Cần chọn đúng thẻ input ẩn để thực hiện gắn file qua phương thức tự động hóa."
  },
  {
    id: 15,
    title: "Nút 'Chỉ đường' trên bản đồ Google Maps trang Liên Hệ",
    level: "Trung bình",
    targetPage: "/contact",
    description: "Bắt link 'Chỉ đường' để mở chỉ dẫn bản đồ tới trụ sở công ty.",
    difficultyNote: "Thẻ <a> nằm lồng trong floating card trên iframe bản đồ, chứa icon SVG và text."
  }
];

export default function LocatorChallengesPage() {
  const [filterLevel, setFilterLevel] = useState('all');

  // Live Selector Tester State
  const [testQuery, setTestQuery] = useState('');
  const [queryType, setQueryType] = useState('xpath'); // 'xpath' | 'css'
  const [testResult, setTestResult] = useState(null);

  const handleTestSelector = (e) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    try {
      let elements = [];
      if (queryType === 'xpath') {
        const result = document.evaluate(
          testQuery,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        for (let i = 0; i < result.snapshotLength; i++) {
          elements.push(result.snapshotItem(i));
        }
      } else {
        elements = Array.from(document.querySelectorAll(testQuery));
      }

      // Visual highlight matching elements temporarily
      document.querySelectorAll('._qa_inspect_highlight').forEach(el => el.classList.remove('_qa_inspect_highlight'));
      elements.slice(0, 10).forEach(el => {
        if (el && el.classList) {
          el.classList.add('_qa_inspect_highlight');
        }
      });

      setTestResult({
        count: elements.length,
        items: elements.slice(0, 5).map(el => ({
          tag: el.tagName?.toLowerCase() || 'node',
          text: (el.textContent || '').trim().slice(0, 40)
        })),
        error: null
      });
    } catch (err) {
      setTestResult({
        count: 0,
        items: [],
        error: err.message
      });
    }
  };

  const filteredChallenges = filterLevel === 'all'
    ? challengesList
    : challengesList.filter(c => c.level === filterLevel);

  return (
    <div className="_vt_challengesPage_view">
      {/* Hero Header */}
      <div className="_challengesHero_banner">
        <div className="_container_inner_wrap _textCenter">
          <span className="_eyebrow_pill">PLAYWRIGHT & XPATH TESTING LAB</span>
          <h1 className="_hero_h1">15 Bài Tập Thực Hành Bắt Locator (Tự Luyện)</h1>
          <p className="_hero_lead">
            Các bài tập được thiết kế mô phỏng môi trường thực tế không có ID tĩnh, class name động,
            văn bản phân mảnh và các component phức tạp để bạn tự thử sức tư duy và kiểm chứng locator.
          </p>
        </div>
      </div>

      <div className="_container_inner_wrap _challengesLayout">
        {/* Interactive Live Selector Tester Tool! */}
        <div className="_interactiveTester_card">
          <div className="_testerHeader">
            <Code2 size={22} className="_testerIcon" />
            <div>
              <h3>Công Cụ Thử Nghiệm Selector Trực Tiếp (Live Selector Tester)</h3>
              <p>Gõ câu lệnh XPath hoặc CSS Selector của bạn vào đây để kiểm tra ngay số lượng phần tử khớp trên trang:</p>
            </div>
          </div>

          <form onSubmit={handleTestSelector} className="_testerForm_row">
            <div className="_testerType_toggle">
              <button
                type="button"
                onClick={() => setQueryType('xpath')}
                className={`_btnToggleType ${queryType === 'xpath' ? '_active' : ''}`}
              >
                XPath
              </button>
              <button
                type="button"
                onClick={() => setQueryType('css')}
                className={`_btnToggleType ${queryType === 'css' ? '_active' : ''}`}
              >
                CSS Selector
              </button>
            </div>

            <div className="_testerInput_wrap">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder={queryType === 'xpath' ? "Nhập câu lệnh XPath bạn muốn thử..." : "Nhập CSS selector bạn muốn thử..."}
                className="_testerInput_control"
              />
            </div>

            <button type="submit" className="_btnRunTest">
              <Search size={16} />
              <span>Kiểm Tra Selector</span>
            </button>
          </form>

          {/* Test Results Output */}
          {testResult && (
            <div className={`_testFeedback_box ${testResult.error ? '_has_error' : testResult.count > 0 ? '_has_match' : '_no_match'}`}>
              {testResult.error ? (
                <div className="_errorRow">
                  <AlertTriangle size={18} />
                  <span>Cú pháp không hợp lệ: {testResult.error}</span>
                </div>
              ) : (
                <div className="_resultContent">
                  <div className="_resultSummary">
                    <CheckCircle2 size={18} />
                    <strong>Tìm thấy {testResult.count} phần tử khớp trên trang!</strong>
                    {testResult.count > 0 && <span className="_highlightNotice">(Các phần tử khớp đã được viền phát sáng)</span>}
                  </div>
                  {testResult.items.length > 0 && (
                    <ul className="_resultSnippetList">
                      {testResult.items.map((item, idx) => (
                        <li key={idx}>
                          <code>&lt;{item.tag}&gt;</code>: "{item.text || 'Không có text'}"
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Level Filters */}
        <div className="_levelFilter_row">
          <span className="_filterLabel">Lọc theo cấp độ:</span>
          {['all', 'Cơ bản', 'Trung bình', 'Khó', 'Cực khó'].map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilterLevel(lvl)}
              className={`_levelPill_btn ${filterLevel === lvl ? '_is_active' : ''}`}
            >
              {lvl === 'all' ? 'Tất cả (15 bài)' : lvl}
            </button>
          ))}
        </div>

        {/* Challenges List */}
        <div className="_challengesGrid_container">
          {filteredChallenges.map((ch) => (
            <div key={ch.id} className="_challengeCard_item">
              <div className="_challengeCard_top">
                <div className="_challengeIndex_badge">
                  <Target size={14} />
                  <span>Bài tập #{ch.id}</span>
                </div>
                <span className={`_difficultyTag _tag_${ch.level.toLowerCase().replace(' ', '_')}`}>
                  {ch.level}
                </span>
              </div>

              <h3 className="_challengeTitle">{ch.title}</h3>
              <p className="_challengeDesc"><strong>Yêu cầu:</strong> {ch.description}</p>

              {/* Challenge Caveat Note */}
              <div className="_challengeNote_box">
                <Lightbulb size={16} className="_noteIcon" />
                <p><strong>Bẫy DOM:</strong> {ch.difficultyNote}</p>
              </div>

              {/* Jump to target page link */}
              <div className="_cardFooter_action">
                <Link to={ch.targetPage} className="_btnJumpToTarget">
                  <span>Đi đến trang thực hành ({ch.targetPage})</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
