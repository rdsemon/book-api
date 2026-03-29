const express = require('express')
const userController = require('../controllers/user.controller')
const router = express.Router()

const { getAllUser, createUser, getUserById, deleteUser } = userController

router.route('/user').get(getAllUser).post(createUser)
router.route('/user/:uuid').get(getUserById).delete(deleteUser)

module.exports = router
