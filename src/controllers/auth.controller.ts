const { usersTable } = require('../models/users.model')
const bookDb = require('../index')
const catchAsyncHandler = require('../utils/catchAsyncHandler')
const AppError = require('../utils/AppError')
const { eq } = require('drizzle-orm')

const {
    createHashPassword,
    checkPassword,
} = require('../utils/validatePassword')

const { checkLoginInputs } = require('../validators/auth.validator')

import type { Request, Response, NextFunction } from 'express'

const singUp = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password, role } = req.body

        if (!name || !email || !password)
            return next(new AppError('some information is missing ', 404))

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

        const valiationMessage = checkLoginInputs(email, password)
        if (valiationMessage) {
            return next(new AppError(valiationMessage, 401))
        }

        const user = await bookDb
            .select({ password: usersTable.password })
            .from(usersTable)
            .where(eq(usersTable.email, email))

        if (!user.length) return next(new AppError('user not found', 401))

        const dbPass = user[0].password

        const validLogin = await checkPassword(password, dbPass)

        if (!validLogin)
            return next(new AppError('Wrong email or password', 401))

        res.status(200).json({
            status: 'successfull',
            message: 'Login successfull',
        })
    }
)
module.exports = { singUp, login }
