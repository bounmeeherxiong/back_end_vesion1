const router = require('express').Router();
const journalController = require('../controllers/journalEntries.controller');

router.post('/create', journalController.insertJournal);
router.get('/selectcount', journalController.selectcountnumer);
router.delete("/delete/:id",journalController.deleteledger);
router.post('/image',journalController.images)
module.exports = router;