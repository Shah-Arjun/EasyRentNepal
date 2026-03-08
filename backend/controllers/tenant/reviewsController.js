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




// DELETE PROPERTY REVIEW by me
exports.deletePropertyReviewMe = async(req, res) => {
    const reviewId = req.params.id
    console.log(reviewId)

    if(!reviewId){
        return res.status(400).json({
            message: "Please provide reviewId"
        })
    }


    //find the product in db
    const reviewExist = await Review.findById(reviewId)

    if(!reviewExist){
        return res.status(404).json({
            message: "Property not found with that id"
        })
    }

    // check if that(current) user has created the review 
    const userId = req.user.id
    const ownerOfReview = reviewExist.userId
    if(ownerOfReview != userId){
        return res.status(403).json({
            message: "You dont have permission to delete this review (you are not a owner of this review"
        })
    }
    
    // insert review to db
    await Review.findByIdAndDelete(reviewId)

    return res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    })
}