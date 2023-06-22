const router = require('express').Router();

const currencyController = require('../controllers/currency.controller');

router.post("/add", currencyController.insertCurrencies);
router.put("/update/:uid", currencyController.updateCurrencies);
router.get("/", currencyController.selectAllCurrencies);
router.get("/:uid", currencyController.selectOneCurrencies);
router.delete("/delete/:uid", currencyController.deleteCurrencies);
router.get("/currencies/:ac_type",currencyController.selectchecked_currency)
router.get("/currencieslak/:lak",currencyController.selectcurrencylak);
router.get("/checkedcurrencies/:c_id",currencyController.selectcurrencystatus);
router.get("/selectstatus/:id",currencyController.selectstatus);
router.get("/editcurrency/:id",currencyController.editcurrency);

module.exports = router;