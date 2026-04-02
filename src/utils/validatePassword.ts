const dotenv = require('dotenv')
dotenv.config()
const bcrypt = require('bcrypt')

const soltRounds = Number(process.env.BCRYPT_SOLT_ROUNDS)

const createHashPassword = async (inputPassword: string) => {
    const hashPassword = await bcrypt.hash(inputPassword, soltRounds)

    return hashPassword
}

const checkPassword = async (inputPassword: string, bdPassword: string) => {
    const isVallidPassword = await bcrypt.compare(inputPassword, bdPassword)

    return isVallidPassword
}

module.exports = { createHashPassword, checkPassword }
