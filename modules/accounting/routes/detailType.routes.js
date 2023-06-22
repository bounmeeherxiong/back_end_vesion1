const router = require('express').Router();
const detailController = require('../controllers/detailType.controller');

router.get('/', detailController.selectAllDetail);
router.get('/:uid', detailController.selectOneDetail);
router.get('/type/:ac_type', detailController.selectByType);
router.post('/create', detailController.insertDetails);
router.put('/update/:uid', detailController.updateDetail);
router.delete('/delete/:uid', detailController.deleteDetails);
router.get('/editdetailType/:uid',detailController.editdetailType);

module.exports = router;