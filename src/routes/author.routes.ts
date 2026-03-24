const express = require('express')
const authorController = require('../controllers/author.controller')
const router = express.Router()

const { getAllUsers, createUser } = authorController

router.route('/author').get(getAllUsers).post(createUser)

module.exports = router
