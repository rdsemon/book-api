const express = require('express')
const userController = require('../controllers/user.controller')
const validate = require('../middlewares/validate')
const uuidSchema = require('../zodSchema/uuid.schema')
const router = express.Router()

const { getAllUser, getUserById, deleteUser } = userController
const { protect, restictedTo } = require('../controllers/auth.controller')

router.route('/user').get(protect, restictedTo('admin'), getAllUser)
router
    .route('/user/:uuid')
    .get(validate(uuidSchema), protect, getUserById)
    .delete(
        validate(uuidSchema),
        protect,
        restictedTo('author', 'admin'),
        deleteUser
    )

module.exports = router
