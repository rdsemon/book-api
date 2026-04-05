const { z } = require('zod')
const customError = require('../utils/zodCustomError')
const uuidSchema = z.object({
    params: z.object({
        uuid: z.string(customError('uuid')).uuid(),
    }),
})

module.exports = uuidSchema
