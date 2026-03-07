const { getMyProfile } = require('../../controllers/profile/profileController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const catchAsync = require('../../services/catchAsync')


const router = require('express').Router()


router.route('/').get(isAuthenticated, catchAsync(getMyProfile))


module.exports = router