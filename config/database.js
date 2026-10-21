const path = require("path");
const fs = require("fs");
const { spawn, execSync } = require("child_process");
const http = require("http");
const PocketBase = require("pocketbase").default || require("pocketbase");

const PB_PORT = process.env.POCKETBASE_PORT || 8091;
const PB_URL = process.env.POCKETBASE_URL || `http://127.0.0.1:${PB_PORT}`;
const PB_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || "pbadmin@viettravel.vn";
const PB_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || "SuperAdmin123!";

const pbDir = path.join(__dirname, "..", "tools", "pocketbase");
const pbExe = path.join(pbDir, "pocketbase.exe");
const pbDataDir = path.join(__dirname, "..", "pb_data");

// Cache lưu trữ documents theo table để phục vụ truy vấn tốc độ cao
// Mỗi collection map: Map<uid, { pbId: string, doc: any }>
const dbCache = {};

const tables = [
  "accounts_admin",
  "roles",
  "categories",
  "cities",
  "contacts",
  "forgot_password",
  "orders",
  "settings",
  "tours",
  "jobs",
  "applications",
  "interviews",
  "users"
];

function getCollectionName(table) {
  // Collection 'users' trong PocketBase là bảng Auth hệ thống mặc định,
  // do đó ta map 'users' sang 'app_users' để tránh xung đột schema.
  return table === "users" ? "app_users" : table;
}

function checkPortOpen(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensurePocketBaseServer() {
  const isOpen = await checkPortOpen(PB_PORT);
  if (isOpen) {
    return;
  }

  if (!fs.existsSync(pbExe)) {
    throw new Error(`Không tìm thấy file thực thi PocketBase tại: ${pbExe}`);
  }

  fs.mkdirSync(pbDataDir, { recursive: true });

  // Đảm bảo tài khoản superuser đã được tạo
  try {
    execSync(`"${pbExe}" superuser upsert ${PB_ADMIN_EMAIL} ${PB_ADMIN_PASSWORD} --dir="${pbDataDir}"`, {
      stdio: "ignore"
    });
  } catch (err) {
    // Nếu đã tồn tại hoặc lỗi nhẹ, tiếp tục khởi động
  }

  // Khởi động PocketBase server như một tiến trình ngầm
  const child = spawn(pbExe, ["serve", `--http=127.0.0.1:${PB_PORT}`, `--dir=${pbDataDir}`], {
    detached: true,
    stdio: "ignore",
    windowsHide: true
  });
  child.unref();

  // Chờ PocketBase khởi động sẵn sàng
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 200));
    const ready = await checkPortOpen(PB_PORT);
    if (ready) break;
  }
}

const pb = new PocketBase(PB_URL);

module.exports.pb = pb;
module.exports.dbCache = dbCache;
module.exports.getCollectionName = getCollectionName;

module.exports.connect = async () => {
  await ensurePocketBaseServer();

  // Đăng nhập Superuser
  try {
    await pb.collection("_superusers").authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  } catch (err) {
    // Thử lại nếu vừa khởi động
    await new Promise((r) => setTimeout(r, 500));
    await pb.collection("_superusers").authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  }

  // Khởi tạo các collections nếu chưa tồn tại và tải dữ liệu vào cache
  for (const table of tables) {
    const pbTable = getCollectionName(table);
    dbCache[pbTable] = new Map();

    let col;
    try {
      col = await pb.collections.getOne(pbTable);
    } catch (e) {
      col = await pb.collections.create({
        name: pbTable,
        type: "base",
        fields: [
          { name: "uid", type: "text", max: 100 },
          { name: "data", type: "json" }
        ]
      });
    }

    // Tải toàn bộ records hiện có từ PocketBase vào cache bộ nhớ
    try {
      const records = await pb.collection(pbTable).getFullList({ requestKey: null });
      for (const rec of records) {
        const uid = String(rec.uid || rec.data?._id || rec.id);
        const doc = rec.data || {};
        doc._id = doc._id || uid;
        doc.id = doc._id;
        dbCache[pbTable].set(uid, { pbId: rec.id, doc });
      }
    } catch (err) {
      console.warn(`Lỗi khi nạp cache collection ${pbTable}:`, err.message);
    }
  }

  console.log(`PocketBase VietTravel đã sẵn sàng tại ${PB_URL}!`);
};
