const booksDB = require('../index')
const booksTable = require('../models/books.model')
const usersTable = require('../models/users.model')
const AppError = require('../utils/AppError')
const catchAsyncHandler = require('../utils/catchAsyncHandler')
const { eq } = require('drizzle-orm')
const { sql } = require('drizzle-orm')
import type { Request, Response, NextFunction } from 'express'

const getallBooks = catchAsyncHandler(async (req: Request, res: Response) => {
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

    return res.status(200).json({ message: 'Action successfull', data: books })
})

const createBook = catchAsyncHandler(async (req: Request, res: Response) => {
    const bookData = {
        ...req.body,
    }

    const [book] = await booksDB
        .insert(booksTable)
        .values(bookData)
        .returning({ bookId: booksTable.id })

    res.status(201).json({ message: `book is crated id: ${book.bookId}` })
})

const getBookById = catchAsyncHandler(async (req: Request, res: Response) => {
    const bookId = req.params.uuid

    const book = await booksDB
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, bookId))
        .limit(1)
        .leftJoin(usersTable, eq(usersTable.id, booksTable.authorId))
    res.status(200).json({ message: 'successfull', data: book })
})

const updateBook = catchAsyncHandler(async (req: Request, res: Response) => {
    const { price } = req.body
    const { uuid } = req.params

    await booksDB
        .update(booksTable)
        .set({
            price,
        })
        .where(eq(booksTable.id, uuid))

    res.status(201).json({ message: 'Book is updated' })
})

const deleteBook = catchAsyncHandler(async (req: Request, res: Response) => {
    const { uuid } = req.params
    await booksDB.delete(booksTable).where(eq(booksTable.id, uuid))

    res.status(200).json({ message: 'Book is deleted' })
})

module.exports = {
    createBook,
    getallBooks,
    updateBook,
    deleteBook,
    getBookById,
}
