const AccountAdmin = require("../../models/account-admin.model");
const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const variableConfig = require("../../config/variable");
const moment = require("moment");

module.exports.dashboard = async (req, res) => {
  // Section 1
  const overview = {
    totalAdmin: 0,
    totalUser: 0,
    totalOrder: 0,
    totalPrice: 0
  };

  overview.totalAdmin = await AccountAdmin.countDocuments({
    deleted: false
  });

  overview.totalUser = await User.countDocuments({
    deleted: false
  });

  const orderList = await Order.find({
    deleted: false
  }).sort({
    createdAt: -1
  });

  overview.totalOrder = orderList.length;

  overview.totalPrice = orderList.reduce((sum, item) => {
    return sum + (item.total || 0);
  }, 0);
  // End Section 1

  // Section 3: Latest orders
  const latestOrders = orderList.slice(0, 5);
  for (const orderDetail of latestOrders) {
    orderDetail.paymentMethodName = variableConfig.paymentMethod.find(item => item.value == orderDetail.paymentMethod)?.label || orderDetail.paymentMethod;
    orderDetail.paymentStatusName = variableConfig.paymentStatus.find(item => item.value == orderDetail.paymentStatus)?.label || orderDetail.paymentStatus;
    orderDetail.statusName = variableConfig.orderStatus.find(item => item.value == orderDetail.status)?.label || orderDetail.status;
    orderDetail.createdAtTime = moment(orderDetail.createdAt).format("HH:mm");
    orderDetail.createdAtDate = moment(orderDetail.createdAt).format("DD/MM/YYYY");
  }

  res.render("admin/pages/dashboard", {
    pageTitle: "Tổng quan",
    overview: overview,
    latestOrders: latestOrders
  });
};

module.exports.revenueChartPost = async (req, res) => {
  const { currentMonth, currentYear, previousMonth, previousYear, arrayDay } = req.body;

  // Truy vấn tất cả đơn hàng trong tháng hiện tại
  const ordersCurrentMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(currentYear, currentMonth - 1, 1),
      $lt: new Date(currentYear, currentMonth, 1)
    }
  });

  // Truy vấn tất cả đơn hàng trong tháng trước
  const ordersPreviousMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(previousYear, previousMonth - 1, 1),
      $lt: new Date(previousYear, previousMonth, 1)
    }
  });

  // Tạo mảng doanh thu theo từng ngày
  const dataMonthCurrent = [];
  const dataMonthPrevious = [];

  for (const day of arrayDay) {
    // Tính tổng doanh thu theo từng ngày của tháng này
    let totalCurrent = 0;
    for (const order of ordersCurrentMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if(day == orderDate) {
        totalCurrent += (order.total || 0);
      }
    }
    dataMonthCurrent.push(totalCurrent);

    // Tính tổng doanh thu theo từng ngày của tháng trước
    let totalPrevious = 0;
    for (const order of ordersPreviousMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if(day == orderDate) {
        totalPrevious += (order.total || 0);
      }
    }
    dataMonthPrevious.push(totalPrevious);
  }

  res.json({
    code: "success",
    dataMonthCurrent: dataMonthCurrent,
    dataMonthPrevious: dataMonthPrevious
  });
};