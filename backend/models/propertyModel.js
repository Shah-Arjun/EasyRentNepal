const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // PROPERTY TYPE
    propertyType: {
      type: String,
      enum: ["room", "flat", "house", "apartment"],
      required: true,
    },

    // BHK / ROOM CONFIGURATION
    bhk: {
      type: String,
      enum: ["1BHK", "2BHK", "3BHK", "4BHK", "Studio"],
      required: function () {
        return this.propertyType !== "room";
      },
    },

    rooms: {
      type: Number,
      default: 1,
    },

    // FURNISHING STATUS
    furnishedType: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "fully-furnished"],
      default: "unfurnished",
    },

    // LOCATION
    location: {
      streetAddress: {
        type: String,
        required: true,
        trim: true,
      },
      aptSuite: {
        type: String,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      province: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: "Nepal",
      },
      lat: Number,   //latitude
      lng: Number,   // longitude
    },

    // PROPERTY DETAILS
    bedroomCount: {
      type: Number,
      default: 1,
    },
    bathroomCount: {
      type: Number,
      default: 1,
    },
    bedCount: {
      type: Number,
      default: 1,
    },

    // AMENITIES
    amenities: {
      type: [String],
      enum: ["bed", "wifi", "parking", "water", "lpg", "tv", "lift"],
      default: [],
    },

    // IMAGES (CLOUDINARY READY)
    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    // LISTING INFO
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    highlight: {
      type: String,
    },

    highlightDesc: {
      type: String,
    },

    rent: {
      type: Number,
      required: true,
    },

    // STATUS
    availability: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


const Property= mongoose.model("Property", propertySchema);
module.exports = Property;
