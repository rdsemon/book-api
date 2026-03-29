const express = require('express')
const bookRouter = require('./routes/book.routes')
const userRouter = require('./routes/user.routes')
const app = express()
import type { Request, Response, NextFunction } from 'express'

app.use(express.json())

app.use('/api/v1/', bookRouter)
app.use('/api/v1/', userRouter)

//catch all the invalid route error

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        stauts: 'fail',
        message: `con't find path ${req.originalUrl} on this server`,
    })
})

// gloable error handler

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
})

module.exports = app
