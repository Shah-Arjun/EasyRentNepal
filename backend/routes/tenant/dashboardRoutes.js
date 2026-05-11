const {
  getTenantDashboardData,
  getTenantBookings,
  getTenantPayments,
} = require('../../controllers/tenant/dashboardController')
const isAuthenticated = require('../../middleware/isAuthenticated')
const restrictTo = require('../../middleware/restrictTo')
const catchAsync = require('../../services/catchAsync')

const router = require('express').Router()

router.use(isAuthenticated, restrictTo('tenant'))

router.get('/dashboard', catchAsync(getTenantDashboardData))
router.get('/bookings', catchAsync(getTenantBookings))
router.get('/payments', catchAsync(getTenantPayments))

module.exports = router
