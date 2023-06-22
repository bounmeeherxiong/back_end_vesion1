const router = require('express').Router();

const accountsController = require('../controllers/accounts.controller');

router.post("/add", accountsController.insertAccounts);
router.put("/update/:uid", accountsController.updateAccounts);
router.get("/", accountsController.slectAllAccounts);
router.delete("/delete/:uid", accountsController.deleteAccounts);
module.exports = router;