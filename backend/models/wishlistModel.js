const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true   //faster search
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
        index: true
    }
},{
    timestamps: true
})


// prevents duplication of wishlist
// a user can have single wishlist of same property
wishlistSchema.index({ userId:1, propertyId: 1}, {unique: true})


const Wishlist = mongoose.model('Wishlist', wishlistSchema)
module.exports = Wishlist