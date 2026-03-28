const {
    integer,
    pgTable,
    varchar,
    uuid,
    text,
    timestamp,
    index,
} = require('drizzle-orm/pg-core')

const { sql } = require('drizzle-orm')

const userTable = require('./users.model')

const booksTable = pgTable(
    'books',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        title: varchar('title', { length: 160 }).notNull(),
        description: text('description'),
        price: integer('price').notNull(),
        userId: uuid('user_id')
            .notNull()
            .references(() => userTable.id, { onDelete: 'cascade' }),

        createdAt: timestamp('created_at').defaultNow(),
    },
    (table: any) => [
        index('title_search_index').using(
            'gin',
            sql`to_tsvector('english', ${table.title})`
        ),
    ]
)

module.exports = booksTable
