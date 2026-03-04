const { addToWishlist } = require('../../controllers/tenant/wishListController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const catchAsync = require('../../services/catchAsync')

const router = require('express').Router()


router.route('/:propertyId').post(isAuthenticated ,catchAsync(addToWishlist))


module.exports = router