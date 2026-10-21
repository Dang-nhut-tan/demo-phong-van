import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, CheckCircle2, Copy, Search, ExternalLink, Lightbulb, Code2, AlertTriangle } from 'lucide-react';

export const challengesList = [
  {
    id: 1,
    title: "Nút 'Đăng nhập' ở Header",
    level: "Cơ bản",
    targetPage: "/",
    description: "Bắt nút 'Đăng nhập' trên thanh Header để mở modal tài khoản.",
    difficultyNote: "Nút không có ID, class bị hash `_authTrigger_btn_primary_1k6v`, chữ bên trong bị tách thành hai thẻ con `<span>Đăng</span>` và `<span>nhập</span>`.",
    expectedPlaywright: "page.getByRole('button', { name: 'Đăng nhập' })",
    expectedXPath: "//button[contains(., 'Đăng') and contains(., 'nhập')]",
    cssSelector: "button._authTrigger_btn_primary_1k6v"
  },
  {
    id: 2,
    title: "Ô input tìm kiếm trên Header",
    level: "Cơ bản",
    targetPage: "/",
    description: "Nhập từ khóa tìm kiếm tour vào ô input ở thanh Header.",
    difficultyNote: "Input không có name, không có id, chỉ có placeholder dài.",
    expectedPlaywright: "page.getByPlaceholder('Tìm điểm đến: Tokyo, Sapa, Paris, Phú Quốc...')",
    expectedXPath: "//input[contains(@placeholder, 'Tìm điểm đến')]",
    cssSelector: "input._inputField_naked_3p8x"
  },
  {
    id: 3,
    title: "Huy hiệu đếm số lượng giỏ hàng",
    level: "Cơ bản",
    targetPage: "/",
    description: "Lấy số lượng hiển thị trên badge đỏ của icon Giỏ hàng.",
    difficultyNote: "Nằm lồng bên trong thẻ `a[href='/cart']`.",
    expectedPlaywright: "page.locator('a[href=\"/cart\"]').locator('._cartBadge_counter_3x')",
    expectedXPath: "//a[@href='/cart']//span[contains(@class, 'cartBadge')]",
    cssSelector: "a._cartAction_btn_4m7p ._cartBadge_counter_3x"
  },
  {
    id: 4,
    title: "Click 'Đặt tour' của tour 'Tokyo - Núi Phú Sĩ'",
    level: "Trung bình",
    targetPage: "/",
    description: "Trên trang chủ có nhiều tour card với các nút 'Đặt tour' giống hệt nhau. Bạn cần bấm đúng nút của tour Tokyo.",
    difficultyNote: "Mọi thẻ card đều dùng chung class `_btnOrder_action_primary`. Phải dùng relative locator hoặc ancestor navigation từ tiêu đề tour.",
    expectedPlaywright: "page.locator('article[data-component=\"tour-card\"]').filter({ hasText: 'Tokyo - Núi Phú Sĩ' }).getByRole('button', { name: 'Đặt tour' })",
    expectedXPath: "//article[contains(@class, '_tourCard_')][.//a[contains(text(), 'Tokyo')]]//button[contains(., 'Đặt')]",
    cssSelector: "article[data-tour-slug='tokyo-nui-phu-si'] button._btnOrder_action_primary"
  },
  {
    id: 5,
    title: "Huy hiệu giảm giá của tour 'Sapa Mùa Mây'",
    level: "Trung bình",
    targetPage: "/",
    description: "Lấy nội dung badge giảm giá `⚡ GIẢM -7%` của tour Sapa.",
    difficultyNote: "Badge nằm ở góc trên bên trái của ảnh tour, cần xác định đúng card Sapa.",
    expectedPlaywright: "page.locator('article').filter({ hasText: 'Sapa Mùa Mây' }).locator('._discountBadge_top_9v')",
    expectedXPath: "//article[contains(., 'Sapa Mùa Mây')]//div[contains(@class, 'discountBadge')]",
    cssSelector: "article[data-tour-slug='sapa-mua-may'] ._discountBadge_top_9v"
  },
  {
    id: 6,
    title: "Giá tiền hiện tại của tour 'Paris - Kinh Đô Ánh Sáng'",
    level: "Trung bình",
    targetPage: "/",
    description: "Đọc số tiền khuyến mãi nổi bật (màu đỏ) của tour Paris.",
    difficultyNote: "Trong card có cả giá cũ gạch ngang và giá mới, cần chọn đúng phần tử giá mới.",
    expectedPlaywright: "page.locator('article').filter({ hasText: 'Paris' }).locator('._currentVal_highlight')",
    expectedXPath: "//article[contains(., 'Paris')]//span[contains(@class, 'currentVal')]",
    cssSelector: "article[data-tour-slug='paris-kinh-do-anh-sang'] ._currentVal_highlight"
  },
  {
    id: 7,
    title: "Nút tăng số lượng '+' trong bảng giỏ hàng",
    level: "Khó",
    targetPage: "/cart",
    description: "Tăng số lượng tour 'Tokyo - Núi Phú Sĩ' trong bảng giỏ hàng.",
    difficultyNote: "Mỗi hàng trong table đều có nút `+` giống nhau. Cần tìm theo hàng `tr` chứa chữ Tokyo.",
    expectedPlaywright: "page.locator('tr').filter({ hasText: 'Tokyo' }).getByRole('button', { name: '+' })",
    expectedXPath: "//tr[contains(., 'Tokyo')]//button[contains(@class, '_btnQty_inc') or text()='+']",
    cssSelector: "tr[data-tour-title*='Tokyo'] button._btnQty_inc"
  },
  {
    id: 8,
    title: "Nút thùng rác 'Xóa' của tour thứ 2 trong giỏ hàng",
    level: "Khó",
    targetPage: "/cart",
    description: "Bấm nút xóa tour thứ 2 khỏi bảng giỏ hàng.",
    difficultyNote: "Nút xóa chỉ có icon SVG thùng rác, không chứa chữ hiển thị trực tiếp.",
    expectedPlaywright: "page.locator('tbody tr').nth(1).locator('button._btnDelete_item_icon')",
    expectedXPath: "(//tbody//tr)[2]//button[contains(@class, 'btnDelete') or @title='Xóa tour khỏi giỏ']",
    cssSelector: "tbody tr:nth-child(2) button._btnDelete_item_icon"
  },
  {
    id: 9,
    title: "Radio filter 'Từ 5 - 10 triệu' ở trang danh sách tour",
    level: "Khó",
    targetPage: "/category/all",
    description: "Chọn khoảng giá 'Từ 5 - 10 triệu' ở sidebar bộ lọc.",
    difficultyNote: "Thẻ `input[type='radio']` bị ẩn CSS (opacity 0 hoặc hidden), cần click vào nhãn `label` hoặc `span` bọc ngoài.",
    expectedPlaywright: "page.getByLabel('Từ 5 - 10 triệu')",
    expectedXPath: "//label[contains(., 'Từ 5 - 10 triệu')]//input | //label[contains(., 'Từ 5 - 10 triệu')]",
    cssSelector: "input[value='5to10']"
  },
  {
    id: 10,
    title: "Custom Combobox: Chọn điểm khởi hành 'Hà Nội'",
    level: "Khó",
    targetPage: "/",
    description: "Mở dropdown chọn điểm khởi hành ở Hero Search và chọn 'Hà Nội'.",
    difficultyNote: "Không phải thẻ `<select>` thông thường, là custom component `div[role='combobox']` và `li[role='option']`.",
    expectedPlaywright: "await page.getByRole('combobox').click(); await page.getByRole('option', { name: 'Hà Nội' }).click();",
    expectedXPath: "//div[@role='combobox'] -> sau đó //li[@role='option' and text()='Hà Nội']",
    cssSelector: "div._comboboxTrigger_box -> li._optionItem_row:has-text('Hà Nội')"
  },
  {
    id: 11,
    title: "Ô input 'Số điện thoại' ở trang Liên Hệ",
    level: "Cực khó",
    targetPage: "/contact",
    description: "Nhập số điện thoại vào form liên hệ.",
    difficultyNote: "Input không có id, nằm trong `div` con nằm sau thẻ `label`. Phải dùng following-sibling hoặc container wrapping.",
    expectedPlaywright: "page.locator('div._contactFormGroup').filter({ has: page.getByText('Số điện thoại liên hệ') }).locator('input')",
    expectedXPath: "//label[contains(., 'Số điện thoại')]/following-sibling::div//input",
    cssSelector: "div._contactFormGroup:has(label:has-text('Số điện thoại')) input"
  },
  {
    id: 12,
    title: "Tăng số lượng 'Trẻ em' trong widget Chi Tiết Tour",
    level: "Cực khó",
    targetPage: "/tour/tokyo-nui-phu-si",
    description: "Bấm nút `+` để thêm 1 vé trẻ em ở cột bên phải trang chi tiết tour.",
    difficultyNote: "Có 3 hàng tương tự nhau: Người lớn, Trẻ em, Em bé. Cần định vị chính xác container của 'Trẻ em'.",
    expectedPlaywright: "page.locator('div[data-passenger-type=\"child\"]').getByRole('button', { name: '+' })",
    expectedXPath: "//div[contains(@class, 'passengerRow')][.//span[contains(., 'Trẻ em')]]//button[text()='+']",
    cssSelector: "div[data-passenger-type='child'] button._btnInc"
  },
  {
    id: 13,
    title: "Checkbox 'Ghi nhớ đăng nhập' trong Modal Đăng nhập",
    level: "Cực khó",
    targetPage: "/",
    description: "Mở modal đăng nhập và click vào ô 'Ghi nhớ đăng nhập'.",
    difficultyNote: "Checkbox nằm trong modal overlay, input bị ẩn và thay bằng custom span.",
    expectedPlaywright: "page.locator('label._checkboxWrap_3a').filter({ hasText: 'Ghi nhớ đăng nhập' })",
    expectedXPath: "//div[@role='dialog']//label[contains(., 'Ghi nhớ đăng nhập')]",
    cssSelector: "div[role='dialog'] label._checkboxWrap_3a"
  },
  {
    id: 14,
    title: "Upload file CV trong Modal Ứng tuyển",
    level: "Cực khó",
    targetPage: "/careers",
    description: "Mở form ứng tuyển vị trí 'Kỹ Sư Automation Test' và tải lên file CV.",
    difficultyNote: "Thẻ `input[type='file']` nằm lồng trong dropzone. Trong Playwright dùng `setInputFiles()`.",
    expectedPlaywright: "await page.locator('input[type=\"file\"]').setInputFiles('path/to/cv.pdf')",
    expectedXPath: "//div[@role='dialog']//input[@type='file']",
    cssSelector: "input._fileControl_input"
  },
  {
    id: 15,
    title: "Nút 'Chỉ đường' trên bản đồ Google Maps trang Liên Hệ",
    level: "Trung bình",
    targetPage: "/contact",
    description: "Bắt link 'Chỉ đường' mở tab Google Maps chỉ dẫn tới trụ sở.",
    difficultyNote: "Thẻ `a` có thuộc tính `target='_blank'`, chứa text và icon SVG chỉ đường.",
    expectedPlaywright: "page.getByRole('link', { name: 'Chỉ đường' })",
    expectedXPath: "//a[contains(@class, 'btnDirections') and contains(., 'Chỉ đường')]",
    cssSelector: "a._btnDirections_link"
  }
];

