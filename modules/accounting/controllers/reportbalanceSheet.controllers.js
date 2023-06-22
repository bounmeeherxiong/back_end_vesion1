const reportbalanceSheet = require('../models/reportbalanceSheet.model');
const balanceSheet = new reportbalanceSheet();
exports.reportbalanceSheet = async (req, res, next) => {
    try {
        const heading = await balanceSheet.heading()
        return res.status(200).json({ data: heading}); 

    } catch (e) {
        res.status(500).json({
            statusCode: 500,
            message: e.message
        });
    }
}