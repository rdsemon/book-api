import type { Request, Response, NextFunction } from 'express'

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>

const catchAsyncHandler = (fn: AsyncHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = catchAsyncHandler
