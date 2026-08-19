const slugify = require("slugify");
module.exports = require("./base.model")("jobs", { status: "active", deleted: false }, d => { if (!d.slug && d.title) d.slug=slugify(d.title,{lower:true,strict:true,locale:"vi"})+"-"+d._id.slice(0,6); return d; });
