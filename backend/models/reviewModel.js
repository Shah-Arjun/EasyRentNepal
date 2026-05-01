const mongoose = require("mongoose");
const Schema = mongoose.Schema


const reviewSchema = new mongoose.Schema(
  {
    userId: {         //foreign key
      type: Schema.Types.ObjectId,    //for tenantId referenced to User model, stores tenant id
      ref: "User",
      required: [true, "The review must belong to user(tenant)"],
      index: true
    }, 
    // ownerId: {                    //foreign key
    //   type: mongoose.Schema.Types.ObjectId,  
    //   ref: "User",
    //   index: true
    // },
    propertyId: {                  //foreign key
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "A review must br of property"],
      index: true
    },
    rating: {
      type: Number,
      default: 3,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      trim: true, //removes extra spaces from the beginning and end of a string.
      maxlength: 500,
    },
    isApproved: {      //controlled by admin
      type: Boolean,
      default: true,
      index: true
    },
  },
  {
    timestamps: true,
  },
);



const Review = mongoose.model("Review", reviewSchema)
module.exports = Review
