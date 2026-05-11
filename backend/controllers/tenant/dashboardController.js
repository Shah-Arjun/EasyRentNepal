const Booking = require('../../models/bookingModel')
const Payment = require('../../models/paymentModel')
const Review = require('../../models/reviewModel')
const Wishlist = require('../../models/wishlistModel')

// Tenant dashboard summary
exports.getTenantDashboardData = async (req, res) => {
  try {
    const tenantId = req.user.id

    const [bookings, payments, reviews, wishlistItems] = await Promise.all([
      Booking.find({ tenant: tenantId, isDeleted: { $ne: true } })
        .populate('property', 'title images price location status')
        .sort({ createdAt: -1 }),
      Payment.find({ tenantId })
        .sort({ createdAt: -1 }),
      Review.find({ userId: tenantId })
        .populate('propertyId', 'title')
        .sort({ createdAt: -1 }),
      Wishlist.find({ userId: tenantId })
        .populate('propertyId', 'title images price location status')
        .sort({ createdAt: -1 })
    ])

    const activeBookings = bookings.filter(
      booking => booking.status === 'approved' || booking.status === 'pending'
    )

    const confirmedPayments = payments.filter(payment => payment.status === 'confirmed')
    const totalSpent = confirmedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)

    res.status(200).json({
      success: true,
      stats: {
        totalBookings: bookings.length,
        activeBookings: activeBookings.length,
        pendingBookings: bookings.filter(booking => booking.status === 'pending').length,
        wishlistCount: wishlistItems.length,
        totalReviews: reviews.length,
        confirmedPayments: confirmedPayments.length,
        totalSpent,
      },
      recentBookings: bookings.slice(0, 5),
      recentPayments: payments.slice(0, 5),
      recentReviews: reviews.slice(0, 5),
      recentWishlist: wishlistItems
        .map(item => item.propertyId)
        .filter(Boolean)
        .slice(0, 6),
    })
  } catch (error) {
    console.error('Error fetching tenant dashboard data:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tenant dashboard data',
    })
  }
}

// Tenant bookings list
exports.getTenantBookings = async (req, res) => {
  try {
    const tenantId = req.user.id

    const bookings = await Booking.find({ tenant: tenantId, isDeleted: { $ne: true } })
      .populate('property', 'title images price location status')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: bookings,
    })
  } catch (error) {
    console.error('Error fetching tenant bookings:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tenant bookings',
    })
  }
}

// Tenant payments list
exports.getTenantPayments = async (req, res) => {
  try {
    const tenantId = req.user.id

    const payments = await Payment.find({ tenantId })
      .populate('ownerId', 'name email phoneNumber')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: payments,
    })
  } catch (error) {
    console.error('Error fetching tenant payments:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tenant payments',
    })
  }
}
