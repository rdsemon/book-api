const dotenv = require('dotenv')
dotenv.config()
const AppError = require('../utils/AppError')

import type { Request, Response, NextFunction } from 'express'

const handleDuplicateKeyError = () => {
    const message = `Duplicate field value violates unique constraint`
    return new AppError(message, 400)
}

const handleCheckConstraintError = () =>
    new AppError('Invalid data (constraint failed)', 400)

const handleInvalidInputError = () => new AppError('Invalid input format', 400)

const handleNotNullError = () => new AppError(`Missing required field`, 400)

const handleForeignKeyError = () =>
    new AppError('Invalid reference ID (foreign key failed)', 400)

const handleJWTExpiredError = () =>
    new AppError('Your token has expired. Please login again.', 401)

const handleJWTInvalidError = () =>
    new AppError('Invalid token. Please login again.', 401)

const sendErrorDev = (err: any, res: Response) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        stack: err.stack,
        error: err,
    })
}

const sendErrorProd = (err: any, res: Response) => {
    if (err.isOperational) {
        return res.status(err.statusCode || 500).json({
            status: err.status,
            message: err.message,
        })
    }

    console.log('error❌', err)

    res.status(500).json({
        status: 'fail',
        message: 'some thing went worng',
    })
}

const globalError = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        const dbCode = err.cause?.code || err.code
        let error = err
        //for catch error which come form drizzle database
        if (dbCode === '23505') {
            error = handleDuplicateKeyError()
        } else if (dbCode === '23503') {
            error = handleForeignKeyError()
        } else if (dbCode === '23502') {
            error = handleNotNullError()
        } else if (dbCode === '22P02') {
            error = handleInvalidInputError()
        } else if (dbCode === '23514') {
            error = handleCheckConstraintError()
        }

        //catch jwt token error

        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError()
        }

        if (error.name === 'JsonWebTokenError') {
            error = handleJWTInvalidError()
        }

        sendErrorProd(error, res)
    }
}

module.exports = globalError
