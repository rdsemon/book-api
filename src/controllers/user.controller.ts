const booksDb = require('../index')
const usersTable = require('../models/users.model')
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

const createUser = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, email } = req.body

        if (!name || !email)
            return next(new AppError('name or email is missing', 404))

        const userData = {
            name,
            email,
        }
        const [user] = await booksDb
            .insert(usersTable)
            .values(userData)
            .returning({ insertedId: usersTable.id })

        if (!user.insertedId)
            return next(new AppError('account creation is fail', 404))

        res.status(201).json({
            message: `user is created id:${user.insertedId}`,
        })
    }
)

const getUserById = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.uuid

        if (!userId) {
            return next(new AppError('Id is required', 404))
        }

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

        if (!userId) return next(new AppError('id is required', 404))

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

module.exports = { getAllUser, createUser, getUserById, deleteUser }
