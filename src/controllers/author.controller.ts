const booksDb = require('../index')
const authorTable = require('../models/author.model')
const { eq } = require('drizzle-orm')
import type { Request, Response } from 'express'

const getAllUsers = async (req: Request, res: Response) => {
    const authors = await booksDb.select().from(authorTable)

    res.status(200).json({ message: 'successfull', data: authors })
}

const createUser = async (req: Request, res: Response) => {
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
        .where(eq(authorTable.id, authorId))
        .limit(1)

    res.status(200).json({ message: 'successfull', data: author })
}

module.exports = { getAllUsers, createUser, getAuthorById }
