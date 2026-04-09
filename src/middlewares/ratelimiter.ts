const rateLimit = require('express-rate-limit')
import type { Request, Response, NextFunction } from 'express'

const apiLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 10,
    message: {
        status: 'fail',
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
})

const authLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    handler: (
        req: Request,
        res: Response,
        next: NextFunction,
        options: any
    ) => {
        const remaining = req.rateLimit?.remaining ?? 0

        res.status(options.statusCode).json({
            status: 'fail',
            message: `Too many attempts. Try again later.`,
            attemptsLeft: remaining,
        })
    },
})

module.exports = { apiLimiter, authLimiter }
