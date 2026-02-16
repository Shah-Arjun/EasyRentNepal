// for recommendation system

const mongoose = require("mongoose");


const userActivitySchema = new mongoose.Schema(
  {
    // id of User(tenant) whose behavior is being tracked
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true
    },



    // Search history (used for recommendation signals)
    searches: [
      {
        query: String,        // raw search text
        city: String,         // extracted city
        propertyType: String, // room / flat / house
        bhkConfig: String,    // 1BHK, 2BHK, etc
        minPrice: Number,
        maxPrice: Number,
        searchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],


    // Properties viewed by user
    viewedProperties: [
      {
        propertyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],



    // tracks CTA , Contact owner, Book now clicked (strong interest signal)
    clicks: [
      {
        propertyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
        clickedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],



    //  Successful bookings (strongest signal)
    bookings: [
      {
        propertyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
        bookedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],


    //extra info
    signalWeight: Number,
    sessionId: String,

    //geo context
    geoCity: String,
    geoLat: Number,
    geoLng: Number


  },
  {
    timestamps: true,      //updated time
  }
);



module.exports = mongoose.model("UserActivity", userActivitySchema);
