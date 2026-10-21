// Dữ liệu mẫu dự phòng khi chạy frontend độc lập hoặc mất kết nối backend
export const fallbackTours = [
  {
    _id: "tour-1",
    name: "Tokyo - Núi Phú Sĩ - Trải Nghiệm Mùa Hoa",
    slug: "tokyo-nui-phu-si",
    avatar: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80"
    ],
    priceAdult: 28900000,
    priceNewAdult: 26010000,
    priceChildren: 20000000,
    priceNewChildren: 18000000,
    priceBaby: 5000000,
    priceNewBaby: 4500000,
    discount: 10,
    stockAdult: 15,
    departureDateFormat: "25/10/2026",
    time: "5 ngày 4 đêm",
    vehicle: "Hàng không Vietnam Airlines",
    categorySlug: "tour-nuoc-ngoai",
    categoryName: "Tour nước ngoài",
    rating: 4.9,
    reviewsCount: 320,
    code: "VT-TYO-01",
    information: "Khám phá xứ sở hoa anh đào, chiêm ngưỡng ngọn núi Phú Sĩ hùng vĩ, trải nghiệm tắm khoáng nóng Onsen truyền thống và thưởng thức ẩm thực Nhật Bản tinh tế.",
    schedules: [
      { title: "Ngày 1: TP.HCM - Tokyo (Narita)", description: "Quý khách tập trung tại sân bay Tân Sơn Nhất, làm thủ tục đáp chuyến bay đi Tokyo." },
      { title: "Ngày 2: Khám phá Núi Phú Sĩ - Làng Cổ Oshino Hakkai", description: "Tham quan ngọn núi Phú Sĩ tráng lệ và ngôi làng cổ tích bình yên." },
      { title: "Ngày 3: Hoàng Cung Tokyo - Chùa Asakusa Kannon", description: "Viếng ngôi chùa cổ nhất Tokyo và chụp ảnh lưu niệm tại Hoàng Cung Tokyo." }
    ]
  },
  {
    _id: "tour-2",
    name: "Seoul - Cung Điện Gyeongbokgung - Đảo Nami",
    slug: "seoul-cung-dien-gyeongbokgung",
    avatar: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80"
    ],
    priceAdult: 18900000,
    priceNewAdult: 17010000,
    priceChildren: 13000000,
    priceNewChildren: 11700000,
    priceBaby: 3000000,
    priceNewBaby: 2700000,
    discount: 10,
    stockAdult: 20,
    departureDateFormat: "28/10/2026",
    time: "4 ngày 3 đêm",
    vehicle: "Hàng không Korean Air",
    categorySlug: "tour-nuoc-ngoai",
    categoryName: "Tour nước ngoài",
    rating: 4.8,
    reviewsCount: 245,
    code: "VT-SEL-02",
    information: "Seoul lãng mạn với những con đường rợp bóng ngân hạnh tại Đảo Nami, ngắm toàn cảnh tháp Namsan và shopping thả ga tại chợ Myeongdong.",
    schedules: [
      { title: "Ngày 1: TP.HCM - Seoul Incheon", description: "Khởi hành từ TP.HCM đi Incheon, nghỉ đêm tại Seoul." },
      { title: "Ngày 2: Đảo Nami - Tháp Namsan", description: "Khám phá trường quay bản tình ca mùa đông Nami." }
    ]
  },
  {
    _id: "tour-3",
    name: "Paris - Kinh Đô Ánh Sáng - Bảo Tàng Louvre",
    slug: "paris-kinh-do-anh-sang",
    avatar: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
    ],
    priceAdult: 59900000,
    priceNewAdult: 53910000,
    priceChildren: 45000000,
    priceNewChildren: 40500000,
    priceBaby: 10000000,
    priceNewBaby: 9000000,
    discount: 10,
    stockAdult: 12,
    departureDateFormat: "05/11/2026",
    time: "7 ngày 6 đêm",
    vehicle: "Hàng không Air France",
    categorySlug: "tour-nuoc-ngoai",
    categoryName: "Tour nước ngoài",
    rating: 5.0,
    reviewsCount: 512,
    code: "VT-PAR-03",
    information: "Hành trình Châu Âu đẳng cấp qua tháp Eiffel huyền thoại, bảo tàng Louvre và du thuyền trên dòng sông Seine thơ mộng.",
    schedules: [
      { title: "Ngày 1: TP.HCM - Paris Charles de Gaulle", description: "Đoàn bay thẳng đến Paris, nhận phòng khách sạn." }
    ]
  },
  {
    _id: "tour-4",
    name: "Sapa Mùa Mây - Chinh Phục Đỉnh Fansipan",
    slug: "sapa-mua-may",
    avatar: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80"
    ],
    priceAdult: 7100000,
    priceNewAdult: 6600000,
    priceChildren: 5000000,
    priceNewChildren: 4600000,
    priceBaby: 1000000,
    priceNewBaby: 900000,
    discount: 7,
    stockAdult: 20,
    departureDateFormat: "19/10/2026",
    time: "3 ngày 2 đêm",
    vehicle: "Xe giường nằm VIP Limousine",
    categorySlug: "tour-trong-nuoc",
    categoryName: "Tour trong nước",
    rating: 4.8,
    reviewsCount: 180,
    code: "VT-SAP-04",
    information: "Thưởng ngoạn biển mây Sapa, đi cáp treo lên Nóc nhà Đông Dương Fansipan và hòa mình vào nét văn hóa bản Cát Cát.",
    schedules: [
      { title: "Ngày 1: Hà Nội - Sapa - Bản Cát Cát", description: "Xe đón khách tại điểm hẹn khởi hành đi Sapa." }
    ]
  },
  {
    _id: "tour-5",
    name: "Huế Di Sản - Đà Nẵng - Phố Cổ Hội An",
    slug: "hue-di-san",
    avatar: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80"
    ],
    priceAdult: 5800000,
    priceNewAdult: 5394000,
    priceChildren: 4100000,
    priceNewChildren: 3800000,
    priceBaby: 800000,
    priceNewBaby: 700000,
    discount: 7,
    stockAdult: 18,
    departureDateFormat: "22/10/2026",
    time: "4 ngày 3 đêm",
    vehicle: "Máy bay Vietnam Airlines",
    categorySlug: "tour-trong-nuoc",
    categoryName: "Tour trong nước",
    rating: 4.9,
    reviewsCount: 290,
    code: "VT-HUE-05",
    information: "Hành trình kết nối di sản miền Trung: Cố đô Huế trầm mặc, Bà Nà Hills lung linh và phố cổ Hội An rực rỡ hoa đăng.",
    schedules: [
      { title: "Ngày 1: Đón khách - Tham quan Đại Nội Huế", description: "Khám phá hoàng cung triều Nguyễn." }
    ]
  },
  {
    _id: "tour-6",
    name: "Nha Trang Biển Xanh - VinWonders Đẳng Cấp",
    slug: "nha-trang-bien-xanh",
    avatar: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    priceAdult: 4900000,
    priceNewAdult: 4557000,
    priceChildren: 3500000,
    priceNewChildren: 3250000,
    priceBaby: 500000,
    priceNewBaby: 450000,
    discount: 7,
    stockAdult: 24,
    departureDateFormat: "24/10/2026",
    time: "3 ngày 2 đêm",
    vehicle: "Xe du lịch chất lượng cao",
    categorySlug: "tour-trong-nuoc",
    categoryName: "Tour trong nước",
    rating: 4.7,
    reviewsCount: 156,
    code: "VT-NHA-06",
    information: "Tận hưởng làn nước biển trong vắt tại vịnh Nha Trang, lặn ngắm san hô và vui chơi thỏa thích tại VinWonders.",
    schedules: [
      { title: "Ngày 1: TP.HCM - Nha Trang", description: "Khởi hành đi thành phố biển Nha Trang." }
    ]
  },
  {
    _id: "tour-7",
    name: "Đà Lạt Mộng Mơ - Săn Mây Cầu Đất",
    slug: "da-lat-mong-mo",
    avatar: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
    ],
    priceAdult: 3500000,
    priceNewAdult: 3220000,
    priceChildren: 2500000,
    priceNewChildren: 2300000,
    priceBaby: 400000,
    priceNewBaby: 350000,
    discount: 8,
    stockAdult: 16,
    departureDateFormat: "27/10/2026",
    time: "3 ngày 2 đêm",
    vehicle: "Xe giường nằm Limousine",
    categorySlug: "tour-trong-nuoc",
    categoryName: "Tour trong nước",
    rating: 4.9,
    reviewsCount: 420,
    code: "VT-DLT-07",
    information: "Thành phố sương mù với đồi chè Cầu Đất, vườn cẩm tú cầu nở rộ và không khí se lạnh tuyệt vời.",
    schedules: [
      { title: "Ngày 1: TP.HCM - Đà Lạt", description: "Khởi hành đi Đà Lạt, check-in quảng trường Lâm Viên." }
    ]
  },
  {
    _id: "tour-8",
    name: "Khám Phá Phú Quốc - Hoàng Hôn Sunset Sanato",
    slug: "kham-pha-phu-quoc",
    avatar: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    priceAdult: 6200000,
    priceNewAdult: 5580000,
    priceChildren: 4500000,
    priceNewChildren: 4050000,
    priceBaby: 800000,
    priceNewBaby: 700000,
    discount: 10,
    stockAdult: 22,
    departureDateFormat: "30/10/2026",
    time: "3 ngày 2 đêm",
    vehicle: "Máy bay Vietnam Airlines",
    categorySlug: "tour-trong-nuoc",
    categoryName: "Tour trong nước",
    rating: 4.8,
    reviewsCount: 310,
    code: "VT-PQC-08",
    information: "Thiên đường đảo ngọc Phú Quốc với cáp treo Hòn Thơm vượt biển dài nhất thế giới, Grand World và ngắm hoàng hôn Sunset Sanato.",
    schedules: [
      { title: "Ngày 1: Đón sân bay Phú Quốc - Check-in", description: "Khám phá Grand World Phú Quốc." }
    ]
  }
];

