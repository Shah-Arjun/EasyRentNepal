const Booking = require('../../models/bookingModel');
const Payment = require('../../models/paymentModel');
const Property = require('../../models/propertyModel');
const uploadToCloudinary = require('../../utils/uploadToCloudinary');

// ─── TENANT: Create booking + upload proof ───────────────────────────────────
exports.createBooking = async (req, res) => {
  try {
    console.log("Create booking hit ");
    // console.log(req.user);
    // console.log(req.body);
    const tenantId = req.user.id;

    // console.log(req.user.id);
    const { propertyId, startDate, endDate } = req.body;

    if (!propertyId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Property, startDate and endDate are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (String(property.owner._id) === tenantId) {
      return res.status(400).json({ success: false, message: 'You cannot book your own property' });
    }

    // Check for existing active booking on this property by this tenant
    const existingBooking = await Booking.findOne({
      tenant: tenantId,
      property: propertyId,
      status: { $in: ['pending', 'approved'] },
      isDeleted: { $ne: true },
    });
    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'You already have an active booking for this property' });
    }

    // Upload proof image if provided
    let proofImageData = null;
    if (req.file) {
      proofImageData = await uploadToCloudinary(req.file.buffer, 'booking-proofs');
    }

    // Create Booking
    const booking = await Booking.create({
      tenant: tenantId,
      owner: property.owner._id,
      property: propertyId,
      startDate,
      endDate,
      totalAmount: property.price?.value || 0,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Create linked Payment record
    await Payment.create({
      tenantId,
      ownerId: property.owner._id,
      propertyId,
      bookingId: booking._id,
      amount: property.price?.value || 0,
      status: 'pending',
      proofImage: proofImageData || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully. Awaiting owner confirmation.',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ─── TENANT: Get my bookings ─────────────────────────────────────────────────
exports.getTenantBookings = async (req, res) => {
  try {
    const tenantId = req.user.id;

    const bookings = await Booking.find({ tenant: tenantId, isDeleted: { $ne: true } })
      .populate('property', 'title images price location status category listingType')
      .populate('owner', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    // Attach payment proof for each booking
    const bookingIds = bookings.map((b) => b._id);
    const payments = await Payment.find({ bookingId: { $in: bookingIds } });
    const paymentMap = {};
    payments.forEach((p) => { paymentMap[String(p.bookingId)] = p; });

    const enriched = bookings.map((b) => ({
      ...b.toObject(),
      payment: paymentMap[String(b._id)] || null,
    }));

    res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    console.error('Get tenant bookings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ─── OWNER: Get all booking requests for owner's properties ──────────────────
exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const bookings = await Booking.find({ owner: ownerId, isDeleted: { $ne: true } })
      .populate('tenant', 'name email phoneNumber profileImage')
      .populate('property', 'title images price location status category listingType')
      .sort({ createdAt: -1 });

    // Attach payment proof
    const bookingIds = bookings.map((b) => b._id);
    const payments = await Payment.find({ bookingId: { $in: bookingIds } });
    const paymentMap = {};
    payments.forEach((p) => { paymentMap[String(p.bookingId)] = p; });

    const enriched = bookings.map((b) => ({
      ...b.toObject(),
      payment: paymentMap[String(b._id)] || null,
    }));

    res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    console.error('Get owner bookings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ─── OWNER: Update booking and payment status dynamically ────────────────────
exports.updateBookingStatus = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { bookingId } = req.params;
    const { bookingStatus, paymentStatus, propertyStatus, reason } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, owner: ownerId });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or unauthorised' });
    }

    const property = await Property.findById(booking.property);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Associated property not found' });
    }

    let newPropertyStatus = propertyStatus || property.status;

    // Handle booking status update
    if (bookingStatus && bookingStatus !== booking.status) {
      booking.status = bookingStatus;
      
      if (bookingStatus === 'approved') {
        booking.approvedAt = new Date();
        // If not manually overriding property status, set to Booked/Rented
        if (!propertyStatus) {
          newPropertyStatus = property.listingType === 'Sale' ? 'Sold' : 'Rented';
        }
        
        // Reject any other pending bookings for the same property
        await Booking.updateMany(
          { property: booking.property, _id: { $ne: booking._id }, status: 'pending' },
          { status: 'rejected', rejectedAt: new Date(), rejectionReason: 'Property was booked by another tenant' }
        );
      } else if (bookingStatus === 'rejected') {
        booking.rejectedAt = new Date();
        if (reason) booking.rejectionReason = reason;
        
        // If changing Approved -> Rejected, revert property to Available
        if (!propertyStatus) {
          newPropertyStatus = 'Available';
        }
      } else if (bookingStatus === 'pending') {
        // If changing Approved -> Pending, revert property to Available
        if (!propertyStatus) {
          newPropertyStatus = 'Available';
        }
      }
    }

    // Handle payment status update
    if (paymentStatus && paymentStatus !== booking.paymentStatus) {
      booking.paymentStatus = paymentStatus;
      // Update linked payment collection if necessary
      let mappedPaymentStatus = paymentStatus;
      if (paymentStatus === 'paid') mappedPaymentStatus = 'confirmed';
      await Payment.findOneAndUpdate({ bookingId: booking._id }, { status: mappedPaymentStatus });
    }

    // Handle property status update
    if (newPropertyStatus !== property.status) {
      property.status = newPropertyStatus;
      await property.save();
    }

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('tenant', 'name email phoneNumber profileImage')
      .populate('property', 'title images price status location category listingType');

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      booking: updated,
      propertyStatus: property.status,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
