const { z } = require('zod')
const customErrors = require('../../utils/zodCustomError')

const singUpSchema = z.object({
    name: z.string(customErrors('name')),
    email: z.email(),
    password: z.string(customErrors('password')),
})

const LoginSchema = z.object({
    email: z.email(),
    password: z.string(customErrors('password')),
})

module.exports = { singUpSchema, LoginSchema }