export const fallbackCategories = [
  { _id: "cat-1", name: "Tour trong nước", slug: "tour-trong-nuoc" },
  { _id: "cat-2", name: "Tour nước ngoài", slug: "tour-nuoc-ngoai" }
];

export const fallbackJobs = [
  {
    _id: "job-1",
    title: "Hướng Dẫn Viên Du Lịch Quốc Tế (Tiếng Anh/Nhật)",
    department: "Điều hành Tour",
    location: "TP. Hồ Chí Minh",
    salary: "18.000.000đ - 25.000.000đ",
    type: "Toàn thời gian",
    description: "Dẫn đoàn tour outbound Nhật Bản, Hàn Quốc, Châu Âu; Chăm sóc và giải quyết các tình huống phát sinh của khách hàng."
  },
  {
    _id: "job-2",
    title: "Chuyên Viên Tư Vấn & Bán Tour Du Lịch",
    department: "Kinh doanh",
    location: "Hà Nội",
    salary: "12.000.000đ + Hoa hồng",
    type: "Toàn thời gian",
    description: "Tư vấn các gói tour trong và ngoài nước; Chăm sóc khách hàng cá nhân và doanh nghiệp."
  },
  {
    _id: "job-3",
    title: "Kỹ Sư Automation Test (Playwright / Cypress)",
    department: "Công nghệ thông tin",
    location: "TP. Hồ Chí Minh (Hybrid)",
    salary: "20.000.000đ - 35.000.000đ",
    type: "Toàn thời gian",
    description: "Xây dựng automation framework cho hệ thống đặt tour; Thiết kế test script với Playwright, tối ưu hóa các locator và pipeline CI/CD."
  }
];

