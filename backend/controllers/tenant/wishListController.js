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

    user.wishList.push(propertyId)
    await user.save()

    return res.status(200).json({
        message: "Property added to wishlist",
    })
}
