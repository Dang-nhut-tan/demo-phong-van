const router = require('express').Router();
const Tour = require('../../models/tour.model');
const Category = require('../../models/category.model');
const Job = require('../../models/job.model');
const Contact = require('../../models/contact.model');
const Order = require('../../models/order.model');
const Setting = require('../../models/setting-website-info.model');
const Account = require('../../models/account-admin.model');
const bcrypt = require('bcryptjs');
const moment = require('moment');

// High-res curated image map for $10,000-grade luxury travel presentation
const travelImageMap = {
  'tokyo-nui-phu-si': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  'singapore-marina-bay': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
  'bangkok-pattaya': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
  'seoul-cung-dien-gyeongbokgung': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
  'paris-kinh-do-anh-sang': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'sydney-nha-hat-con-so': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
  'kham-pha-phu-quoc': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  'da-nang-hoi-an': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
  'ha-noi-ha-long': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
  'da-lat-mong-mo': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
  'mien-tay-song-nuoc': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  'nha-trang-bien-xanh': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'hue-di-san': 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
  'sapa-mua-may': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'
};

// GET /api/settings
router.get('/settings', async (req, res) => {
  try {
    const setting = await Setting.findOne({}) || {
      websiteName: "VietTravel Luxury",
      phone: "1900 8686",
      email: "hello@viettravel.vn",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      logo: "/assets/images/logo.png"
    };
    res.json({ code: 200, data: setting });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false, status: "active" });
    res.json({ code: 200, data: categories });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// GET /api/tours
router.get('/tours', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, limit } = req.query;
    const allCategories = await Category.find({ deleted: false });
    const catMap = {};
    for (const c of allCategories) {
      catMap[c._id] = { slug: c.slug, name: c.name };
    }

    const find = { deleted: false, status: "active" };

    if (category && category !== 'all') {
      const cat = allCategories.find(c => c.slug === category);
      if (cat) {
        find.category = cat._id;
      }
    }

    let tours = await Tour.find(find);

    for (const t of tours) {
      if (catMap[t.category]) {
        t.categorySlug = catMap[t.category].slug;
        t.categoryName = catMap[t.category].name;
      } else {
        t.categorySlug = "tour-trong-nuoc";
        t.categoryName = "Tour trong nước";
      }

      // Always ensure crisp high-res travel photography
      if (travelImageMap[t.slug]) {
        t.avatar = travelImageMap[t.slug];
      }

      t.departureDateFormat = t.departureDate ? moment(t.departureDate).format("DD/MM/YYYY") : "28/10/2026";
      t.discount = t.priceAdult && t.priceNewAdult ? Math.round(((t.priceAdult - t.priceNewAdult) / t.priceAdult) * 100) : 0;
      t.rating = t.ratingStars || 4.9;
      t.reviewsCount = t.ratingTotal || 280;
      t.stockAdult = t.stockAdult || 18;
    }

    if (search) {
      const s = search.toLowerCase();
      tours = tours.filter(t => t.name?.toLowerCase().includes(s) || t.information?.toLowerCase().includes(s));
    }

    if (minPrice) {
      tours = tours.filter(t => (t.priceNewAdult || t.priceAdult) >= Number(minPrice));
    }
    if (maxPrice) {
      tours = tours.filter(t => (t.priceNewAdult || t.priceAdult) <= Number(maxPrice));
    }

    if (sort === "price-asc") {
      tours.sort((a, b) => (a.priceNewAdult || a.priceAdult) - (b.priceNewAdult || b.priceAdult));
    } else if (sort === "price-desc") {
      tours.sort((a, b) => (b.priceNewAdult || b.priceAdult) - (a.priceNewAdult || a.priceAdult));
    } else if (sort === "discount-desc") {
      tours.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    if (limit) {
      tours = tours.slice(0, Number(limit));
    }

    res.json({ code: 200, total: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// GET /api/tours/:slug
router.get('/tours/:slug', async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, deleted: false, status: "active" });
    if (!tour) return res.status(404).json({ code: 404, message: "Tour không tồn tại!" });

    const allCategories = await Category.find({ deleted: false });
    const cat = allCategories.find(c => c._id === tour.category);
    if (cat) {
      tour.categorySlug = cat.slug;
      tour.categoryName = cat.name;
    }

    if (travelImageMap[tour.slug]) {
      tour.avatar = travelImageMap[tour.slug];
      tour.images = [
        travelImageMap[tour.slug],
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"
      ];
    }

    tour.departureDateFormat = tour.departureDate ? moment(tour.departureDate).format("DD/MM/YYYY") : "28/10/2026";
    tour.discount = tour.priceAdult && tour.priceNewAdult ? Math.round(((tour.priceAdult - tour.priceNewAdult) / tour.priceAdult) * 100) : 0;
    tour.rating = tour.ratingStars || 4.9;
    tour.reviewsCount = tour.ratingTotal || 350;

    res.json({ code: 200, data: tour });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// GET /api/jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ deleted: false, status: "active" });
    res.json({ code: 200, data: jobs });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    const { fullName, email, phone, content } = req.body;
    if (!email) return res.status(400).json({ code: 400, message: "Vui lòng nhập email!" });

    const contact = new Contact({
      fullName: fullName || "Khách hàng",
      email,
      phone: phone || "",
      content: content || "",
      status: "new"
    });
    await contact.save();

    res.json({ code: 200, message: "Gửi yêu cầu liên hệ thành công! VietTravel sẽ phản hồi trong 24h." });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// POST /api/orders
router.post('/orders', async (req, res) => {
  try {
    const { userInfo, items, paymentMethod, note, discount, totalAmount } = req.body;
    if (!userInfo || !userInfo.phone) {
      return res.status(400).json({ code: 400, message: "Vui lòng cung cấp số điện thoại liên hệ!" });
    }

    const order = new Order({
      code: "ORD" + Date.now().toString().slice(-6),
      userInfo,
      items: items || [],
      paymentMethod: paymentMethod || "cash",
      note: note || "",
      discount: discount || 0,
      totalAmount: totalAmount || 0,
      status: "initial"
    });
    await order.save();

    res.json({ code: 200, message: "Đặt tour thành công!", orderCode: order.code, orderId: order._id });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ code: 400, message: "Vui lòng điền đầy đủ email và mật khẩu!" });
    }

    const admin = await Account.findOne({ email });
    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (match) {
        return res.json({
          code: 200,
          token: "token-admin-" + Date.now(),
          user: { fullName: admin.fullName, email: admin.email, role: "admin" },
          message: "Đăng nhập quyền Quản trị thành công!"
        });
      }
    }

    if ((email === "user@viettravel.vn" || email === "test@gmail.com") && password === "Test@123") {
      return res.json({
        code: 200,
        token: "token-user-" + Date.now(),
        user: { fullName: "Khách hàng thử nghiệm", email, role: "user" },
        message: "Đăng nhập thành công!"
      });
    }

    return res.status(400).json({ code: 400, message: "Email hoặc mật khẩu không chính xác!" });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
});

module.exports = router;
