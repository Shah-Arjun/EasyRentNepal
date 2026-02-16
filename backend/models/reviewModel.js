const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    tenantId: {         //oreign key
      type: mongoose.Schema.Types.ObjectId,    //for tenantId referenced to User model, stores tenant id
      ref: "User",
      required: true,
      index: true
    }, 
    ownerId: {                    //foreign key
      type: mongoose.Schema.Types.ObjectId,  
      ref: "User",
      required: true,
      index: true
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
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



// prevent multiple reviews by same tenant on same property 
reviewSchema.index(
    { tenantId: 1, propertyId: 1 }, 
    { unique: true }            //tells to mongoDb that the combination of tanant and property must be unique across the collection
);


module.exports = mongoose.model("Review", reviewSchema)
