const { getMyProfile, updateMyProfile } = require('../../controllers/profile/profileController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const catchAsync = require('../../services/catchAsync')


const router = require('express').Router()


router.route('/')
    .get(isAuthenticated, catchAsync(getMyProfile))
    .patch(isAuthenticated, catchAsync(updateMyProfile))


module.exports = router