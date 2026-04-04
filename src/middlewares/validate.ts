const AppError = require('../utils/AppError')
const formatZodError = require('../utils/formatZodError')
import type { Request, Response, NextFunction } from 'express'

const validate =
    (schema: any) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        })

        console.log(result)

        if (!result.success) {
            return next(new AppError(formatZodError(result.error), 400))
        }

        req.body = result.data.body
        req.params = result.data.params
        next()
    }

module.exports = validate
