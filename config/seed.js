const bcrypt = require("bcryptjs");
const Role = require("../models/role.model");
const Account = require("../models/account-admin.model");
const Setting = require("../models/setting-website-info.model");
const City = require("../models/city.model");
const Category = require("../models/category.model");
const Tour = require("../models/tour.model");
const Job = require("../models/job.model");
const Application = require("../models/application.model");
const seedInternationalTours = require("./seed-international");

module.exports = async function seed() {
  await seedInternationalTours();
  if (!await Setting.findOne({})) await new Setting({ websiteName:"VietTravel", phone:"1900 8686", email:"hello@viettravel.vn", address:"123 Nguyễn Huệ, Quận 1, TP.HCM", logo:"/assets/images/logo.png", favicon:"/assets/images/logo.png" }).save();
  let adminRole = await Role.findOne({ name:"Quản trị viên" });
  if (!adminRole) { adminRole = new Role({ name:"Quản trị viên", description:"Toàn quyền hệ thống", permissions:["dashboard-view","category-view","category-create","category-edit","category-delete","category-trash","tour-view","tour-create","tour-edit","tour-delete","tour-trash","order-view","order-edit","recruitment-view","recruitment-manage"] }); await adminRole.save(); }
  let hrRole = await Role.findOne({ name:"Nhân sự" });
  if (!hrRole) { hrRole = new Role({ name:"Nhân sự", description:"Quản lý tuyển dụng", permissions:["recruitment-view","recruitment-manage"] }); await hrRole.save(); }
  if (!await Account.findOne({email:"admin@viettravel.vn"})) await new Account({fullName:"Quản trị VietTravel",email:"admin@viettravel.vn",phone:"0909000001",role:adminRole._id,positionCompany:"Quản trị viên",password:await bcrypt.hash("Admin@123",10),status:"active"}).save();
  if (!await Account.findOne({email:"hr@viettravel.vn"})) await new Account({fullName:"Nguyễn Minh Anh",email:"hr@viettravel.vn",phone:"0909000002",role:hrRole._id,positionCompany:"Chuyên viên nhân sự",password:await bcrypt.hash("Hr@123456",10),status:"active"}).save();
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
};
