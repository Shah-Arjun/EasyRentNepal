const { createRoom } = require('../../controllers/property/propertyController')
const catchAsync = require('../../services/catchAsync')

const router = require('express').Router()


// property routes endpoints
router.route('/').post(catchAsync(createRoom))


module.exports = router