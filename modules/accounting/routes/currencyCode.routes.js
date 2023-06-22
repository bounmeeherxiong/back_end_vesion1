const router = require('express').Router();

const codesControllers = require('../controllers/currencyCode.controller');

router.post("/add", codesControllers.insertCodes);
router.put("/update/:uid", codesControllers.updateCodes);
router.get("/", codesControllers.slectAllCodes);
router.get("/:uid", codesControllers.selectOneCodes);
router.delete("/delete/:uid", codesControllers.deleteCodes);

module.exports = router;