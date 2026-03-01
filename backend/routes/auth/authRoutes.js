const router = require('express').Router()

const catchAsync = require('../../services/catchAsync')
const {registerUser, loginUser} = require('../../controllers/auth/authController')


// routes endpoints
router.route('/register').post(catchAsync(registerUser))
router.route('/login').post(catchAsync(loginUser))


module.exports = router