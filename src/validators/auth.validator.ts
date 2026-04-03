const { z, ZodError } = require('zod')
const { LoginSchema } = require('./auth.schema')

const checkLoginInputs = (email: string, password: string) => {
    try {
        LoginSchema.parse({ email, password })
    } catch (err: any) {
        if (err instanceof ZodError) {
            //@ts-expect-error use it beccause mgs give an error
            const messages = err.issues.map((mgs) => mgs.message)
            const formatMessage = messages.join(' , ')
            return formatMessage
        }
    }
}

//

module.exports = { checkLoginInputs }
