const { addProperty, getProperties, getSingleProperty, getOwnerProperties, deleteProperty } = require('../../controllers/property/propertyController')
const catchAsync = require('../../services/catchAsync')
const isAuthenticated = require('../../middleware/isAuthenticated')
const restrictTo = require('../../middleware/restrictTo')

const router = require('express').Router()


// property routes endpoints
router.route('/addProperty').post(isAuthenticated, restrictTo('owner'), catchAsync(addProperty))
router.route('/owner').get(isAuthenticated, restrictTo('owner'), catchAsync(getOwnerProperties))
router.route('/').get(catchAsync(getProperties))
router.route('/:id').get(catchAsync(getSingleProperty))
router.route('/:id').delete(isAuthenticated, restrictTo('owner'), catchAsync(deleteProperty))


module.exports = router