const reportGL = require('../models/reportTestGL');
const report = new reportGL();

exports.reportGL = async (req, res, next) => {
    try {
        const firstFloor = await report.firstFloor()
        const children = await report.children()
        const balance=await report.reportGlbalances()
        return res.status(200).json({firstFloor: firstFloor,children: children,balance:balance});

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}
exports.reportGLbydate=async(req,res,next)=>{
    const {start,end}=req.body;  
    console.log(start,end) 
    try{
        const firstFloor = await report.firstFloorbydate(start,end)
        const childrenbydate=await report.reportbydate(start,end)
        return res.status(200).json({firstFloor:firstFloor,children:childrenbydate});
    }catch(e){
        res.status(500).json({
            statusCode:500,
            message:e.message
        })
    }
}


