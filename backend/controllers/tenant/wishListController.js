const Property = require("../../models/propertyModel")
const Wishlist = require("../../models/wishlistModel")



// ADD PROPERTY TO WISHLIST CONTROLLER
exports.addToWishlist = async (req, res) => {
    const userId = req.user.id                   // from token
    const { propertyId } = req.params            // form url

    if(!propertyId){
        return res.status(400).json({
            message: "Please provide propertyId"
        })
    }

    const propertyExist = await Property.findById({ _id: propertyId })

    if(!propertyExist){
        return res.status(400).json({
            message: "Property with that id doesnot found"
        })
    }

    const existing = await Wishlist.findOne({ userId, propertyId })

    // if the property is already in wishlist then return message
    if(existing){
        return res.status(403).json({
            message: "This property is already in your wishlist"
        })
    }

    //if not in wishlist then add it
    await Wishlist.create({ userId, propertyId })

    return res.status(200).json({
        success: true,
        message: "Property added to wishlist",
    })
}



// GET ALL WISHLIST PROPERTY BASED ON TENANT
exports.getMyWishlist = async(req, res) => {
    const userId = req.user.id

        const wishlist = await Wishlist.find({ userId })
            .populate({
                path: 'propertyId',
                select: '-__v'
            })
            .sort({ createdAt: -1 })

        if(wishlist.length == 0){
        return res.status(404).json({
            message: "Your wishlist is empty",
            data: []
        })
    }

        const properties = wishlist
            .map(item => item.propertyId)
            .filter(Boolean)

    return res.status(200).json({
        success: true,
        message: "Wishlist data fetched successfully",
                data: properties
    })
}




// REMOVE PROPERTY FROM WISHLIST
exports.deletePropertyFromWishlist = async(req, res) => {
    const { propertyId } = req.params
    const userId = req.user.id

    // check if the property exist or not
    const property = await Property.findById(propertyId)
    if(!property){
        return res.status(200).json({
            message: "No property found with that propertyId"
        })
    }

    await Wishlist.deleteOne({ userId, propertyId })

    return res.status(200).json({
        success: true,
        message: "Property removed from wishlist"
    })
}