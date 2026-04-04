const express = require('express')
const router = express.Router()
const booksController = require('../controllers/book.controller')
const validate = require('../middlewares/validate')
const {
    createBookSchema,
    getBookByIdSchema,
} = require('../validators/zodSchema/book.schema')
const { createBook, getallBooks, updateBook, deleteBook, getBookById } =
    booksController

router
    .route('/book')
    .get(getallBooks)
    .post(validate(createBookSchema), createBook)
router
    .route('/book/:uuid')
    .get(validate(getBookByIdSchema), getBookById)
    .patch(updateBook)
    .delete(deleteBook)

module.exports = router
