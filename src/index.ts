require('dotenv/config')
const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL2 })

// const booksDb = drizzle(process.env.DATABASE_URL)
const booksDb = drizzle(pool)

module.exports = booksDb
