const Job=require("../../models/job.model");
const Application=require("../../models/application.model");

exports.list=async(req,res)=>{const jobs=await Job.find({status:"active",deleted:false}).sort({createdAt:-1});res.render("client/pages/career-list",{pageTitle:"Tuyển dụng | VietTravel",jobs});};
exports.detail=async(req,res)=>{const job=await Job.findOne({slug:req.params.slug,status:"active",deleted:false});if(!job)return res.status(404).send("Tin tuyển dụng không tồn tại");res.render("client/pages/career-detail",{pageTitle:`${job.title} | VietTravel`,job});};
exports.apply=async(req,res)=>{const job=await Job.findOne({_id:req.params.id,status:"active",deleted:false});if(!job)return res.status(404).send("Tin tuyển dụng không tồn tại");if(!req.file)return res.status(400).send("Vui lòng tải CV định dạng PDF");await new Application({jobId:job._id,jobTitle:job.title,fullName:req.body.fullName,email:req.body.email,phone:req.body.phone,cvPath:`/uploads/cv/${req.file.filename}`,cvOriginalName:req.file.originalname,status:"new"}).save();res.render("client/pages/career-success",{pageTitle:"Nộp hồ sơ thành công",job});};
