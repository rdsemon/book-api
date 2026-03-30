const booksDB = require('../index')
const booksTable = require('../models/books.model')
const usersTable = require('../models/users.model')
const AppError = require('../utils/AppError')
const catchAsyncHandler = require('../utils/catchAsyncHandler')
const { eq } = require('drizzle-orm')
const { sql } = require('drizzle-orm')
import type { Request, Response, NextFunction } from 'express'

const getallBooks = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const search = req.params.search as string

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
        const bookData = {
            ...req.body,
        }

        const [book] = await booksDB
            .insert(booksTable)
            .values(bookData)
            .returning({ bookId: booksTable.id })

        res.status(201).json({ message: `book is crated id: ${book.bookId}` })
    }
)

const getBookById = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const bookId = req.params.uuid

        if (!bookId) return next(new AppError('Book id is required', 404))

        const book = await booksDB
            .select()
            .from(booksTable)
            .where(eq(booksTable.id, bookId))
            .limit(1)
            .leftJoin(usersTable, eq(usersTable.id, booksTable.authorId))

        if (!book) return next(new AppError('Book is not found', 404))

        res.status(200).json({ message: 'successfull', data: book })
    }
)

const updateBook = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { uuid } = req.params
        if (!uuid) return next(new AppError('id is required', 400))

        const updates = req.body
        if (!updates || Object.keys(updates).length === 0) {
            return next(new AppError('No fields provided to update', 400))
        }
        await booksDB
            .update(booksTable)
            .set(updates)
            .where(eq(booksTable.id, uuid))

        res.status(201).json({ message: 'Book is updated' })
    }
)

const deleteBook = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { uuid } = req.params

        if (!uuid) return next(new AppError('Id is required', 404))

        const book = await booksDB
            .delete(booksTable)
            .where(eq(booksTable.id, uuid))

        if (!book) return next(new AppError('Book is not found', 404))

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
