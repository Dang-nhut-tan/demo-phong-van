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
    { title:"Nhân viên điều hành tour", slug:"nhan-vien-dieu-hanh-tour", department:"Phòng Điều hành", location:"TP. Hồ Chí Minh", quantity:2 },
    { title:"Nhân viên Sale tour", slug:"nhan-vien-sale-tour", department:"Phòng Kinh doanh", location:"TP. Hồ Chí Minh", quantity:3 }
  ];
  const allowedJobTitles = new Set(jobSeeds.map(item => item.title));
  for (const job of await Job.find({})) {
    if (!allowedJobTitles.has(job.title)) await Job.deleteOne({_id:job._id});
  }
  for (let i=0;i<jobSeeds.length;i++) {
    const item=jobSeeds[i];
    let job=await Job.findOne({title:item.title});
    if (!job) job=new Job({title:item.title});
    Object.assign(job,item,{
        jobDescription:`Tư vấn và thực hiện các công việc của vị trí ${item.title}, phối hợp cùng các phòng ban để phục vụ khách hàng.`,
        requirements:"Giao tiếp tốt, chủ động, có tinh thần trách nhiệm và yêu thích lĩnh vực du lịch.",
        benefits:"Thu nhập cạnh tranh; thưởng hiệu quả; bảo hiểm đầy đủ; ưu đãi tour dành cho nhân viên.",
        deadline:new Date(Date.now()+(20+i*5)*86400000).toISOString().slice(0,10),
        status:"active"
    });
    await job.save();
  }
  const operationsJob = await Job.findOne({title:"Nhân viên điều hành tour"});
  const salesJob = await Job.findOne({title:"Nhân viên Sale tour"});
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
    if (!item.job || await Application.findOne({email:item.email,cvPath:item.cvPath})) continue;
    const {job,...candidate}=item;
    await new Application({...candidate,jobId:job._id,jobTitle:job.title,status:"new"}).save();
  }
};
