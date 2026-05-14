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
      required: [true, "Start date is required"],
      // index: true
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
      // index: true
    },

    // snapshot of rent at booking time (for history)
    // rentAtBooking: {
    //   type: Number,
    //   required: true
    // },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      index: true
    },
    
    totalAmount: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },

    approvedAt: Date,
    cancelledAt: Date,
    rejectedAt: Date,

    cancellationReason: {
       type: String,
      maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
    },

    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters']
    },

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


module.exports = mongoose.model("Booking", bookingSchema);
