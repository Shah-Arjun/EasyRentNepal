const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },

    startDate: {
      type: Date,
      // required: true,
      // index: true
    },

    endDate: {
      type: Date,
      // required: true,
      // index: true
    },

    // snapshot of rent at booking time (for history)
    // rentAtBooking: {
    //   type: Number,
    //   required: true
    // },

    // totalAmount: {
    //   type: Number,
    //   required: true
    // },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
      index: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },

    approvedAt: Date,
    cancelledAt: Date,
    rejectedAt: Date,

    cancellationReason: String,
    rejectionReason: String,

    isActive: {   //is booking active
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    },
  
  },
  {
    timestamps: true,
  }
);


//prevent overlapping bookings for same property
bookingSchema.index({ property: 1, startDate: 1, endDate: 1})

module.exports = mongoose.model("Booking", bookingSchema);
