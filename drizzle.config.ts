const dotenv = require('dotenv')
dotenv.config()

const { defineConfig } = require('drizzle-kit')

const config = defineConfig({
    out: '../drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL2,
    },
})

module.exports = config
