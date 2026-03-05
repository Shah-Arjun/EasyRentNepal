const Property = require("../../models/propertyModel")
const User = require("../../models/userModel")



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

    const user = await User.findById(userId)

    // if the property is already in wishlist then return message
    if(user.wishList.includes(propertyId)){
        return res.status(403).json({
            message: "This property is already in your wishlist"
        })
    }

    //if not in wishlist then add it
    user.wishList.push(propertyId)
    await user.save()

    return res.status(200).json({
        success: true,
        message: "Property added to wishlist",
    })
}



// GET ALL WISHLIST PROPERTY BASED ON TENANT
exports.getMyWishlist = async(req, res) => {
    const userId = req.user.id

    const userData = await User.findById(userId).select("-password -__v").populate({
        path: 'wishList',
        select: "-__v"
    })

    // console.log("\nuser data: \n", userData)

    if(userData.wishList.length == 0){
        return res.status(404).json({
            message: "Your wishlist is empty",
            data: []
        })
    }

    return res.status(200).json({
        success: true,
        message: "Wishlist data fetched successfully",
        data: userData.wishList
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

    // console.log("property--->\n", property)

    // get user wishlist
    const userData = await User.findById(userId)
    userData.wishList = userData.wishList.filter(pId => pId != propertyId)

    await userData.save()

    return res.status(200).json({
        success: true,
        message: "Property removed from wishlist"
    })
}