const Tour = require("../../models/tour.model");
const Category = require("../../models/category.model");
const moment = require("moment");
const categoryHelper = require("../../helpers/category.helper");

async function toursForCategory(name, limit = 8) {
  const category = await Category.findOne({ name, deleted: false, status: "active" });
  if (!category) return { category: null, tours: [] };
  const ids = await categoryHelper.getAllSubcategoryIds(category._id);
  const tours = await Tour.find({ category: { $in: ids }, deleted: false, status: "active" }).sort({ position: -1 }).limit(limit);
  for (const item of tours) item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
  return { category, tours };
}

module.exports.home = async (req, res) => {
  const newest = await Tour.find({ deleted: false, status: "active" }).sort({ position: -1 }).limit(6);
  for (const item of newest) item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");

  const domestic = await toursForCategory("Tour trong nước");
  const international = await toursForCategory("Tour nước ngoài");

  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
    tourListSection2: newest,
    tourListSection4: domestic.tours,
    tourListInternational: international.tours,
    domesticCategory: domestic.category,
    internationalCategory: international.category
  });
};
