const fs=require("fs"),path=require("path"),crypto=require("crypto");
const dir=path.join(__dirname,"../public/uploads/images");fs.mkdirSync(dir,{recursive:true});
module.exports.storage={
  _handleFile(req,file,cb){const ext=path.extname(file.originalname)||".jpg";const name=`${Date.now()}-${crypto.randomBytes(5).toString("hex")}${ext}`;const out=fs.createWriteStream(path.join(dir,name));file.stream.pipe(out);out.on("error",cb);out.on("finish",()=>cb(null,{path:`/uploads/images/${name}`,size:out.bytesWritten,filename:name}));},
  _removeFile(req,file,cb){if(file.filename)fs.unlink(path.join(dir,file.filename),()=>cb(null));else cb(null);}
};
