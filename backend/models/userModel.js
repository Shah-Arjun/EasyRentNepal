const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Username must be provided"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email must be provided"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number must be provided"],
      //select: false,      //this field will not be returned in any query, hidden by default
    },

    password: {
      type: String,
      required: [true, "Password must be provided"],
      minlength: 8,
      // select: false,
    },

    role: {
      type: String,
      enum: ["tenant", "owner", "admin"],
      default: "tenant",
    },

    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
    },

    location: {         //store tracked location by website
      type: String,
      trim: true,
    },

    profileImage: {
      url: {           //to display image of particular url
        type: String,
        //default: "https://www.flaticon.com/free-icon/user_149071?term=avatar&page=1&position=3&origin=tag&related_id=149071"
      },
      public_id: {   //to work with cloudinary
        type: String,
      },
    },

    verified: {
      type: Boolean,
      default: false,
    },

    preferences: {
      location: [String],      //array of string
      priceRange: { min: Number, max: Number },
      propertyType: [String],
      amenities: [String],
    },

    otp: {
      type: Number,
      // select: false
    },

    isOtpVerified: {
      type: Boolean,
      default: false,
      // select: false
    },

     wishList: [{     //wishlistModel
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    }],

    // propertyList: {    //propertyModel
    //   type: Array,
    //   default: [],
    // },
    
    // reservationList: {    //bookingModel
    //   type: Array,
    //   default: [],
    // }
    
  },
  {
    timestamps: true,
  },
);


const User = mongoose.model("User", userSchema);
module.exports = User;
