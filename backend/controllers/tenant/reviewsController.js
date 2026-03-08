const Property = require("../../models/propertyModel")
const Review = require("../../models/reviewModel")
const User = require("../../models/userModel")



// CREATE PROPERTY REVIEW  --> only by tenent
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
        userId : tenantId,
        propertyId,
        rating,
        comment,
    })

    return res.status(200).json({
        success: true,
        message: "Review added successfully"
    })
}



// GET ALL REVIEWS TO PROPERTY BY ME  
exports.getPropertyRviewsByMe = async(req, res) => {
    const userId = req.user.id
    const reviews = await Review.find({ userId : userId })
    console.log(reviews)
    if(reviews.length == 0){
        return res.status(404).json({
            message: "You haven't given review to any property",
            data: []
        })
    }

    res.status(200).json({
        message: "Your reviews to property are fetched successfully",
        data: reviews
    })
}