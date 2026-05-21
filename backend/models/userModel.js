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



const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    phoneNumber: {
      type: String,
      //select: false,      //this field will not be returned in any query, hidden by default
    },

    password: {
      type: String,
      minlength: 8,
      select: false,
    },

    role: {
      type: [String],
      enum: ["tenant", "owner"],
      default: ["tenant"],
    },

    location: {
        province: { type: String, enum: provinceEnum },
        district: { type: String },
        city: { type: String },
        tole: { type: String },
    },

    profileImage: {
      url: {           //to display image of particular url
        type: String,
        default: "https://www.flaticon.com/free-icon/user_149071?term=avatar&page=1&position=3&origin=tag&related_id=149071"
      },
      public_id: {   //to work with cloudinary
        type: String,
      },
    },

    preferences: {
      location: [String],      //array of string
      priceRange: { min: Number, max: Number },
      propertyType: [String],
      amenities: [String],
    },

    otp: {
      type: String,
      // select: false
    },

    isOtpVerified: {
      type: Boolean,
      default: false,
      // select: false
    },
    otpExpiry: {
      type: Date,
      // select: false
    },



    // propertyList: {    //propertyModel
    //   type: Array,
    //   default: [],
    // },
    
    // reservationList: {    //bookingModel
    //   type: Array,
    //   default: [],
    // }
    
    userPreferences: {
      category: { type: String, default: "" },
      listingType: { type: String, default: "" },
      district: { type: String, default: "" },
      municipality: { type: String, default: "" },
      preferredAreas: { type: [String], default: [] },
      minPrice: { type: Number, default: 0 },
      maxPrice: { type: Number, default: 0 },
      bedrooms: { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      furnishedStatus: { type: String, default: "" },
      facing: { type: String, default: "" },
      searchHistory: { type: [String], default: [] },
      recentSearch: { type: String, default: "" },
      wishlistCategories: { type: [String], default: [] },
      viewedCategories: { type: [String], default: [] }
    },
  },
  {
    timestamps: true,
  },
);


const User = mongoose.model("User", userSchema);
module.exports = User;
