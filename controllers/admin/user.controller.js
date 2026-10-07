const User = require("../../models/user.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  // Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Lọc theo ngày tạo
  const dateFilter = {};
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate;
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dateFilter.$lte = endDate;
  }
  if (Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }

  // Tìm kiếm từ khoá
  if (req.query.keyword) {
    const keyword = req.query.keyword.trim();
    find.$or = [
      { fullName: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } }
    ];
  }

  const userList = await User.find(find).sort({ createdAt: -1 });

  for (const item of userList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render("admin/pages/user-list", {
    pageTitle: "Quản lý người dùng",
    userList: userList,
    currentStatus: req.query.status || "",
    keyword: req.query.keyword || ""
  });
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await User.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedAt: new Date().toISOString()
    });

    req.flash("success", "Xóa người dùng thành công!");
    res.json({
      code: "success"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    });
  }
};

module.exports.changeMulti = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await User.updateMany({
          _id: { $in: ids }
        }, {
          status: option
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;
      case "delete":
        await User.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedAt: new Date().toISOString()
        });
        req.flash("success", "Xóa thành công!");
        break;
    }

    res.json({
      code: "success"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Không thể thực hiện!"
    });
  }
};