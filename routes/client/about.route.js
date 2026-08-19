const router = require("express").Router();
router.get("/", (req, res) => res.render("client/pages/about", { pageTitle: "Giới thiệu Công ty Cổ phần Du lịch Vietravel" }));
module.exports = router;
