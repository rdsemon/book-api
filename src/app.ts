const express = require('express')
const bookRouter = require('./routes/book.routes')
const userRouter = require('./routes/user.routes')
const authRouter = require('./routes/auth.routes')
const globalError = require('./controllers/error.controller')
const app = express()
import type { Request, Response, NextFunction } from 'express'

app.use(express.json())

app.use('/api/v1/', bookRouter)
app.use('/api/v1/', userRouter)
app.use('/api/v1/auth', authRouter)

//catch all the invalid route error*
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        stauts: 'fail',
        message: `can't find path ${req.originalUrl} on this server`,
    })
})

// gloable error handler

app.use(globalError)

module.exports = app
