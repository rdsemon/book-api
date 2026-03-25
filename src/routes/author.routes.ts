const express = require('express')
const authorController = require('../controllers/author.controller')
const router = express.Router()

const { getAllUsers, createUser, getAuthorById } = authorController

router.route('/author').get(getAllUsers).post(createUser)
router.route('/author/:id').get(getAuthorById)

module.exports = router
