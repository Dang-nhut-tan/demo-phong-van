const Category = require("../models/category.model");
const City = require("../models/city.model");
const Tour = require("../models/tour.model");

module.exports = async function seedInternationalTours() {
  let category = await Category.findOne({ name: "Tour nước ngoài" });
  if (!category) {
    category = new Category({ name: "Tour nước ngoài", position: 2, status: "active", avatar: "/assets/images/tours/tokyo.jpg" });
    await category.save();
  }
  const cities = await City.find({});
  const tourSeeds = [
    { name: "Tokyo - Núi Phú Sĩ", image: "tokyo.jpg", time: "5 ngày 4 đêm", price: 28900000 },
    { name: "Singapore - Marina Bay", image: "singapore.jpg", time: "4 ngày 3 đêm", price: 16900000 },
    { name: "Bangkok - Pattaya", image: "bangkok.jpg", time: "5 ngày 4 đêm", price: 13900000 },
    { name: "Seoul - Cung điện Gyeongbokgung", image: "seoul.jpg", time: "5 ngày 4 đêm", price: 24900000 },
    { name: "Paris - Kinh đô ánh sáng", image: "paris.jpg", time: "7 ngày 6 đêm", price: 59900000 },
    { name: "Sydney - Nhà hát Con Sò", image: "sydney.jpg", time: "6 ngày 5 đêm", price: 45900000 }
  ];
  for (let i = 0; i < tourSeeds.length; i++) {
    const item = tourSeeds[i];
    if (await Tour.findOne({ name: item.name })) continue;
    const image = `/assets/images/tours/${item.image}`;
    await new Tour({
      name: item.name, category: category._id, position: 20 - i, status: "active", avatar: image,
      priceAdult: item.price, priceChildren: Math.round(item.price * 0.75), priceBaby: Math.round(item.price * 0.25),
      priceNewAdult: Math.round(item.price * 0.9), priceNewChildren: Math.round(item.price * 0.68), priceNewBaby: Math.round(item.price * 0.2),
      stockAdult: 20, stockChildren: 10, stockBaby: 5, locations: cities.slice(0, 2).map(city => city._id),
      time: item.time, vehicle: "Máy bay", departureDate: new Date(Date.now() + (i + 10) * 86400000).toISOString(),
      information: "Hành trình quốc tế trọn gói cùng VietTravel với lịch trình hấp dẫn và dịch vụ tận tâm.",
      schedules: [], images: [image]
    }).save();
  }
};
