const express = require('express')
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const database = require("./config/database");
const adminRoutes = require("./routes/admin/index.route");
const clientRoutes = require("./routes/client/index.route");
const apiRoutes = require("./routes/api/index.route");
const variableConfig = require("./config/variable");
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const hrRoutes = require("./routes/hr.route");
const seed = require("./config/seed");

const app = express()
const port = process.env.PORT || 3000

// Thiết lập views (Pug SSR giữ cho admin, hr và ssr fallback)
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Cho phép gửi data lên dạng json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sử dụng cookie-parser
app.use(cookieParser("SFGWHSDSGSDSD"));

// Nhúng Flash & Session
app.use(session({ secret: process.env.JWT_SECRET || "viettravel-local-secret", resave: false, saveUninitialized: false, cookie: { maxAge: 60000 }}));
app.use(flash());

// Tạo biến toàn cục trong file PUG
app.locals.pathAdmin = variableConfig.pathAdmin;
global.pathAdmin = variableConfig.pathAdmin;

// API REST routes phục vụ React Frontend
app.use("/api", apiRoutes);

// Admin & HR Portal
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);
app.use("/hr", hrRoutes);
// SSR Fallback nếu cần đối chiếu
app.use("/ssr", clientRoutes);

// CV mẫu
app.use("/demo-cv", express.static(path.join(__dirname, "CV")));

// Phục vụ Frontend React (SPA)
const reactDist = path.join(__dirname, "frontend", "dist");
if (fs.existsSync(reactDist)) {
  app.use(express.static(reactDist));
}
// Thư mục chứa file tĩnh gốc (hình ảnh, uploads)
app.use(express.static(path.join(__dirname, "public")));

// SPA Catch-all: Trả về React index.html cho các route client
if (fs.existsSync(reactDist)) {
  app.get("*", (req, res, next) => {
    if (path.extname(req.path)) return next();
    res.sendFile(path.join(reactDist, "index.html"));
  });
} else {
  app.use("/", clientRoutes);
}

async function start(){
  await database.connect();
  await seed();
  app.listen(port, () => console.log(`VietTravel đang chạy tại http://localhost:${port}`));
}
start().catch(error=>{console.error("Không thể khởi động VietTravel:",error);process.exit(1);});
