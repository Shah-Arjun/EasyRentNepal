const { addToWishlist, getMyWishlist, deletePropertyFromWishlist } = require('../../controllers/tenant/wishListController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const restrictTo = require('../../middleware/restrictTo')
const catchAsync = require('../../services/catchAsync')

const router = require('express').Router()


router.route('/').get(isAuthenticated, restrictTo('tenant', 'owner') ,catchAsync(getMyWishlist))

router.route('/:propertyId')
    .post(isAuthenticated, restrictTo('tenant', 'owner'), catchAsync(addToWishlist))
    .delete(isAuthenticated, restrictTo('tenant', 'owner'), catchAsync(deletePropertyFromWishlist))


module.exports = router