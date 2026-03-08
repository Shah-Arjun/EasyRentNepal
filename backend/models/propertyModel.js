const mongoose = require("mongoose");
const slugify = require("slugify");

const provinceEnum = [
  "Koshi Pradesh",
  "Madhesh Pradesh",
  "Bagmati Pradesh",
  "Gandaki Pradesh",
  "Lumbini Pradesh",
  "Karnali Pradesh",
  "Sudurpashchim Pradesh",
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
    slug: {
      //eye-catching selling point that will be shown in listing cards. ,,,, auto-generated from title + location for SEO/URL
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["House", "Land", "Apartment", "Flat", "Office", "Room", "Shutter/Shop"],
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
      enum: ['Motorcycle', 'Car 1', 'Car 2', 'Cars 3-5', 'Cars 5-10', 'Cars 10-15', 'None']
    },

    furnishedStatus: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'unfurnished'
    },


    // Area
    builtYear: { type: Number, min: 1900, max: new Date().getFullYear() + 5 },
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
      tole: { type: String, trim: true },
      wardNo: { type: Number, min: 1, max: 35 }
    },

    direction: {
      type: String,
      enum: ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West', 'Other']
    },
    roadSize: {
      value: { type: Number },
      unit: { type: String, default: 'ft' }
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
      ref: 'User',
      // phone: { type: String, },
      // email: { type: String, lowercase: true },
      // profileImage: String
      required: true
    },

    amenities: [String],  //wifi, water, ect

    status: {
      type: String,
      enum: ['Pending', 'Available', 'Sold', 'Rented', 'Rejected', 'Expired'],
      default: 'Pending'
    },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    expiresAt: Date

}, { 
  timestamps: true 
});



// Indexes
propertySchema.index({ slug: 1 });
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