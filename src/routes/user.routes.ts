const express = require('express')
const userController = require('../controllers/user.controller')
const validate = require('../middlewares/validate')
const uuidSchema = require('../zodSchema/uuid.schema')
const router = express.Router()

const { getAllUser, getUserById, deleteUser } = userController
const { protect, restictedTo } = require('../controllers/auth.controller')

//middleware chain

const getUserByIdMiddleware = [validate(uuidSchema), protect]
const deleteUserMiddleware = [
    validate(uuidSchema),
    protect,
    restictedTo('author', 'user'),
]

//routes

router.route('/user').get(protect, restictedTo('admin'), getAllUser)
router
    .route('/user/:uuid')
    .get(getUserByIdMiddleware, getUserById)
    .delete(deleteUserMiddleware, deleteUser)

module.exports = router