export default function LocatorChallengesPage() {
  const [copiedId, setCopiedId] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');

  // Live Selector Tester State
  const [testQuery, setTestQuery] = useState('');
  const [queryType, setQueryType] = useState('xpath'); // 'xpath' | 'css'
  const [testResult, setTestResult] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

      // Highlight matched elements
      document.querySelectorAll('._qa_tester_highlight').forEach(el => {
        el.classList.remove('_qa_tester_highlight');
      });

      elements.forEach(el => {
        if (el && el.classList) {
          el.classList.add('_qa_tester_highlight');
        }
      });

      setTestResult({
        count: elements.length,
        items: elements.slice(0, 5).map(el => ({
          tag: el.tagName?.toLowerCase(),
          text: (el.innerText || el.textContent || '').trim().slice(0, 60),
          className: el.className?.toString().slice(0, 40)
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
          <h1 className="_hero_h1">15 Thử Thách Bắt Locator Trong React</h1>
          <p className="_hero_lead">
            Được thiết kế mô phỏng các bài toán hóc búa thực tế trong các dự án React SPA: 
            <strong> hashed classnames</strong>, <strong>split text nodes</strong>, <strong>relative grid locators</strong>, 
            <strong>sibling/ancestor navigation</strong> và <strong>custom non-native controls</strong>.
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
              <p>Gõ XPath hoặc CSS selector vào đây để kiểm tra trực tiếp số lượng phần tử khớp trên trang này!</p>
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
                placeholder={queryType === 'xpath' ? "//button[contains(., 'Đăng nhập')]" : "button._btnOrder_action_primary"}
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
                    {testResult.count > 0 && <span className="_highlightNotice">(Các phần tử đã được viền phát sáng)</span>}
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
          <span className="_filterLabel">Lọc theo độ khó:</span>
          {['all', 'Cơ bản', 'Trung bình', 'Khó', 'Cực khó'].map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilterLevel(lvl)}
              className={`_levelPill_btn ${filterLevel === lvl ? '_is_active' : ''}`}
            >
              {lvl === 'all' ? 'Tất cả (15)' : lvl}
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
                  <span>Thử thách #{ch.id}</span>
                </div>
                <span className={`_difficultyTag _tag_${ch.level.toLowerCase().replace(' ', '_')}`}>
                  {ch.level}
                </span>
              </div>

              <h3 className="_challengeTitle">{ch.title}</h3>
              <p className="_challengeDesc">{ch.description}</p>

              {/* Challenge Caveat Note */}
              <div className="_challengeNote_box">
                <Lightbulb size={16} className="_noteIcon" />
                <p><strong>Điểm khó:</strong> {ch.difficultyNote}</p>
              </div>

              {/* Code Solution Accordion */}
              <div className="_solutionBlock">
                <div className="_solutionSnippet">
                  <div className="_snippetHeader">
                    <span>Playwright Locator:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ch.expectedPlaywright, `pw-${ch.id}`)}
                      className="_btnCopyCode"
                      title="Copy Playwright code"
                    >
                      {copiedId === `pw-${ch.id}` ? "Đã copy!" : <Copy size={13} />}
                    </button>
                  </div>
                  <pre><code>{ch.expectedPlaywright}</code></pre>
                </div>

                <div className="_solutionSnippet">
                  <div className="_snippetHeader">
                    <span>XPath Chuẩn:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ch.expectedXPath, `xp-${ch.id}`)}
                      className="_btnCopyCode"
                      title="Copy XPath"
                    >
                      {copiedId === `xp-${ch.id}` ? "Đã copy!" : <Copy size={13} />}
                    </button>
                  </div>
                  <pre><code>{ch.expectedXPath}</code></pre>
                </div>
              </div>

              {/* Jump to target page link */}
              <div className="_cardFooter_action">
                <Link to={ch.targetPage} className="_btnJumpToTarget">
                  <span>Mở trang thực hành ({ch.targetPage})</span>
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
