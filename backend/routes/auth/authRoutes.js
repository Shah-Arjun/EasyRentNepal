const router = require('express').Router()

const catchAsync = require('../../services/catchAsync')
const isAuthenticated = require('../../middleware/isAuthenticated')
const {registerUser, loginUser, forgetPassword, verifyOtp, resetPassword, logoutUser, verifyRegisterOtp, resendOtp } = require('../../controllers/auth/authController')


// routes endpoints
router.route('/register').post(catchAsync(registerUser))
router.route('/register/verify-otp').post(catchAsync(verifyRegisterOtp))
router.route('/register/resend-otp').post(catchAsync(resendOtp))

router.route('/login').post(catchAsync(loginUser))
router.route('/logout').post(isAuthenticated, catchAsync(logoutUser))

router.route('/forgetPassword').post(catchAsync(forgetPassword))
router.route('/verifyOtp').post(catchAsync(verifyOtp))
router.route('/resetPassword').post(catchAsync(resetPassword))


module.exports = router