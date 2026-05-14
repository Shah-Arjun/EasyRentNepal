const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/isAuthenticated');
const restrictTo = require('../../middleware/restrictTo');
const catchAsync = require('../../services/catchAsync');
const upload = require('../../middleware/upload');
const {
  createBooking,
  getTenantBookings,
  getOwnerBookings,
  updateBookingStatus,
} = require('../../controllers/booking/bookingController');

// ── Tenant routes ─────────────────────────────────────────────────────────────
router.post(
  '/',
  isAuthenticated,
  restrictTo('tenant'),
  upload.single('proofImage'),
  catchAsync(createBooking)
);

router.get(
  '/my-bookings',
  isAuthenticated,
  restrictTo('tenant'),
  catchAsync(getTenantBookings)
);

// ── Owner routes ──────────────────────────────────────────────────────────────
router.get(
  '/owner',
  isAuthenticated,
  restrictTo('owner'),
  catchAsync(getOwnerBookings)
);

router.patch(
  '/:bookingId/status',
  isAuthenticated,
  restrictTo('owner'),
  catchAsync(updateBookingStatus)
);

module.exports = router;
