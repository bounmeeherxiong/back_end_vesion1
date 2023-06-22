const router = require('express').Router();

const booksControllers = require('../controllers/books.controller');

router.post("/add", booksControllers.insertBooks);
router.put("/update/:uid", booksControllers.updateBooks);
router.get("/", booksControllers.slectAllBooks);
router.get("/:uid", booksControllers.selectOneBooks);
router.delete("/delete/:uid", booksControllers.deleteBooks);

module.exports = router;