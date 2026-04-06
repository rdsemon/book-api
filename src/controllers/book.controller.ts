const catchAsyncHandler = require('../utils/catchAsyncHandler')
const AppError = require('../utils/AppError')
const booksTable = require('../models/books.model')
const { usersTable } = require('../models/users.model')
const { eq } = require('drizzle-orm')
const { sql } = require('drizzle-orm')
const booksDB = require('../index')
import type { Request, Response, NextFunction } from 'express'

const getallBooks = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const search = req.query.search as string

        let books

        if (search) {
            books = await booksDB
                .select()
                .from(booksTable)
                .where(
                    sql`to_tsvector('english', ${booksTable.title}) @@ to_tsquery('english', ${search})`
                )
        } else {
            books = await booksDB.select().from(booksTable)
        }

        return res
            .status(200)
            .json({ message: 'Action successfull', data: books })
    }
)

const createBook = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { title, description, price, userId } = req.body
        const bookData = {
            title,
            description,
            price,
            userId,
        }

        const [book] = await booksDB
            .insert(booksTable)
            .values(bookData)
            .returning({ bookId: booksTable.id })

        res.status(201).json({
            message: `book is crated id: ${book.bookId}`,
        })
    }
)

const getBookById = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const bookId = req.params.uuid

        const book = await booksDB
            .select()
            .from(booksTable)
            .where(eq(booksTable.id, bookId))
            .leftJoin(usersTable, eq(usersTable.id, booksTable.userId))

        if (book.length === 0)
            return next(new AppError('Book is not found', 404))

        res.status(200).json({ message: 'successfull', data: book })
    }
)

const updateBook = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { uuid } = req.params
        const updateValues = req.body

        const [book] = await booksDB
            .update(booksTable)
            .set(updateValues)
            .where(eq(booksTable.id, uuid))
            .returning({ bookId: booksTable.id })

        res.status(201).json({ message: `Book is updated ${book.bookId}` })
    }
)

const deleteBook = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { uuid } = req.params

        const book = await booksDB

            .delete(booksTable)
            .where(eq(booksTable.id, uuid))

        if (book.length === 0)
            return next(new AppError('Book is not found', 404))

        res.status(200).json({ message: 'Book is deleted' })
    }
)

module.exports = {
    createBook,
    getallBooks,
    updateBook,
    deleteBook,
    getBookById,
}
