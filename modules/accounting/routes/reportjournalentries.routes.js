const router = require('express').Router();
const reportcontroller = require('../controllers/reportjournalentries.controllers');

router.get('/report/:journ_no',reportcontroller.selectReport);
router.get('/reportByaccount/:ch_id',reportcontroller.selectReportbyaccount);
module.exports = router;