const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    // Owner (who listed the property)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // type: String
    },

    // Property type
    propertyType: {
      type: String,
      enum: ["room", "flat", "house", "apartment"],
      required: true,
      index: true
    },

    // BHK configuration (for flat/house/apartment)
    bhk: {
      type: String,
      enum: ["Studio", "1BHK", "2BHK", "3BHK", "4BHK"],
      required: function () {
        return this.propertyType !== "room";
      },
    },

    // Furnished status
    furnishedStatus: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "fully-furnished"],
      default: "unfurnished",
    },
    kitchenType: {
      type: String,
      enum: ["private", "shared"],
      default: "shared",
    },

    // property location details-->object
    location: {
      streetAddress: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
        index: true
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

    // Property details
    bedroomCount: {
      type: Number,
      default: 1,
    },
    bathroomCount: {
      type: Number,
      default: 1,
    },
     bathroomType: {
      type: String,
      enum: ["attached", "shared"],
      default: "shared",
    },
    bedCount: {
      type: Number,
      default: 1,
    },

    // amenities
    amenities: {
      type: [String],
      enum: ["bed", "wifi", "parking", "water", "lpg", "tv", "lift"],
      default: [],
    },

    // images 
    // images: [
    //   {
    //     // url: String,
    //     // public_id: String,
    //     type: String
    //   },
    // ],

    //images--> cloudinary ready
    images: [
      {
        url: { 
          type: String, 
          required: true 
        },
        public_id: String,
      }
    ],

    // Listing info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    highlight: { //eye-catching selling point that will be shown in listing cards.
      type: String,
    },

    highlightDesc: {  //highlight description]
      type: String,
    },

    // pricing
    rent: {
      type: Number,
      required: true,
      index: true
    },

    // status & meta
    availability: {
      type: Boolean,
      default: true,
      index: true
    },

    isVerified: {       //indicates whether a property has been verified by admin
      type: Boolean,
      default: false,
      index: true
    },

    views: {          //counts how many times users opened the property detail page
      type: Number,
      default: 0,
    },

    isDeleted: {   //soft delete
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


//


// search indexes - improves search by visiting all fields
propertySchema.index({
  title: "text",
  description: "text",
  highlight: "text"
})


const Property = mongoose.model("Property", propertySchema);
module.exports = Property