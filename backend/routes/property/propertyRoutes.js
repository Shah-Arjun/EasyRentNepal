const { addProperty, getProperties } = require('../../controllers/property/propertyController')
const catchAsync = require('../../services/catchAsync')

const router = require('express').Router()


// property routes endpoints
router.route('/addProperty').post(catchAsync(addProperty))
router.route('/').get(catchAsync(getProperties))


module.exports = router