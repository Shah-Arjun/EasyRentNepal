const { addProperty, getProperties } = require('../../controllers/property/propertyController')
const catchAsync = require('../../services/catchAsync')
const isAuthenticated = require('../../middleware/isAuthenticated')

const router = require('express').Router()


// property routes endpoints
router.route('/addProperty').post(isAuthenticated, catchAsync(addProperty))
router.route('/').get(catchAsync(getProperties))


module.exports = router