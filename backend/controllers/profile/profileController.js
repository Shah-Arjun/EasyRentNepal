const User = require('../../models/userModel')


// GET MY PROFILE CONTROLLER --> for all users
exports.getMyProfile = async(req, res) => {
    const userId = req.user.id      // from isAuthenticated middleware

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