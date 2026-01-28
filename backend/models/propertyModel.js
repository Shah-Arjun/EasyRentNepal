const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    // OWNER (who listed the property)
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

    // BHK CONFIGURATION (for flat/house/apartment)
    bhk: {
      type: String,
      enum: ["Studio", "1BHK", "2BHK", "3BHK", "4BHK"],
      required: function () {
        return this.propertyType !== "room";
      },
    },

    // FURNISHING STATUS
    furnishedType: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "fully-furnished"],
      default: "unfurnished",
    },

    // LOCATION DETAILS
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
      lat: Number,
      lng: Number,
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

    // PRICING
    rent: {
      type: Number,
      required: true,
    },

    // STATUS & META
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

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", propertySchema);
