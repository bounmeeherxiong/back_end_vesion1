const router = require('express').Router();
const reportcontroller = require('../controllers/reportsearchjournalentries.controllers');
router.post('/date',reportcontroller.reportbydate);
router.get('/reporttrailbalance',reportcontroller.reportTrialbalance);
router.post('/searchreport',reportcontroller.reporttriabalancesearchbydate);


module.exports = router;