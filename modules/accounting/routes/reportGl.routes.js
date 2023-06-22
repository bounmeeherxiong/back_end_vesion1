const router = require('express').Router();
const reportcontroller = require('../controllers/reportGl.controller');

router.get('/reportGl',reportcontroller.reportGL);
router.post('/reportsumTotal',reportcontroller.sumTotal)
router.post('/reportsumTotalAccountBydate',reportcontroller.sumTotalAccountBydate)
router.post('/reportsumTotalCustomAndTodayBydate',reportcontroller.sumTotalCustomAndTodayBydate)
router.post('/reportsumTotalGL',reportcontroller.sumTotalGL)
router.post('/reportGlbydate',reportcontroller.reportGLbydate);
router.post('/reportbyaccount',reportcontroller.reportbyaccount);
router.get('/runreport/:id',reportcontroller.runreport)
router.get('/runreportAllGl/:id',reportcontroller.retportAllGL)
router.post('/runreportSeachBydate',reportcontroller.runreportSeachBydate)
router.post('/runreportAllGLBydate',reportcontroller.reportAllGlbydate)
router.get('/reportbalanceSheetHeading',reportcontroller.reportbalanceSheet)
router.post('/searchreportbalanceSheetHeading',reportcontroller.searchbalancesheet)
router.get('/reportprofitandloss',reportcontroller.reportProfitandLoss)
router.post('/updatebalance',reportcontroller.sumsubjectTotal)
router.get('/EnterExchangeRates',reportcontroller.EnterExchangeRates)
router.post('/create',reportcontroller.CreategainAndloss)
router.get('/gain',reportcontroller.SelectgainAndLoss)
router.get('/gainandloss',reportcontroller.selectTotalgainandloss)
router.get('/exchange_rate/:date',reportcontroller.selectdateofexhangeRate)
router.get('/transactiongainandloss',reportcontroller.transactiongainandloss)
module.exports = router;