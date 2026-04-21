const { getMyProfile, updateMyProfile, deleteMyProfile, changePassword } = require('../../controllers/profile/profileController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const catchAsync = require('../../services/catchAsync')
const express = require('express');
const router = express.Router();


router.route('/me').get(isAuthenticated, catchAsync(getMyProfile))
router.route('/change-password').post(isAuthenticated, catchAsync(changePassword))
router.route('/update').patch(isAuthenticated, catchAsync(updateMyProfile))
router.route('/delete').delete(isAuthenticated, catchAsync(deleteMyProfile))


module.exports = router;