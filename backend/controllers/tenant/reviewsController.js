const Property = require("../../models/propertyModel")
const Review = require("../../models/reviewModel")


exports.createPropertyReview = async(req, res) => {
    const propertyId = req.params.id
    const tenantId = req.user.id
    const { rating, comment } = req.body

    if(!tenantId || !propertyId || !rating || !comment){
        return res.status(400).json({
            message: "Please provide userId, propertyId, rating and comment"
        })
    }

    //find the product in db
    const propertyExist = await Property.findById(propertyId)

    if(!propertyExist){
        return res.status(404).json({
            message: "Property not found with that id"
        })
    }

    // console.log(propertyExist)

    // insert review to db
    await Review.create({
        tenantId,
        ownerId: propertyExist.ownerId,
        propertyId,
        rating,
        comment,
    })

    return res.status(200).json({
        success: true,
        message: "Review added successfully"
    })
}