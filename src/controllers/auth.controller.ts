const { usersTable } = require('../models/users.model')
const bookDb = require('../index')
const bcrypt = require('bcrypt')
const catchAsyncHandler = require('../utils/catchAsyncHandler')
const AppError = require('../utils/AppError')
import type { Request, Response, NextFunction } from 'express'

const singUp = catchAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const saltRounds = 10

        const { name, email, password } = req.body

        if (!name || !email || !password)
            return next(new AppError('some information is missing ', 404))

        const hashPassword = await bcrypt.hash(password, saltRounds)

        const userData = {
            name,
            email,
            password: hashPassword,
        }

        const user = await bookDb
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

module.exports = { singUp }
