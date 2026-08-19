const path = require("path");
const fs = require("fs");
const { DatabaseSync } = require("node:sqlite");

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "viettravel.sqlite"));
db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
const tables = ["accounts_admin", "roles", "categories", "cities", "contacts", "forgot_password", "orders", "settings", "tours", "jobs", "applications", "interviews"];

module.exports.connect = async () => {
  for (const table of tables) db.exec(`CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY, data TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`);
  console.log("SQLite VietTravel đã sẵn sàng!");
};

module.exports.db = db;
