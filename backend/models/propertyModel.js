const mongoose = require("mongoose");

const provinceEnum = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];



const propertySchema = new mongoose.Schema(
  {
    //Basic
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      enum: ["House", "Land", "Apartment", "Flat", "Office", "Room", "Shutter"],
      default: "Room",
      required: true,
      index: true,
    },
    listingType: {
      type: String,
      enum: ["Sale", "Rent"],
      default: 'Rent',
      required: true,
    },

    averageRating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    // Room / Structure counts
    noOfFlat: { type: Number, min: 0 },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    bathroomType: { type: String, enum: ['attached', 'shared'], default: 'shared' },
    bedCount: { type: Number, default: 1 },
    living: { type: Number, min: 0 },
    kitchen: { type: Number, min: 0 },
    parking: {
      type: String,
      // enum: ['Motorcycle', 'Car 1', 'Car 2', 'Cars 3-5', 'Cars 5-10', 'Cars 10-15', 'None']
    },

    furnishedStatus: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'unfurnished'
    },


    // Area
    // builtYear: { type: Number, min: 0, max: new Date().getFullYear() + 5 },
    builtYear: { type: Number, min: 0, max: 2083 },
    builtArea: {
      value: { type: Number },
      unit: { type: String, enum: ['sqft', 'aana', 'ropani', 'paisa', 'dam', 'haath', 'feet', 'sqm', 'other'] }
    },
    landArea: {
      value: { type: Number },
      unit: {
        type: String,
        enum: ['aana', 'ropani', 'paisa', 'dam', 'sqft', 'sqm', 'haath', 'dhur', 'kattha', 'bigha'],
        default: 'dhur'
      }
    },

    facing: {
      type: String,
      enum: ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']
    },

    // Pricing
    price: {
      value: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'NPR', enum: ['NPR', 'USD', 'INR'] },
      perUnit: {
        type: String,
        enum: ['total', 'per aana', 'per ropani', 'per sqft', 'per dhur', 'per kattha', 'per bigha', 'per month', 'per year']
      }
    },

    // Location
    location: {
      province: { type: String, required: true, enum: provinceEnum },
      district: { type: String, required: true },
      municipality: { type: String, required: true },
      city: { type: String, default: '' },
      tole: { type: String, trim: true },
      wardNo: { type: Number, min: 0, max: 35 }
    },

    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number]  // [lng, lat]
      }
    },

    road: {
      value: { type: Number },
      unit: { type: String, default: 'ft' },
      type: { type: String, enum: ['pitched', 'gravelled', 'block', "no road", 'other'] }
    },

    fullDescription: {
      type: String,
      required: true,
      maxlength: 5000
    },

    images: [{
      url: { type: String, required: true },
      public_id: String,
      isPrimary: { type: Boolean, default: false }  // for thumbnail 
    }],

    videoUrl: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Agency',
      required: true
    },

    amenities: [String],  //wifi, water, ect

    status: {
      type: String,
      enum: ['Available', 'Sold', 'Rented'],
      default: 'Available'
    },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },

    // Vector representation for similarity search
    plot_embedding: {
      type: [Number],
      default: undefined
    }

}, { 
  timestamps: true 
});



// Indexes
propertySchema.index({ status: 1, category: 1, listingType: 1 });
propertySchema.index({ 'location.district': 1, 'location.municipality': 1 });
propertySchema.index({ 'price.value': 1 });



// Full-text search (weighted)
propertySchema.index({
  title: 'text',
  fullDescription: 'text',
  'location.province': 'text',
  'location.district': 'text',
  'location.municipality': 'text',
  'location.tole': 'text'
}, {
  weights: { title: 10, fullDescription: 5, 'location.municipality': 3, 'location.district': 2 }
});




const Property = mongoose.model('Property', propertySchema);
module.exports = Property;