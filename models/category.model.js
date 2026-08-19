const slugify = require("slugify");
module.exports = require("./base.model")("categories", { parent: "", position: 0, status: "active", deleted: false }, d => { if (!d.slug && d.name) d.slug=slugify(d.name,{lower:true,strict:true,locale:"vi"}); return d; });
