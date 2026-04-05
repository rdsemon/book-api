const express = require('express')
const userController = require('../controllers/user.controller')
const validate = require('../middlewares/validate')
const uuidSchema = require('../zodSchema/uuid.schema')
const router = express.Router()

const { getAllUser, getUserById, deleteUser } = userController

router.route('/user').get(getAllUser)
router
    .route('/user/:uuid')
    .get(validate(uuidSchema), getUserById)
    .delete(validate(uuidSchema), deleteUser)

module.exports = router
