const { z, ZodError } = require('zod')

const customErrors = (fieldName: string) => {
    const customeMessage = {
        error: (iss: any) =>
            iss.input === undefined
                ? `${fieldName} is required`
                : `invalid input: require string but given ${typeof iss.input}`,
    }
    return customeMessage
}

const checkLoginInputs = (email: string, password: string) => {
    const LoginSchema = z.object({
        email: z.email(),
        password: z.string(customErrors('password')),
    })

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
