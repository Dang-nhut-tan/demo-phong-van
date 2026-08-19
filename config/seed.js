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
    { title:"Nhân viên điều hành tour", department:"Phòng Điều hành", location:"TP. Hồ Chí Minh", quantity:2 },
    { title:"Nhân viên Sale tour", department:"Phòng Kinh doanh", location:"TP. Hồ Chí Minh", quantity:3 }
  ];
  const allowedJobTitles = new Set(jobSeeds.map(item => item.title));
  for (const job of await Job.find({})) {
    if (!allowedJobTitles.has(job.title)) await Job.deleteOne({_id:job._id});
  }
  for (let i=0;i<jobSeeds.length;i++) {
    const item=jobSeeds[i];
    if (!await Job.findOne({title:item.title})) await new Job({
      ...item,
      jobDescription:`Tư vấn và thực hiện các công việc của vị trí ${item.title}, phối hợp cùng các phòng ban để phục vụ khách hàng.`,
      requirements:"Giao tiếp tốt, chủ động, có tinh thần trách nhiệm và yêu thích lĩnh vực du lịch.",
      benefits:"Thu nhập cạnh tranh; thưởng hiệu quả; bảo hiểm đầy đủ; ưu đãi tour dành cho nhân viên.",
      deadline:new Date(Date.now()+(20+i*5)*86400000).toISOString().slice(0,10),
      status:"active"
    }).save();
  }
};
