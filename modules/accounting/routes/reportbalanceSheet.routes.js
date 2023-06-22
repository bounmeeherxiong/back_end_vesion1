const router = require('express').Router();
const reportcontroller = require('../controllers/reportbalanceSheet.controllers');

router.get("/",reportcontroller.reportbalanceSheet);

module.exports = router;