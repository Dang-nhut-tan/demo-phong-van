const bcrypt = require("bcryptjs");
const Role = require("../models/role.model");
const Account = require("../models/account-admin.model");
const Setting = require("../models/setting-website-info.model");
const City = require("../models/city.model");
const Category = require("../models/category.model");
const Tour = require("../models/tour.model");
const Job = require("../models/job.model");
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
  let category=await Category.findOne({name:"Tour trong nước"}); if(!category){category=new Category({name:"Tour trong nước",position:1,status:"active"});await category.save();}
  if(await Tour.countDocuments({})===0){const cities=await City.find({});const tourSeeds=[
    {name:"Khám phá Phú Quốc",image:"phu-quoc.jpg"},
    {name:"Đà Nẵng - Hội An",image:"da-nang-hoi-an.jpg"},
    {name:"Hà Nội - Hạ Long",image:"ha-noi-ha-long.jpg"},
    {name:"Đà Lạt mộng mơ",image:"da-lat.jpg"},
    {name:"Miền Tây sông nước",image:"mien-tay.jpg"},
    {name:"Nha Trang biển xanh",image:"nha-trang.jpg"},
    {name:"Huế di sản",image:"hue.jpg"},
    {name:"Sapa mùa mây",image:"sapa.jpg"}
  ];for(let i=0;i<tourSeeds.length;i++){const image=`/assets/images/tours/${tourSeeds[i].image}`;await new Tour({name:tourSeeds[i].name,category:category._id,position:i+1,status:"active",avatar:image,priceAdult:5000000+i*300000,priceChildren:3500000,priceBaby:1000000,priceNewAdult:4500000+i*300000,priceNewChildren:3200000,priceNewBaby:900000,stockAdult:20,stockChildren:10,stockBaby:5,locations:cities.slice(0,2).map(c=>c._id),time:"3 ngày 2 đêm",vehicle:"Máy bay",departureDate:new Date(Date.now()+(i+5)*86400000).toISOString(),information:"Hành trình trọn gói cùng VietTravel, dịch vụ tận tâm và lịch trình hấp dẫn.",schedules:[],images:[image]}).save();}}
  const titles=["Chuyên viên tuyển dụng","Nhân viên điều hành tour","Hướng dẫn viên du lịch","Nhân viên kinh doanh tour","Chuyên viên C&B","Thực tập sinh nhân sự","Nhân viên chăm sóc khách hàng","Digital Marketing Executive","Content Marketing","Kế toán tổng hợp","Nhân viên thiết kế tour","Trưởng nhóm kinh doanh","Chuyên viên đào tạo","Nhân viên vé máy bay","Nhân viên visa","Lễ tân văn phòng","IT Support","Chuyên viên pháp chế","Nhân viên hành chính","Trưởng phòng nhân sự"];
  if(await Job.countDocuments({})===0) for(let i=0;i<titles.length;i++) await new Job({title:titles[i],department:i%4===0?"Phòng Nhân sự":i%4===1?"Phòng Điều hành":i%4===2?"Phòng Kinh doanh":"Khối Văn phòng",location:i%3===0?"Hà Nội":"TP. Hồ Chí Minh",quantity:i%3+1,jobDescription:`Thực hiện các công việc của vị trí ${titles[i]}, phối hợp cùng các phòng ban và báo cáo kết quả định kỳ.`,requirements:"Tốt nghiệp phù hợp, giao tiếp tốt, chủ động và có tinh thần trách nhiệm.",benefits:"Thu nhập cạnh tranh; thưởng hiệu quả; bảo hiểm đầy đủ; ưu đãi tour dành cho nhân viên.",deadline:new Date(Date.now()+(15+i)*86400000).toISOString().slice(0,10),status:"active"}).save();
};
