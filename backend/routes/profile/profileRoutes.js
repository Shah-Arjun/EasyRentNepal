const { getMyProfile, updateMyProfile, deleteMyProfile, changePassword, toggleProfileRole } = require('../../controllers/profile/profileController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const catchAsync = require('../../services/catchAsync')
const express = require('express');
const router = express.Router();



const upload = require('../../middleware/upload')

router.route('/me')
.get(isAuthenticated, catchAsync(getMyProfile))
.patch(isAuthenticated, upload.single('qrImage'), catchAsync(updateMyProfile))
.delete(isAuthenticated, catchAsync(deleteMyProfile));

router.route('/me/password').patch(isAuthenticated, catchAsync(changePassword));

router.route('/toggle-role').patch(isAuthenticated, catchAsync(toggleProfileRole));



module.exports = router;