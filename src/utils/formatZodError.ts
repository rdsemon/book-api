const { ZodError } = require('zod')
const formatZodError = (err: any) => {
    if (err instanceof ZodError) {
        //@ts-expect-error use it beccause mgs give an error
        const messages = err.issues.map((mgs) => mgs.message)
        const formatMessage = messages.join(' , ')
        return formatMessage
    }
}

module.exports = formatZodError
