const dotenv = require('dotenv')
dotenv.config()
const server = require('./app')

const port = process.env.PORT || 5000

process.on('unhandledRejection', (reason: unknown) => {
    if (reason instanceof Error) {
        console.error('Unhandled Rejection:', reason.message)
    } else {
        console.error('Unhandled Rejection:', reason)
    }

    process.exit(1)
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
