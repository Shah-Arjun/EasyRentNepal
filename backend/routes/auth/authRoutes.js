const router = require('express').Router()

const catchAsync = require('../../services/catchAsync')
const {registerUser, verifyRegistrationOtp, loginUser, verifyLoginOtp, forgetPassword, verifyOtp, resetPassword} = require('../../controllers/auth/authController')


// routes endpoints
router.route('/register').post(catchAsync(registerUser))
router.route('/login').post(catchAsync(loginUser))
router.route('/forgetPassword').post(catchAsync(forgetPassword))
router.route('/verifyRegistrationOtp').post(catchAsync(verifyRegistrationOtp))
router.route('/verifyLoginOtp').post(catchAsync(verifyLoginOtp))
router.route('/verifyOtp').post(catchAsync(verifyOtp))
router.route('/resetPassword').post(catchAsync(resetPassword))


module.exports = router