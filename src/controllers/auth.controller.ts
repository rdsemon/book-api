import type { Request, Response, NextFunction } from 'express'
const catchAsyncHandler = require('../utils/catchAsyncHandler')
const { usersTable } = require('../models/users.model')
const AppError = require('../utils/AppError')
const { eq } = require('drizzle-orm')
const bookDb = require('../index')

const {
    createHashPassword,
    checkPassword,
} = require('../utils/validatePassword')

const {
    validateLoginInputs,
    validateSingUpInputs,
} = require('../validators/auth.validator')

const singUp = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        //validate input with zod
        const { isValid, error } = validateSingUpInputs(req.body)
        if (!isValid) return next(new AppError(error, 404))

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

        //validate input with zod

        const { isValid, error } = validateLoginInputs(email, password)
        if (!isValid) {
            return next(new AppError(error, 401))
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
