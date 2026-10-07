const bcrypt = require("bcryptjs");
const Role = require("../models/role.model");
const Account = require("../models/account-admin.model");
const Setting = require("../models/setting-website-info.model");
const City = require("../models/city.model");
const Category = require("../models/category.model");
const Tour = require("../models/tour.model");
const Job = require("../models/job.model");
const Application = require("../models/application.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Contact = require("../models/contact.model");
const seedInternationalTours = require("./seed-international");

module.exports = async function seed() {
  await seedInternationalTours();
  if (!await Setting.findOne({})) await new Setting({ websiteName:"VietTravel", phone:"1900 8686", email:"hello@viettravel.vn", address:"123 Nguyễn Huệ, Quận 1, TP.HCM", logo:"/assets/images/logo.png", favicon:"/assets/images/logo.png" }).save();
  const allAdminPerms = [
    "dashboard-view",
    "category-view", "category-create", "category-edit", "category-delete", "category-trash",
    "tour-view", "tour-create", "tour-edit", "tour-delete", "tour-trash",
    "order-view", "order-edit", "order-delete", "order-trash",
    "recruitment-view", "recruitment-create", "recruitment-edit", "recruitment-delete", "recruitment-manage"
  ];
  let adminRole = await Role.findOne({ name:"Quản trị viên" });
  if (!adminRole) {
    adminRole = new Role({ name:"Quản trị viên", description:"Toàn quyền hệ thống", permissions: allAdminPerms });
    await adminRole.save();
  } else {
    const missing = allAdminPerms.filter(p => !adminRole.permissions.includes(p));
    if (missing.length > 0) {
      adminRole.permissions = [...adminRole.permissions, ...missing];
      await adminRole.save();
    }
  }

  const hrPerms = ["recruitment-view", "recruitment-create", "recruitment-edit", "recruitment-delete", "recruitment-manage"];
  let hrRole = await Role.findOne({ name:"Nhân sự" });
  if (!hrRole) {
    hrRole = new Role({ name:"Nhân sự", description:"Quản lý tuyển dụng", permissions: hrPerms });
    await hrRole.save();
  } else {
    const missing = hrPerms.filter(p => !hrRole.permissions.includes(p));
    if (missing.length > 0) {
      hrRole.permissions = [...hrRole.permissions, ...missing];
      await hrRole.save();
    }
  }
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || "admin@viettravel.vn";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminFullName = process.env.ADMIN_FULL_NAME || "Quản trị VietTravel";
  const adminPhone = process.env.ADMIN_PHONE || "0909000001";
  const adminPosition = process.env.ADMIN_POSITION || "Quản trị viên";
  let adminAccount = await Account.findOne({ seedKey: "admin" }) || await Account.findOne({ email: adminEmail }) || await Account.findOne({ phone: "0909000001" });
  if (!adminAccount) {
    adminAccount = new Account({
      fullName: adminFullName,
      seedKey: "admin",
      email: adminEmail,
      phone: adminPhone,
      role: adminRole._id,
      positionCompany: adminPosition,
      password: await bcrypt.hash(adminPassword, 10),
      status: "active"
    });
    await adminAccount.save();
  } else {
    let needUpdate = false;
    for (const [field, value] of Object.entries({ seedKey: "admin", fullName: adminFullName, email: adminEmail, phone: adminPhone, positionCompany: adminPosition })) {
      if (adminAccount[field] !== value) {
        adminAccount[field] = value;
        needUpdate = true;
      }
    }
    if (adminPassword && !await bcrypt.compare(adminPassword, adminAccount.password)) {
      adminAccount.password = await bcrypt.hash(adminPassword, 10);
      needUpdate = true;
    }
    if (!adminAccount.role) {
      adminAccount.role = adminRole._id;
      needUpdate = true;
    }
    if (adminAccount.status !== "active") {
      adminAccount.status = "active";
      needUpdate = true;
    }
    if (needUpdate) {
      await adminAccount.save();
    }
  }

  const hrEmail = process.env.HR_EMAIL || process.env.HR_USERNAME || "hr@viettravel.vn";
  const hrPassword = process.env.HR_PASSWORD || "Hr@123456";
  const hrFullName = process.env.HR_FULL_NAME || "Nguyễn Minh Anh";
  const hrPhone = process.env.HR_PHONE || "0909000002";
  const hrPosition = process.env.HR_POSITION || "Chuyên viên nhân sự";
  let hrAccount = await Account.findOne({ seedKey: "hr" }) || await Account.findOne({ email: hrEmail }) || await Account.findOne({ phone: "0909000002" });
  if (!hrAccount) {
    hrAccount = new Account({
      fullName: hrFullName,
      seedKey: "hr",
      email: hrEmail,
      phone: hrPhone,
      role: hrRole._id,
      positionCompany: hrPosition,
      password: await bcrypt.hash(hrPassword, 10),
      status: "active"
    });
    await hrAccount.save();
  } else {
    let needUpdate = false;
    for (const [field, value] of Object.entries({ seedKey: "hr", fullName: hrFullName, email: hrEmail, phone: hrPhone, positionCompany: hrPosition })) {
      if (hrAccount[field] !== value) {
        hrAccount[field] = value;
        needUpdate = true;
      }
    }
    if (hrPassword && !await bcrypt.compare(hrPassword, hrAccount.password)) {
      hrAccount.password = await bcrypt.hash(hrPassword, 10);
      needUpdate = true;
    }
    if (!hrAccount.role) {
      hrAccount.role = hrRole._id;
      needUpdate = true;
    }
    if (hrAccount.status !== "active") {
      hrAccount.status = "active";
      needUpdate = true;
    }
    if (needUpdate) {
      await hrAccount.save();
    }
  }
  const cityNames=["Hà Nội","TP. Hồ Chí Minh","Đà Nẵng","Đà Lạt","Phú Quốc"];
  for(const name of cityNames) if(!await City.findOne({name})) await new City({name}).save();
  let category=await Category.findOne({name:"Tour trong nước"});
  if(!category){
    category=new Category({name:"Tour trong nước",position:1,status:"active",avatar:"/assets/images/tours/da-nang-hoi-an.jpg"});
    await category.save();
  } else if (!category.avatar) {
    category.avatar="/assets/images/tours/da-nang-hoi-an.jpg";
    await category.save();
  }
  // Seed domestic tours independently. International tours are created first,
  // so checking the total tour count would incorrectly skip this category.
  if(await Tour.countDocuments({category:category._id})===0){const cities=await City.find({});const tourSeeds=[
    {name:"Khám phá Phú Quốc",image:"phu-quoc.jpg"},
    {name:"Đà Nẵng - Hội An",image:"da-nang-hoi-an.jpg"},
    {name:"Hà Nội - Hạ Long",image:"ha-noi-ha-long.jpg"},
    {name:"Đà Lạt mộng mơ",image:"da-lat.jpg"},
    {name:"Miền Tây sông nước",image:"mien-tay.jpg"},
    {name:"Nha Trang biển xanh",image:"nha-trang.jpg"},
    {name:"Huế di sản",image:"hue.jpg"},
    {name:"Sapa mùa mây",image:"sapa.jpg"}
  ];for(let i=0;i<tourSeeds.length;i++){const image=`/assets/images/tours/${tourSeeds[i].image}`;await new Tour({name:tourSeeds[i].name,category:category._id,position:i+1,status:"active",avatar:image,priceAdult:5000000+i*300000,priceChildren:3500000,priceBaby:1000000,priceNewAdult:4500000+i*300000,priceNewChildren:3200000,priceNewBaby:900000,stockAdult:20,stockChildren:10,stockBaby:5,locations:cities.slice(0,2).map(c=>c._id),time:"3 ngày 2 đêm",vehicle:"Máy bay",departureDate:new Date(Date.now()+(i+5)*86400000).toISOString(),information:"Hành trình trọn gói cùng VietTravel, dịch vụ tận tâm và lịch trình hấp dẫn.",schedules:[],images:[image]}).save();}}
  const jobSeeds = [
    {
      title:"Nhân viên Điều hành Tour", slug:"nhan-vien-dieu-hanh-tour", department:"Phòng Điều hành", location:"TP. Hồ Chí Minh", quantity:1,
      poster:"/assets/images/recruitment/tour-operator.jpg",
      supervisor:"Trưởng nhóm/Trưởng bộ phận Điều hành",
      jobDescription:"Tiếp nhận thông tin chương trình tour, tổ chức và điều phối các dịch vụ cần thiết nhằm đảm bảo tour được thực hiện đúng lịch trình, chất lượng và yêu cầu của khách hàng. Phối hợp với nhà cung cấp, hướng dẫn viên và các bộ phận liên quan để theo dõi, xử lý các vấn đề phát sinh trong quá trình thực hiện tour.",
      responsibilities:["Tiếp nhận thông tin tour từ bộ phận Kinh doanh Tour; kiểm tra lịch trình và kế hoạch thực hiện.","Liên hệ, đặt và xác nhận phương tiện vận chuyển, khách sạn, nhà hàng, vé tham quan và hướng dẫn viên.","Chuẩn bị booking, danh sách khách, lịch trình và thông tin dịch vụ trước ngày khởi hành.","Phối hợp với hướng dẫn viên, nhà cung cấp và các bộ phận liên quan; theo dõi tour và cập nhật tình hình.","Xử lý thay đổi lịch trình, dịch vụ hoặc yêu cầu phát sinh của khách hàng.","Kiểm tra chi phí, hóa đơn; đối soát, quyết toán và tiếp nhận phản hồi sau tour.","Báo cáo tình hình thực hiện tour và thực hiện nhiệm vụ khác theo yêu cầu của cấp trên."],
      requirements:["Tốt nghiệp Cao đẳng/Đại học; ưu tiên ngành Du lịch, Quản trị dịch vụ du lịch và lữ hành hoặc ngành liên quan.","Hiểu quy trình điều hành tour, xây dựng chương trình, đặt và kiểm soát dịch vụ; có kiến thức cơ bản về quản lý chi phí tour.","Ưu tiên có kinh nghiệm điều hành tour hoặc vận hành dịch vụ du lịch; chấp nhận ứng viên mới tốt nghiệp có thực tập phù hợp.","Có kỹ năng lập kế hoạch, tổ chức, điều phối, giao tiếp, xử lý tình huống, quản lý thời gian và kiểm soát thông tin.","Có khả năng giao tiếp tiếng Anh cơ bản; ngoại ngữ tốt là một lợi thế.","Trung thực, trách nhiệm, chủ động, cẩn thận, linh hoạt, làm việc nhóm tốt và chịu được áp lực."],
      workEnvironment:["Làm việc chủ yếu tại văn phòng Vietravel và thường xuyên phối hợp với nhà cung cấp, hướng dẫn viên, các bộ phận liên quan.","Sử dụng máy tính, điện thoại, email và các công cụ hỗ trợ điều hành tour.","Có thể làm việc ngoài giờ khi tour đang diễn ra hoặc có tình huống phát sinh; khối lượng công việc tăng vào mùa cao điểm."]
    },
    {
      title:"Nhân viên Kinh doanh Tour – Sales Tour", slug:"nhan-vien-sale-tour", department:"Phòng Kinh doanh", location:"TP. Hồ Chí Minh", quantity:1,
      poster:"/assets/images/recruitment/sales-tour.jpg",
      supervisor:"Trưởng nhóm/Trưởng phòng Kinh doanh",
      jobDescription:"Tìm kiếm và tiếp cận khách hàng có nhu cầu du lịch, tư vấn các chương trình tour phù hợp, thực hiện hoạt động bán tour và chăm sóc khách hàng nhằm hoàn thành chỉ tiêu kinh doanh và đảm bảo chất lượng phục vụ.",
      responsibilities:["Tìm kiếm, tiếp cận khách hàng tiềm năng; tiếp nhận và tìm hiểu nhu cầu, ngân sách của khách hàng.","Tư vấn chương trình tour, lịch trình, giá và các dịch vụ liên quan; báo giá và giải đáp thắc mắc.","Hỗ trợ khách hàng đăng ký tour, thực hiện thủ tục, đặt cọc và thanh toán.","Theo dõi, chăm sóc khách hàng trước, trong và sau chuyến đi; tiếp nhận phản hồi và phối hợp xử lý phát sinh.","Phối hợp với điều hành tour, kế toán, marketing và các bộ phận liên quan.","Cập nhật thông tin khách hàng, báo cáo kết quả kinh doanh và thực hiện chỉ tiêu doanh số."],
      requirements:["Tốt nghiệp Cao đẳng/Đại học; ưu tiên ngành Du lịch, Quản trị dịch vụ du lịch và lữ hành, Quản trị kinh doanh, Marketing hoặc ngành liên quan.","Có kiến thức cơ bản về tuyến điểm, chương trình tour, dịch vụ lữ hành, quy trình tư vấn, bán tour và chăm sóc khách hàng.","Ưu tiên có kinh nghiệm kinh doanh, tư vấn, chăm sóc khách hàng hoặc du lịch - lữ hành.","Giao tiếp, lắng nghe, tư vấn, thuyết phục và xử lý tình huống tốt; biết làm việc nhóm, quản lý thời gian và sử dụng tin học văn phòng.","Có khả năng giao tiếp tiếng Anh cơ bản; tiếng Anh giao tiếp tốt là một lợi thế.","Trung thực, trách nhiệm, chủ động, năng động, cẩn thận, kiên nhẫn, có tinh thần phục vụ và chịu được áp lực doanh số."],
      workEnvironment:["Làm việc chủ yếu tại văn phòng hoặc điểm giao dịch Vietravel; trao đổi với khách hàng trực tiếp, qua điện thoại, email và các kênh trực tuyến.","Sử dụng máy tính và các công cụ hỗ trợ bán hàng; có thể gặp khách bên ngoài hoặc tham gia sự kiện du lịch.","Công việc chịu áp lực doanh số và có thể tăng khối lượng vào mùa cao điểm du lịch."]
    }
  ];
  const allowedJobTitles = new Set(jobSeeds.map(item => item.title));
  for (const job of await Job.find({})) {
    if (!allowedJobTitles.has(job.title)) await Job.deleteOne({_id:job._id});
  }
  for (let i=0;i<jobSeeds.length;i++) {
    const item=jobSeeds[i];
    let job=await Job.findOne({title:item.title});
    if (!job) job=new Job({title:item.title});
    Object.assign(job,item,{deadline:"2026-09-30",status:"active"});
    await job.save();
  }
  const operationsJob = await Job.findOne({title:"Nhân viên Điều hành Tour"});
  const salesJob = await Job.findOne({title:"Nhân viên Kinh doanh Tour – Sales Tour"});
  const applicationSeeds = [
    {
      fullName:"Trần Hoàng Anh", email:"tranhoanganh2208@gmail.com", phone:"0377 972 347",
      address:"Số 77 Bạch Đằng, TP. Hồ Chí Minh", job:operationsJob,
      cvPath:"/demo-cv/CV ỨNg Viên A (2).pdf", cvOriginalName:"CV Trần Hoàng Anh.pdf",
      profileSummary:"3 năm kinh nghiệm điều hành tour; hiện là trưởng nhóm tại Apex Travel; IELTS 7.0, HSK 5; tốt nghiệp Quản trị dịch vụ du lịch và lữ hành, GPA 3.7/4.0."
    },
    {
      fullName:"Nguyễn Minh Khang", email:"nguyenminhkhang2004@gmail.com", phone:"0377 077 277",
      address:"Số 123 Cô Giang, TP. Hồ Chí Minh", job:operationsJob,
      cvPath:"/demo-cv/CV Ứng Viên B (1).pdf", cvOriginalName:"CV Nguyễn Minh Khang.pdf",
      profileSummary:"Sinh viên Quản trị Du lịch và Lữ hành, GPA 3.5/4; từng thực tập điều hành tour Đà Nẵng - Hội An - Huế; IELTS 8.0 và MOS."
    },
    {
      fullName:"Nguyễn Thị Hồng Nhung", email:"hongnhung.sale97@gmail.com", phone:"0908 666 345",
      dateOfBirth:"20/10/1997", address:"Quận Tân Bình, TP. Hồ Chí Minh", job:salesJob,
      cvPath:"/demo-cv/CV ỨNG VIÊN C.pdf", cvOriginalName:"CV Nguyễn Thị Hồng Nhung.pdf",
      profileSummary:"5 năm kinh nghiệm tư vấn và kinh doanh tour; đạt trung bình 118% KPI, doanh thu khoảng 850 triệu đồng/quý; IELTS 6.0, HSK 3."
    },
    {
      fullName:"Trần Hoàng Diệu", email:"hoangdieu.tran99@gmail.com", phone:"0937 080 812",
      dateOfBirth:"23/06/1999", address:"Quận Bình Thạnh, TP. Hồ Chí Minh", job:salesJob,
      cvPath:"/demo-cv/CV ỨNG VIÊN D.pdf", cvOriginalName:"CV Trần Hoàng Diệu.pdf",
      profileSummary:"1,5 năm kinh nghiệm kinh doanh và chăm sóc khách hàng; từng đạt 120% chỉ tiêu trong 3 quý liên tiếp; có kỹ năng telesale và quản lý khách hàng qua CRM."
    }
  ];
  for (const item of applicationSeeds) {
    if (!item.job) continue;
    const {job,...candidate}=item;
    let application=await Application.findOne({email:item.email,cvPath:item.cvPath});
    if (!application) application=new Application({status:"new"});
    Object.assign(application,candidate,{jobId:job._id,jobTitle:job.title});
    await application.save();
  }

  if (await User.countDocuments({}) === 0) {
    const userSeeds = [
      { fullName: "Lê Văn An", email: "an.le@gmail.com", phone: "0912345678", address: "Số 45 Lê Duẩn, Quận 1, TP.HCM", status: "active", avatar: "/admin/assets/images/avatar.jpg" },
      { fullName: "Trần Thị Mai", email: "mai.tran@gmail.com", phone: "0987654321", address: "12 Huỳnh Thúc Kháng, Ba Đình, Hà Nội", status: "active", avatar: "/admin/assets/images/avatar.jpg" },
      { fullName: "Phạm Hoàng Nam", email: "nam.pham@yahoo.com", phone: "0905123456", address: "88 Trần Phú, Hải Châu, Đà Nẵng", status: "active", avatar: "/admin/assets/images/avatar.jpg" },
      { fullName: "Đỗ Quỳnh Nga", email: "nga.do@outlook.com", phone: "0934567890", address: "25 Hai Bà Trưng, TP. Đà Lạt", status: "active", avatar: "/admin/assets/images/avatar.jpg" },
      { fullName: "Hoàng Minh Đức", email: "duc.hoang@gmail.com", phone: "0978901234", address: "104 Nguyễn Thị Minh Khai, Nha Trang", status: "active", avatar: "/admin/assets/images/avatar.jpg" },
      { fullName: "Vũ Bích Thảo", email: "thao.vu@gmail.com", phone: "0945678901", address: "56 Trần Hưng Đạo, TP. Phú Quốc", status: "inactive", avatar: "/admin/assets/images/avatar.jpg" }
    ];
    for (const u of userSeeds) {
      await new User(u).save();
    }
  }

  if (await Contact.countDocuments({}) === 0) {
    const contactSeeds = [
      { email: "khachhang1@gmail.com" },
      { email: "tuvan.tour@vietravel.vn" },
      { email: "hoangminh@gmail.com" },
      { email: "thuha.travel@outlook.com" }
    ];
    for (const c of contactSeeds) {
      await new Contact(c).save();
    }
  }

  if (await Order.countDocuments({}) === 0) {
    const tours = await Tour.find({ deleted: false, status: "active" });
    const cities = await City.find({});
    if (tours.length > 0) {
      const cityId = cities.length > 0 ? cities[0]._id : "hcm";
      const cityName = cities.length > 0 ? cities[0].name : "TP. Hồ Chí Minh";
      const now = new Date();

      const tour1 = tours[0];
      const tour2 = tours.length > 1 ? tours[1] : tours[0];
      const tour3 = tours.length > 2 ? tours[2] : tours[0];

      const orderSeeds = [
        {
          orderCode: "OD100001",
          fullName: "Lê Văn An",
          phone: "0912345678",
          note: "Yêu cầu phòng hướng biển, tầng cao",
          items: [{
            tourId: tour1._id,
            name: tour1.name,
            avatar: tour1.avatar,
            priceNewAdult: tour1.priceNewAdult || 4500000,
            quantityAdult: 2,
            priceNewChildren: tour1.priceNewChildren || 3200000,
            quantityChildren: 1,
            priceNewBaby: 0,
            quantityBaby: 0,
            departureDate: tour1.departureDate,
            locationFrom: cityId,
            locationFromName: cityName
          }],
          subTotal: ((tour1.priceNewAdult || 4500000) * 2) + (tour1.priceNewChildren || 3200000),
          discount: 500000,
          total: ((tour1.priceNewAdult || 4500000) * 2) + (tour1.priceNewChildren || 3200000) - 500000,
          paymentMethod: "vnpay",
          paymentStatus: "paid",
          status: "done",
          createdAt: new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - 2), 10, 30).toISOString()
        },
        {
          orderCode: "OD100002",
          fullName: "Trần Thị Mai",
          phone: "0987654321",
          note: "Có em bé nhỏ, cần chuẩn bị nôi",
          items: [{
            tourId: tour2._id,
            name: tour2.name,
            avatar: tour2.avatar,
            priceNewAdult: tour2.priceNewAdult || 4800000,
            quantityAdult: 2,
            priceNewChildren: 0,
            quantityChildren: 0,
            priceNewBaby: tour2.priceNewBaby || 900000,
            quantityBaby: 1,
            departureDate: tour2.departureDate,
            locationFrom: cityId,
            locationFromName: cityName
          }],
          subTotal: ((tour2.priceNewAdult || 4800000) * 2) + (tour2.priceNewBaby || 900000),
          discount: 0,
          total: ((tour2.priceNewAdult || 4800000) * 2) + (tour2.priceNewBaby || 900000),
          paymentMethod: "momo",
          paymentStatus: "paid",
          status: "initial",
          createdAt: new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - 1), 14, 15).toISOString()
        },
        {
          orderCode: "OD100003",
          fullName: "Phạm Hoàng Nam",
          phone: "0905123456",
          note: "Liên hệ giờ hành chính",
          items: [{
            tourId: tour3._id,
            name: tour3.name,
            avatar: tour3.avatar,
            priceNewAdult: tour3.priceNewAdult || 5100000,
            quantityAdult: 1,
            priceNewChildren: 0,
            quantityChildren: 0,
            priceNewBaby: 0,
            quantityBaby: 0,
            departureDate: tour3.departureDate,
            locationFrom: cityId,
            locationFromName: cityName
          }],
          subTotal: tour3.priceNewAdult || 5100000,
          discount: 200000,
          total: (tour3.priceNewAdult || 5100000) - 200000,
          paymentMethod: "money",
          paymentStatus: "unpaid",
          status: "initial",
          createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 20).toISOString()
        }
      ];

      for (const ord of orderSeeds) {
        await new Order(ord).save();
      }
    }
  }

};
