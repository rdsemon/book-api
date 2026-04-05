const { z } = require('zod')
const customError = require('../utils/zodCustomError')

const bookSchema = z.object({
    title: z
        .string(customError('title'))
        .min(10, 'Title can not be empty')
        .trim(),
    description: z.string(customError('description')).trim().optional(),
    price: z
        .number(customError('price'))
        .positive('price must be gratter then 0'),
    userId: z.string(customError('uuid')).uuid(),
})

const createBookSchema = z.object({
    body: bookSchema,
})

const updateBookSchema = z.object({
    params: z.object({
        uuid: z.string(customError('uuid')).uuid(),
    }),

    body: bookSchema
        .partial()
        .refine((data: any) => Object.keys(data).length > 0, {
            message: 'At least one field must be provided for update',
        }),
})

module.exports = {
    createBookSchema,
    updateBookSchema,
}
