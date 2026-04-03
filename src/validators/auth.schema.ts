const { z } = require('zod')
const customErrors = require('../utils/zodCustomError')

const LoginSchema = z.object({
    email: z.email(),
    password: z.string(customErrors('password')),
})

module.exports = { LoginSchema }
