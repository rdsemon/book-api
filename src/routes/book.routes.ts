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

//middleware chaining

const createBookMiddleware = [
    validate(createBookSchema),
    protect,
    restictedTo('author', 'user'),
]

const updateBookMiddleware = [
    validate(updateBookSchema),
    protect,
    restictedTo('author', 'user'),
]

const deleteBookMiddleware = [
    validate(uuidSchema),
    protect,
    restictedTo('author', 'admin'),
]

//routes

router.route('/book').get(getallBooks).post(createBookMiddleware, createBook)
router
    .route('/book/:uuid')
    .get(validate(uuidSchema), getBookById)
    .patch(updateBookMiddleware, updateBook)
    .delete(deleteBookMiddleware, deleteBook)

module.exports = router
