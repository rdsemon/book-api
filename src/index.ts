require('dotenv/config')
const { drizzle } = require('drizzle-orm/node-postgres')

const booksDb = drizzle(process.env.DATABASE_URL)

module.exports = booksDb
