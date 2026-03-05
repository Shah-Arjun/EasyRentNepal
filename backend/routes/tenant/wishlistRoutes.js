const { addToWishlist, getMyWishlist } = require('../../controllers/tenant/wishListController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const restrictTo = require('../../middleware/restrictTo')
const catchAsync = require('../../services/catchAsync')

const router = require('express').Router()


router.route('/').get(isAuthenticated, restrictTo('tenant') ,catchAsync(getMyWishlist))
router.route('/:propertyId').post(isAuthenticated, restrictTo('tenant'), catchAsync(addToWishlist))


module.exports = router