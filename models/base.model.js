const crypto = require("crypto");
const { db } = require("../config/database");

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const scalar = value => value instanceof Date ? value.toISOString() : value;
function matchesValue(actual, expected) {
  if (expected instanceof RegExp) return expected.test(String(actual ?? ""));
  if (expected && typeof expected === "object" && !Array.isArray(expected) && !(expected instanceof Date)) return Object.entries(expected).every(([op, wanted]) => {
    const a = scalar(actual), w = scalar(wanted);
    if (op === "$in") return wanted.map(String).includes(String(actual));
    if (op === "$ne") return String(actual) !== String(wanted);
    if (op === "$gte") return a >= w; if (op === "$gt") return a > w;
    if (op === "$lte") return a <= w; if (op === "$lt") return a < w;
    if (op === "$regex") return (wanted instanceof RegExp ? wanted : new RegExp(wanted, expected.$options || "")).test(String(actual ?? ""));
    return op === "$options";
  });
  if (Array.isArray(actual)) return actual.map(String).includes(String(expected));
  return String(actual ?? "") === String(expected ?? "");
}
function matches(doc, filter = {}) { return Object.entries(filter).every(([key, expected]) => key === "$or" ? expected.some(x => matches(doc, x)) : key === "$and" ? expected.every(x => matches(doc, x)) : matchesValue(doc[key], expected)); }

class Query {
  constructor(run) { this.run = run; this.sortSpec = null; this.limitValue = null; this.skipValue = 0; this.selectFields = null; }
  sort(spec) { this.sortSpec = spec; return this; } limit(v) { this.limitValue = Number(v); return this; } skip(v) { this.skipValue = Number(v); return this; }
  select(fields) { this.selectFields = String(fields).split(/\s+/); return this; }
  async exec() { let rows = this.run(); if (this.sortSpec) rows.sort((a,b) => { for (const [k,d] of Object.entries(this.sortSpec)) { if (a[k] < b[k]) return -1*d; if (a[k] > b[k]) return d; } return 0; }); rows = rows.slice(this.skipValue, this.limitValue == null ? undefined : this.skipValue + this.limitValue); if (this.selectFields) rows = rows.map(r => Object.fromEntries(["_id",...this.selectFields].filter(k => r[k] !== undefined).map(k => [k,r[k]]))); return rows; }
  then(resolve, reject) { return this.exec().then(resolve, reject); }
}

function createModel(table, defaults = {}, beforeSave = doc => doc) {
  return class Model {
    constructor(data = {}) { Object.assign(this, clone(defaults), clone(data)); this._id = this._id || crypto.randomUUID(); this.id = this._id; }
    static all() { return db.prepare(`SELECT data FROM ${table}`).all().map(r => JSON.parse(r.data)); }
    static find(filter = {}) { return new Query(() => this.all().filter(d => matches(d, filter)).map(d => new this(d))); }
    static async findOne(filter = {}) { const d = this.all().find(x => matches(x, filter)); return d ? new this(d) : null; }
    static async countDocuments(filter = {}) { return this.all().filter(d => matches(d, filter)).length; }
    static async updateOne(filter, update) { const item = await this.findOne(filter); if (!item) return {matchedCount:0}; Object.assign(item, update.$set || update); if (update.$inc) for (const [k,v] of Object.entries(update.$inc)) item[k] = Number(item[k]||0)+Number(v); await item.save(); return {matchedCount:1}; }
    static async updateMany(filter, update) { const items = await this.find(filter); for (const item of items) { Object.assign(item, update.$set || update); await item.save(); } return {modifiedCount:items.length}; }
    static async deleteOne(filter) { const item = await this.findOne(filter); if (!item) return {deletedCount:0}; db.prepare(`DELETE FROM ${table} WHERE id=?`).run(item._id); return {deletedCount:1}; }
    static async deleteMany(filter) { const items = await this.find(filter); const s=db.prepare(`DELETE FROM ${table} WHERE id=?`); for(const i of items)s.run(i._id); return {deletedCount:items.length}; }
    async save() { const now=new Date().toISOString(); Object.assign(this,beforeSave(this)); this.id=this._id; this.createdAt=this.createdAt||now; this.updatedAt=now; db.prepare(`INSERT INTO ${table}(id,data,created_at,updated_at) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at`).run(this._id,JSON.stringify(this),this.createdAt,now); return this; }
  };
}
module.exports = createModel;
