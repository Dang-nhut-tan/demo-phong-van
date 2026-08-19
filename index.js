const express = require('express')
const path = require('path');
require('dotenv').config();
const database = require("./config/database");
const adminRoutes = require("./routes/admin/index.route");
const clientRoutes = require("./routes/client/index.route");
const variableConfig = require("./config/variable");
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const hrRoutes = require("./routes/hr.route");
const seed = require("./config/seed");

const app = express()
const port = process.env.PORT || 3000

// Kết nối Database
// Database được khởi tạo trước khi máy chủ nhận yêu cầu.

// Thiết lập views
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

// Thiết lập thư mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname, "public")));
// CV mẫu được lưu cùng source để luôn tồn tại trên Render Free.
app.use("/demo-cv", express.static(path.join(__dirname, "CV")));

// Tạo biến toàn cục trong file PUG
app.locals.pathAdmin = variableConfig.pathAdmin;

// Tạo biến toàn cục trong các file backend
global.pathAdmin = variableConfig.pathAdmin;

// Cho phép gửi data lên dạng json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sử dụng cookie-parser
app.use(cookieParser("SFGWHSDSGSDSD"));

// Nhúng Flash
app.use(session({ secret: process.env.JWT_SECRET || "viettravel-local-secret", resave: false, saveUninitialized: false, cookie: { maxAge: 60000 }}));
app.use(flash());

// Thiết lập đường dẫn
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);
app.use("/hr", hrRoutes);
app.use("/", clientRoutes);

async function start(){
  await database.connect();
  await seed();
  app.listen(port, () => console.log(`VietTravel đang chạy tại http://localhost:${port}`));
}
start().catch(error=>{console.error("Không thể khởi động VietTravel:",error);process.exit(1);});
