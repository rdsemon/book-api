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
const { protect, restictedTo } = require('../controllers/auth.controller')

router
    .route('/book')
    .get(getallBooks)
    .post(
        validate(createBookSchema),
        protect,
        restictedTo('author', 'user'),
        createBook
    )
router
    .route('/book/:uuid')
    .get(validate(uuidSchema), getBookById)
    .patch(
        validate(updateBookSchema),
        protect,
        restictedTo('author', 'admin'),
        updateBook
    )
    .delete(
        validate(uuidSchema),
        protect,
        restictedTo('author', 'admin'),
        deleteBook
    )

module.exports = router
