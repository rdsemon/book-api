const express = require('express')
const router = express.Router()
const { singUp, login } = require('../controllers/auth.controller')

router.post('/singUp', singUp)
router.post('/login', login)

module.exports = router
