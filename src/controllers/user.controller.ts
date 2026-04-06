const booksDb = require('../index')
const { usersTable } = require('../models/users.model')
const bookTable = require('../models/books.model')
const AppError = require('../utils/AppError')
const catchAsyncHandler = require('../utils/catchAsyncHandler')
const { eq } = require('drizzle-orm')
import type { Request, Response, NextFunction } from 'express'

const getAllUser = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const usres = await booksDb.select().from(usersTable)

        res.status(200).json({ message: 'successfull', data: usres })
    }
)

const getUserById = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.uuid

        const user = await booksDb
            .select()
            .from(usersTable)
            .leftJoin(bookTable, eq(usersTable.id, bookTable.userId))
            .where(eq(usersTable.id, userId))

        if (!user || user.length === 0)
            return next(new AppError('User not found', 404))

        res.status(200).json({ message: 'successfull', data: user })
    }
)

const deleteUser = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.uuid

        const [user] = await booksDb
            .select({
                userId: usersTable.id,
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId))

        if (!user) {
            return next(new AppError('user not found', 404))
        }

        await booksDb.delete(usersTable).where(eq(usersTable.id, userId))

        res.status(200).json({
            message: `account deleting successfull for id ${userId}`,
        })
    }
)

module.exports = { getAllUser, getUserById, deleteUser }
