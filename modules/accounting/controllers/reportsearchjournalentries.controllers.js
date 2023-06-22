const reportjournentries = require('../models/reportsearchjournalentries.model');
const report = new reportjournentries();
exports.reportbydate = async (req, res, next) => {
    const {id,start,end}=req.body;   
    const data = await report.reportbydate(id,start,end);
    const data_balance=await report.reportbybalance(id,start,end);
    res.status(200).json({
        stastusCode: 200,
        message: "Success",
        result: data,
        total:data_balance
    });
}

exports.reportTrialbalance=async(req,res,next)=>{
    const data=await report.reportTrialbalace();
    const total=await report.reporttotalTrialbalance();
    const second= await report.reportfirsttrialbalnce()
    return res.status(200).json({result:data,total:total,second:second})
}

exports.reporttriabalancesearchbydate=async(req,res,next)=>{
    const newdate1=req.body.start
    const newdate2=req.body.end
    var start = newdate1.split("-").reverse().join("-");
    var end = newdate2.split("-").reverse().join("-");
    const searchtrialbanlance=await report.reportsearchBydateTriabalnce(start,end);
    const searchTotal=await report.reportsearchBytotalTriabalance(start,end);
    return res.status(200).json({
        result:searchtrialbanlance,
        searchtotal:searchTotal
    });
}






