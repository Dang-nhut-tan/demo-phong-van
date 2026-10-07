const Job = require("../../models/job.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
  if (!req.permissions || !req.permissions.includes("recruitment-view")) {
    return res.status(403).render("admin/pages/error-404", {
      pageTitle: "Không có quyền truy cập",
      message: "Bạn không có quyền xem tin tuyển dụng"
    });
  }

  const find = {
    deleted: false
  };

  // Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm theo từ khóa
  if (req.query.keyword) {
    const keyword = req.query.keyword.trim();
    find.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { department: { $regex: keyword, $options: "i" } },
      { location: { $regex: keyword, $options: "i" } }
    ];
  }

  // Lọc theo ngày tạo
  const dateFilter = {};
  if (req.query.startDate) {
    dateFilter.$gte = moment(req.query.startDate).startOf("date").toDate();
  }
  if (req.query.endDate) {
    dateFilter.$lte = moment(req.query.endDate).endOf("date").toDate();
  }
  if (Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }

  const jobList = await Job.find(find).sort({ createdAt: -1 });

  for (const item of jobList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  const canDelete = req.permissions.includes("recruitment-delete") || req.permissions.includes("recruitment-manage");

  res.render("admin/pages/recruitment-list", {
    pageTitle: "Quản lý tin tuyển dụng",
    jobList: jobList,
    currentStatus: req.query.status || "",
    keyword: req.query.keyword || "",
    canDelete: canDelete
  });
};

module.exports.delete = async (req, res) => {
  try {
    if (!req.permissions || (!req.permissions.includes("recruitment-delete") && !req.permissions.includes("recruitment-manage"))) {
      return res.json({
        code: "error",
        message: "Bạn không có quyền xóa tin tuyển dụng!"
      });
    }

    const id = req.params.id;
    await Job.updateOne({
      _id: id
    }, {
      deleted: true,
      status: "closed",
      deletedAt: new Date().toISOString()
    });

    req.flash("success", "Xóa tin tuyển dụng thành công!");
    res.json({
      code: "success"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id tin tuyển dụng không hợp lệ!"
    });
  }
};

module.exports.changeMulti = async (req, res) => {
  try {
    const { option, ids } = req.body;

    if (option === "delete") {
      if (!req.permissions || (!req.permissions.includes("recruitment-delete") && !req.permissions.includes("recruitment-manage"))) {
        return res.json({
          code: "error",
          message: "Bạn không có quyền xóa tin tuyển dụng!"
        });
      }

      await Job.updateMany({
        _id: { $in: ids }
      }, {
        deleted: true,
        status: "closed",
        deletedAt: new Date().toISOString()
      });
      req.flash("success", "Xóa các tin tuyển dụng thành công!");
    } else if (option === "active" || option === "inactive" || option === "closed") {
      await Job.updateMany({
        _id: { $in: ids }
      }, {
        status: option
      });
      req.flash("success", "Cập nhật trạng thái thành công!");
    }

    res.json({
      code: "success"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Thao tác không thành công!"
    });
  }
};
