const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const { singUp, login } = require('../controllers/auth.controller')
const { singUpSchema, LoginSchema } = require('../zodSchema/auth.schema')

router.post('/singUp', validate(singUpSchema), singUp)
router.post('/login', validate(LoginSchema), login)

module.exports = router
