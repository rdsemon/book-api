const booksDb = require('../index')
const usersTable = require('../models/users.model')
const bookTable = require('../models/books.model')
const { eq } = require('drizzle-orm')
import type { Request, Response } from 'express'

const getAllUser = async (req: Request, res: Response) => {
    const usres = await booksDb.select().from(usersTable)

    res.status(200).json({ message: 'successfull', data: usres })
}

const createUser = async (req: Request, res: Response) => {
    const userData = {
        ...req.body,
    }

    const [user] = await booksDb
        .insert(usersTable)
        .values(userData)
        .returning({ insertedId: usersTable.id })

    res.status(201).json({
        message: `user is created id:${user.insertedId}`,
    })
}

const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.uuid
    const user = await booksDb
        .select()
        .from(usersTable)
        .leftJoin(bookTable, eq(usersTable.id, bookTable.userId))
        .where(eq(usersTable.id, userId))

    res.status(200).json({ message: 'successfull', data: user })
}

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.uuid

    const [user] = await booksDb
        .select({
            userId: usersTable.id,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))

    if (!user) {
        return res.status(404).json({ error: 'user dose not exsist' })
    }

    await booksDb.delete(usersTable).where(eq(usersTable.id, userId))

    res.status(200).json({
        message: `account deleting successfull for id ${userId}`,
    })
}

module.exports = { getAllUser, createUser, getUserById, deleteUser }
