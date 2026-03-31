const {
    pgTable,
    varchar,
    uuid,
    timestamp,
    pgEnum,
} = require('drizzle-orm/pg-core')

const roleEnum = pgEnum('role', ['admin', 'author', 'user'])

const usersTable = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 60 }).notNull(),
    email: varchar('email', { length: 200 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: roleEnum('role').notNull().default('user'),

    createdAt: timestamp('created_at').defaultNow(),
})

module.exports = {
    usersTable,
    roleEnum,
}
