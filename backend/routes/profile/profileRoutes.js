const { getMyProfile, updateMyProfile, deleteMyProfile } = require('../../controllers/profile/profileController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const catchAsync = require('../../services/catchAsync')
const express = require('express');
const router = express.Router();


router.route('/')
    .get(isAuthenticated, catchAsync(getMyProfile))
    .patch(isAuthenticated, catchAsync(updateMyProfile))
    .delete(isAuthenticated, catchAsync(deleteMyProfile))


module.exports = router;