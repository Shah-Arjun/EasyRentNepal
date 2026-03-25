const { createPropertyReview, getPropertyRviewsByMe, deletePropertyReviewMe, getPropertyReviews } = require('../../controllers/tenant/reviewsController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const restrictTo = require('../../middleware/restrictTo')
const catchAsync = require('../../services/catchAsync')


const router = require('express').Router()


router.route("/")
    .get(isAuthenticated, catchAsync(getPropertyRviewsByMe))

router.route('/:id')
    .post(isAuthenticated, restrictTo('tenant'), catchAsync(createPropertyReview))
    .delete(isAuthenticated, catchAsync(deletePropertyReviewMe))

router.get('/property/:propertyId', catchAsync(getPropertyReviews))

module.exports = router