import type { Response } from 'express'
const testTheApi = (res: Response) => {
    res.send('Testing the api')
}

module.exports = testTheApi
