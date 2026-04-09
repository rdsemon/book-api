import { InferSelectModel } from 'drizzle-orm'
import { usersTable } from '../models/users.model'

type UserType = InferSelectModel<typeof usersTable>

declare global {
    namespace Express {
        interface Request {
            user?: UserType
            rateLimit?: {
                limit: number
                current: number
                remaining: number
                resetTime?: Date
            }
        }
    }
}

export {}
