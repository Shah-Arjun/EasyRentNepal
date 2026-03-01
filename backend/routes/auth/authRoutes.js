const router = require('express').Router()

const catchAsync = require('../../services/catchAsync')
const {registerUser} = require('../../controllers/auth/authController')


// routes endpoints
router.route('/register').post(catchAsync(registerUser))


module.exports = router