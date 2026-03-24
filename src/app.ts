const express = require('express')
const bookRouter = require('./routes/book.routes')
const authorRouter = require('./routes/author.routes')
const app = express()

app.use(express.json())

app.use('/api/v1/', bookRouter)
app.use('/api/v1/', authorRouter)

module.exports = app
