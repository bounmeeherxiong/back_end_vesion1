const router = require('express').Router();

const transaction = require('../controllers/transaction.controller');

router.get("/", transaction.transaction);
router.get("/transactionlist/:id",transaction.getTransaction);
module.exports = router;