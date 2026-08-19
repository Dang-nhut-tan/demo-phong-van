const router=require("express").Router();
const multer=require("multer"); const path=require("path"); const fs=require("fs"); const crypto=require("crypto");
const dir=path.join(__dirname,"../../public/uploads/cv");fs.mkdirSync(dir,{recursive:true});
const upload=multer({storage:multer.diskStorage({destination:dir,filename:(req,file,cb)=>cb(null,`${Date.now()}-${crypto.randomBytes(4).toString("hex")}.pdf`)}),limits:{fileSize:5*1024*1024},fileFilter:(req,file,cb)=>cb(null,file.mimetype==="application/pdf"&&path.extname(file.originalname).toLowerCase()===".pdf")});
const c=require("../../controllers/client/career.controller");
router.get("/",c.list); router.get("/:slug",c.detail); router.post("/:id/apply",upload.single("cv"),c.apply);
module.exports=router;
