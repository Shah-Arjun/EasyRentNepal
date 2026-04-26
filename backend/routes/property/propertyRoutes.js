const { addProperty, getProperties, getSingleProperty, getOwnerProperties, deleteProperty, getOwnerDashboardData } = require('../../controllers/property/propertyController')
const catchAsync = require('../../services/catchAsync')
const isAuthenticated = require('../../middleware/isAuthenticated')
const restrictTo = require('../../middleware/restrictTo')
const upload = require('../../middleware/upload')
const { getSimilarRecommendProperties } = require('../../controllers/property/recommendController')

const router = require('express').Router()


// property routes endpoints
router.route('/addProperty').post(isAuthenticated, restrictTo('owner'), upload.array("images", 5), catchAsync(addProperty))   // //field name image will have max 5 files
router.route('/owner').get(isAuthenticated, restrictTo('owner'), catchAsync(getOwnerProperties))
router.route('/owner-dashboard').get(isAuthenticated, restrictTo('owner'), catchAsync(getOwnerDashboardData))
router.route('/').get(catchAsync(getProperties))
router.route('/:id').get(catchAsync(getSingleProperty))
router.route('/:id').delete(isAuthenticated, restrictTo('owner'), catchAsync(deleteProperty))
router.route('/recommend/:id').get(catchAsync(getSimilarRecommendProperties))   // get top 10 similar properties based on vector search


module.exports = router