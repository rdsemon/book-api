const express = require('express')
const authorController = require('../controllers/author.controller')
const router = express.Router()

const { getAllAuthor, createAuthor, getAuthorById, deleteAuthor } =
    authorController

router.route('/author').get(getAllAuthor).post(createAuthor)
router.route('/author/:uuid').get(getAuthorById).delete(deleteAuthor)

module.exports = router
