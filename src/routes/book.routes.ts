const express = require('express')
const router = express.Router()
const booksController = require('../controllers/book.controller')
const { createBook, getallBooks, updateBook, deleteBook } = booksController

router.route('/book').get(getallBooks).post(createBook)
router.route('/book/:uuid').patch(updateBook).delete(deleteBook)

module.exports = router
