const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    //Basic
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: { //eye-catching selling point that will be shown in listing cards. ,,,, auto-generated from title + location for SEO/URL
      type: String,
    },
    category: {
      type: String,
      enum: ['House', 'Land', 'Apartment', 'Flat', 'Office', 'Room', 'Shutter/Shop'],
      default: 'Room',
      required: true,
      index: true
    },
    listingType: {
      type: String,
      enum: ['Sale', 'Rent'],
      required: true
    },

    // Room / Structure counts (mainly for House/Apartment/Flat/Office)
    noOfFlat: { type: Number, min:0},
    bedrooms: { type: Number, min:0},
    bathrooms: { type: Number, min:0},
    bathroomType: {
      type: String,
      enum: ["attached", "shared"],
      default: "shared",
    },
    bedCount: {
      type: Number,
      default: 1,
    },
    living: { type: Number, min:0},
    kitchen: { type: Number, min:0},
    parking: {
      type: String,
      enum: [
        'Motorcycle', 'Car 1', 'Car 2', 'Cars 3-5', 'Cars 5-10', 'Cars 10-15', 'None'
      ]
    },

    //Area and built info
    builtYear: { type:Number, min:1900, max: new Date().getFullYear() + 5},
    builtArea: {
      value: { type: Number },
      unit: {
        type: String,
        enum: ['sqft', 'aana', 'ropani', 'paisa', 'dam', 'haath', 'feet', 'sqm', 'other']
      }
    },
    landArea: {
      value: { type: Number },
      unit: {
        type: String,
        enum: ['aana', 'ropani', 'paisa', 'dam', 'sqft', 'sqm', 'haath', 'dhur', 'kattha', 'bigha'],
        default: 'dhur'     // common in Nepal
      }
    },

    facing: {
      type: String,
      enum: ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']
    },


    // pricing
    price: {
      value: {type: Number, required: true},
      currency: {type: String, default: 'NPR'},
      perUnit: {
        typr: String,
        enum: ['total', 'per aana', 'per ropani', 'per sqft', 'per month', 'per year', 'per dhur', 'per kattha', 'per bigha'],
      }
    },


    //location
    location: {
      province: { type: String, //enum: ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'], required: true,},
      district: { type: String, required: true},
      municipality: { type: String, required: true},
      tole: { type: String, trim: true},
      wardNo: { type: Number, min:1, max:35},
    },
    direction: {    //direction of property
      type: String,
      enum: ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West', 'Other']
    },
    roadSize: {
      value: { type: Number },
      unit: { type: String, default: 'ft' }
    },






    // Owner (who listed the property)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // type: String
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

    description: {
      type: String,
      required: true,
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