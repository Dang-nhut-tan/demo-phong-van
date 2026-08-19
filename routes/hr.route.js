const r=require("express").Router(),c=require("../controllers/hr.controller"),auth=require("../middlewares/hr-auth.middleware");
r.get("/login",c.login);r.post("/login",c.loginPost);r.post("/logout",c.logout);
r.use(auth);r.get("/",c.dashboard);r.get("/tin-tuyen-dung",c.jobs);r.get("/tin-tuyen-dung/tao",c.jobForm);r.post("/tin-tuyen-dung/tao",c.jobSave);r.get("/tin-tuyen-dung/:id/sua",c.jobForm);r.post("/tin-tuyen-dung/:id/sua",c.jobSave);r.post("/tin-tuyen-dung/:id/xoa",c.jobDelete);r.get("/ung-vien",c.applications);r.get("/ung-vien/:id",c.application);r.post("/ung-vien/:id/trang-thai",c.applicationStatus);r.post("/ung-vien/:id/phong-van",c.schedule);r.get("/thong-ke",c.stats);
module.exports=r;
