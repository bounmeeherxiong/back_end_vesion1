const router = require('express').Router();
const reportcontroller = require('../controllers/reportTestGL.controller');

router.get('/reportGl',reportcontroller.reportGL);
router.post('/reportGlbydate',reportcontroller.reportGLbydate);


module.exports = router;