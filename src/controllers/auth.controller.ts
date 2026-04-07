const dotenv = require('dotenv')
dotenv.config()
import type { Request, Response, NextFunction } from 'express'
const catchAsyncHandler = require('../utils/catchAsyncHandler')
const { usersTable } = require('../models/users.model')
const AppError = require('../utils/AppError')
const { eq } = require('drizzle-orm')
const bookDb = require('../index')
const jwt = require('jsonwebtoken')

const {
    createHashPassword,
    checkPassword,
} = require('../utils/validatePassword')

const singUp = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password, role } = req.body

        const hashPassword = await createHashPassword(password)

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

        const [user] = await bookDb
            .select({ password: usersTable.password, id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.email, email))

        if (!user) return next(new AppError('user not found', 401))

        const dbPass = user.password

        const validLogin = await checkPassword(password, dbPass)

        if (!validLogin)
            return next(new AppError('Wrong email or password', 401))

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIREIN,
        })

        res.status(200).json({
            status: 'successfull',
            message: 'Login successfull',
            token: token,
        })
    }
)

const protect = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let token

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) return next(new AppError('You are not login', 404))

        const decode = jwt.verify(token, process.env.JWT_SECRET)

        const [user] = await bookDb
            .select({ id: usersTable.id, role: usersTable.role })
            .from(usersTable)
            .where(eq(usersTable.id, decode.userId))

        if (!user.id) return next(new AppError('user dose not exist', 404))

        req.user = user
        next()
    }
)

const restictedTo =
    (...roles: [string]) =>
    (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role)) {
            return next(new AppError('You are not permited to do this', 401))
        }

        next()
    }

module.exports = { singUp, login, protect, restictedTo }
