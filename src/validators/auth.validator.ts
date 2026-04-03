const {
    singUpSchema,
    LoginSchema,
} = require('../validators/zodSchema/auth.schema')
const formatZodError = require('../utils/formatZodError')

const validateSingUpInputs = (obj: object) => {
    try {
        singUpSchema.parse({ ...obj })
        return { isValid: true, error: null }
    } catch (err: any) {
        return { isValid: false, error: formatZodError(err) }
    }
}

const validateLoginInputs = (email: string, password: string) => {
    try {
        LoginSchema.parse({ email, password })
        return { isValid: true, error: null }
    } catch (err: any) {
        return { isValid: false, error: formatZodError(err) }
    }
}

module.exports = { validateSingUpInputs, validateLoginInputs }
