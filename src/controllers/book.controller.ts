const bookDb = require('../index')
const booksTable = require('../models/books.model')
const { eq } = require('drizzle-orm')
const { sql } = require('drizzle-orm')
import type { Request, Response } from 'express'

const getallBooks = async (req: Request, res: Response) => {
    const search = req.params.search as string

    let books

    if (search) {
        books = await bookDb
            .select()
            .from(booksTable)
            .where(
                sql`to_tsvector('english', ${booksTable.title}) @@ to_tsquery('english', ${search})`
            )
    } else {
        books = await bookDb.select().from(booksTable)
    }

    return res.status(200).json({ message: 'Action successfull', data: books })
}

const createBook = async (req: Request, res: Response) => {
    const bookData = {
        ...req.body,
    }

    const [book] = await bookDb
        .insert(booksTable)
        .values(bookData)
        .returning({ bookId: booksTable.id })

    res.status(201).json({ message: `book is crated id: ${book.bookId}` })
}

const updateBook = async (req: Request, res: Response) => {
    const { price } = req.body
    const { uuid } = req.params

    await bookDb
        .update(booksTable)
        .set({
            price,
        })
        .where(eq(booksTable.id, uuid))

    res.status(201).json({ message: 'Book is updated' })
}

const deleteBook = async (req: Request, res: Response) => {
    const { uuid } = req.params
    await bookDb.delete(booksTable).where(eq(booksTable.id, uuid))

    res.status(200).json({ message: 'Book is deleted' })
}

module.exports = { createBook, getallBooks, updateBook, deleteBook }
