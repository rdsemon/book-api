const booksDb = require('../index')
const authorTable = require('../models/author.model')
const bookTable = require('../models/books.model')
const { eq } = require('drizzle-orm')
import type { Request, Response } from 'express'

const getAllAuthor = async (req: Request, res: Response) => {
    const authors = await booksDb.select().from(authorTable)

    res.status(200).json({ message: 'successfull', data: authors })
}

const createAuthor = async (req: Request, res: Response) => {
    const authorData = {
        ...req.body,
    }

    const [author] = await booksDb
        .insert(authorTable)
        .values(authorData)
        .returning({ insertedId: authorTable.id })

    res.status(201).json({
        message: `author is created id:${author.insertedId}`,
    })
}

const getAuthorById = async (req: Request, res: Response) => {
    const authorId = req.params.uuid
    const author = await booksDb
        .select()
        .from(authorTable)
        .leftJoin(bookTable, eq(authorTable.id, bookTable.authorId))
        .where(eq(authorTable.id, authorId))

    res.status(200).json({ message: 'successfull', data: author })
}

const deleteAuthor = async (req: Request, res: Response) => {
    const authorId = req.params.uuid

    const [author] = await booksDb
        .select({
            authorId: authorTable.id,
        })
        .from(authorTable)
        .where(eq(authorTable.id, authorId))

    if (!author) {
        return res.status(404).json({ error: 'author dose not exsist' })
    }

    await booksDb.delete(authorTable).where(eq(authorTable.id, authorId))

    res.status(200).json({
        message: `account deleting successfull for id ${authorId}`,
    })
}

module.exports = { getAllAuthor, createAuthor, getAuthorById, deleteAuthor }
