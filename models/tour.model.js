const slugify = require("slugify");
module.exports = require("./base.model")("tours", { locations: [], schedules: [], images: [], status: "active", deleted: false }, d => { if (!d.slug && d.name) d.slug=slugify(d.name,{lower:true,strict:true,locale:"vi"}); return d; });
