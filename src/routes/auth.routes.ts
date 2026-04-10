const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const { singUp, login } = require('../controllers/auth.controller')
const { signUpSchema, LoginSchema } = require('../zodSchema/auth.schema')
const { authLimiter } = require('../middlewares/ratelimiter')

router.use(authLimiter)

router.post('/singUp', validate(signUpSchema), singUp)
router.post('/login', validate(LoginSchema), login)

module.exports = router
