const router = require('express').Router();
const typeContrller = require('../controllers/accountsType.controller');

router.get('/', typeContrller.selectALlTypes);
router.get('/:uid', typeContrller.selectOneTypes);
router.post('/create', typeContrller.insertTypes);
router.put('/update/:uid', typeContrller.updateTypes);
router.delete('/delete/:uid', typeContrller.deleteTypes);
router.get('/accountsType/:id',typeContrller.selecteEditaccounts_type)

module.exports = router;