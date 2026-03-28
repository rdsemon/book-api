const { pgTable, varchar, uuid, timestamp } = require('drizzle-orm/pg-core')

const usersTable = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 60 }).notNull(),
    email: varchar('email', { length: 200 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
})

module.exports = usersTable
