const reportjournentries = require('../models/reportjournalentries.model');
const report = new reportjournentries();
exports.selectReport = async (req, res, next) => {
    const data = await report.reportjournalentry()
    res.status(200).json({
        stastusCode: 200,
        message: "Success",
        result: data
    });
}
exports.selectReportbyaccount = async (req, res, next) => {
    try {
        const ch_id = req.params.ch_id;
        const first = await report.reportfirst(ch_id)
        const secod= await report.reportsecod(ch_id)
        const children=await report.reportchildren(ch_id)
        const id=await report.reportbyid(ch_id)
        const data = await report.reportbyaccount(ch_id);

        return res.status(200).json({first: first,secod: secod,children:children,id:id,result:data});
    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}


