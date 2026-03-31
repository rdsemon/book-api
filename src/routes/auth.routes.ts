const express = require('express')
const router = express.Router()
const { singUp } = require('../controllers/auth.controller')

router.post('/singUp', singUp)

module.exports = router
