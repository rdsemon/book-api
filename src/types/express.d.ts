// 1. Import the specific table/type from your model file
const { usersTable } = require('../models/users.model')

// 2. Use 'typeof' if usersTable is a runtime object (like a Drizzle schema)
// or use it directly if it's an interface/type.
type UserType = typeof usersTable

declare global {
    namespace Express {
        interface Request {
            // 3. This tells TS: "req.user is the same shape as usersTable"
            user?: UserType
        }
    }
}
