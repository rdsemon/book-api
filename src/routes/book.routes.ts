const express = require('express')
const router = express.Router()
const booksController = require('../controllers/book.controller')
const validate = require('../middlewares/validate')
const {
    createBookSchema,
    updateBookSchema,
} = require('../zodSchema/book.schema')

const uuidSchema = require('../zodSchema/uuid.schema')
const { createBook, getallBooks, updateBook, deleteBook, getBookById } =
    booksController
const { protect } = require('../controllers/auth.controller')

router
    .route('/book')
    .get(getallBooks)
    .post(validate(createBookSchema), protect, createBook)
router
    .route('/book/:uuid')
    .get(validate(uuidSchema), getBookById)
    .patch(validate(updateBookSchema), updateBook)
    .delete(validate(uuidSchema), deleteBook)

module.exports = router
