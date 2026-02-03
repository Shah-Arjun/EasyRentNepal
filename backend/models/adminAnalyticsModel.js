const mongoose = require("mongoose");

const adminAnalyticsSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },

    fromDate: {          //Start date of the analytics period
      type: Date,
      required: true,
    },

    toDate: {            //end date of the analytics period
      type: Date,
      required: true,
    },

    totalUsers: {        //total no. of registered user in the system
      type: Number,
      default: 0,
    },

    totalProperties: {     // total number of registered properties
      type: Number,
      default: 0,
    },

    totalBookings: {        //Total number of bookings made during a period
      type: Number,
      default: 0,
    },

    totalRevenue: {   //total successful payments during period
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,      // createdAt = generatedAt
  }
);


// Index to quickly fetch analytics by period and date range, prevents full db scan
adminAnalyticsSchema.index({ period: 1, fromDate: 1 });

module.exports = mongoose.model("AdminAnalytics", adminAnalyticsSchema);
