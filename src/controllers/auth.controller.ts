const { usersTable } = require('../models/users.model')
const bookDb = require('../index')
const bcrypt = require('bcrypt')
const catchAsyncHandler = require('../utils/catchAsyncHandler')
const AppError = require('../utils/AppError')
const { eq } = require('drizzle-orm')
import type { Request, Response, NextFunction } from 'express'

const singUp = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const saltRounds = 10

        const { name, email, password, role } = req.body

        if (!name || !email || !password)
            return next(new AppError('some information is missing ', 404))

        const hashPassword = await bcrypt.hash(password, saltRounds)

        const userData = {
            name,
            email,
            password: hashPassword,
            role,
        }

        const [user] = await bookDb
            .insert(usersTable)
            .values(userData)
            .returning({ id: usersTable.id })

        if (!user.id) return next(new AppError('singUp fial', 404))

        res.status(201).json({
            status: 'successfull',
            message: `account is created id ${user.id}`,
        })
    }
)

const login = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body

        if (!email || !password)
            return next(new AppError('email or password is missing', 404))

        const user = await bookDb
            .select({ password: usersTable.password })
            .from(usersTable)
            .where(eq(usersTable.email, email))

        if (user.length === 0) return next(new AppError('user not found', 401))

        const dbPass = user[0].password

        const validLogin = await bcrypt.compare(password, dbPass)

        if (!validLogin)
            return next(new AppError('Wrong email or password', 401))

        res.status(200).json({
            status: 'successfull',
            message: 'Login successfull',
        })
    }
)
module.exports = { singUp, login }
