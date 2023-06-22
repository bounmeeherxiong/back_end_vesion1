const router = require('express').Router();
const companyController = require('../controllers/company.controller');

router.get('/all', companyController.selectAllCompany);
router.get('/:uid', companyController.selectOneCompany);
router.post('/create', companyController.insertCompany);
router.put('/update/:uid', companyController.updateCompany);
router.delete('/delete/:uid', companyController.deleteCompany);

module.exports = router;