// Hàm lấy danh sách tour
export async function fetchTours(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/tours?${query}`);
    if (!res.ok) throw new Error("API call failed");
    const json = await res.json();
    return json.data || fallbackTours;
  } catch (e) {
    console.warn("Backend API unavailable, using fallback tours", e);
    let result = [...fallbackTours];
    if (params.category) {
      result = result.filter(t => t.categorySlug === params.category);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(s));
    }
    if (params.minPrice) {
      result = result.filter(t => t.priceNewAdult >= Number(params.minPrice));
    }
    if (params.maxPrice) {
      result = result.filter(t => t.priceNewAdult <= Number(params.maxPrice));
    }
    if (params.sort === "price-asc") {
      result.sort((a, b) => a.priceNewAdult - b.priceNewAdult);
    } else if (params.sort === "price-desc") {
      result.sort((a, b) => b.priceNewAdult - a.priceNewAdult);
    }
    return result;
  }
}

// Hàm lấy chi tiết tour
export async function fetchTourBySlug(slug) {
  try {
    const res = await fetch(`/api/tours/${slug}`);
    if (!res.ok) throw new Error("API call failed");
    const json = await res.json();
    return json.data;
  } catch (e) {
    console.warn("Using fallback tour for slug:", slug);
    return fallbackTours.find(t => t.slug === slug) || fallbackTours[0];
  }
}

// Hàm gửi liên hệ
export async function submitContact(data) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    return { code: 200, message: "Gửi liên hệ thành công (Demo offline)!" };
  }
}

// Hàm tạo đơn hàng
export async function submitOrder(orderData) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return await res.json();
  } catch (e) {
    return { code: 200, orderCode: "ORD" + Date.now().toString().slice(-6), message: "Đặt tour thành công (Demo offline)!" };
  }
}

// Hàm đăng nhập
export async function loginUser(email, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (e) {
    if ((email === "admin@viettravel.vn" || email === "user@viettravel.vn") && password) {
      return { code: 200, token: "demo-token-" + Date.now(), user: { email, fullName: "Người dùng Thử nghiệm" }, message: "Đăng nhập thành công!" };
    }
    return { code: 400, message: "Email hoặc mật khẩu không chính xác!" };
  }
}
