const { z } = require('zod')
const customErrors = require('../utils/zodCustomError')

const singUpSchema = z.object({
    body: z
        .object({
            name: z
                .string(customErrors('name'))
                .min(1, 'Name is required')
                .refine((val: string) => !/[<>]/.test(val), {
                    message: 'Invalid characters are not allowed',
                }),
            email: z
                .string({ required_error: 'Email is required' })
                .trim()
                .toLowerCase()
                .email({ message: 'Invalid email address format' }),
            password: z.string(customErrors('password')),
            role: z.enum(['user', 'author', 'admin']).optional(),
        })
        .partial()
        .refine((data: any) => Object.keys(data).length > 0, {
            message: 'please fill up the form',
        }),
})

const LoginSchema = z.object({
    body: z
        .object({
            email: z.email(),
            password: z.string(customErrors('password')),
        })
        .partial()
        .refine((data: any) => Object.keys(data).length > 0, {
            message: 'please fill up the form',
        }),
})

module.exports = { singUpSchema, LoginSchema }
