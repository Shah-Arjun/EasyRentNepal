const { json } = require('express')
const User = require('../../models/userModel')


// GET MY PROFILE CONTROLLER --> for all users
exports.getMyProfile = async(req, res) => {
    const userId = req.user.id      // from isAuthenticated middleware

    // const myProfile = await User.findById(userId).select(['-password', '-__v']).populate('wishList')    //if want to populate
    const myProfile = await User.findById(userId).select(['-password', '-__v'])

    if(!myProfile){
        return res.status(404).json({
            message: "User not exists with that id"
        })
    }

    res.status(200).json({
        message: "Profile fetched successfully",
        data : myProfile
    })
}




// UPDATE MY PROFILE CONTROLLER --> for all users
exports.updateMyProfile = async(req, res) => {
    const userId = req.user.id      // from isAuthenticated middleware
    const {name, email, phone, location, profileImg} = req.body 

    const updatedProfile = await User.findByIdAndUpdate(userId, {
        name,
        email,
        phoneNumber: phone,
        location,
        profileImage: profileImg
    }, {
        new : true,
        runValidators : true    //validate the frontend data according to User model/schema
    }).select(['-password', '-__v'])

    res.status(200).json({
        message: "Profile updated successfully",
        data : updatedProfile
    })
}




// DELETE MY PROFILE CONTROLLER ---> for all users
exports.deleteMyProfile = async(req,res) => {
    const userId = req.user.id  //form isAuthenticated middleware

    await User.findByIdAndDelete(userId)

    res.status(200).json({
        success: true,
        message: "Profile deleted successfully.",
        data: null
    })
}