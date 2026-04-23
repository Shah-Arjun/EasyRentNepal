const bcrypt = require('bcrypt')
const User = require('../../models/userModel')
const { sendTokenCookie, generateToken, cookieOptions } = require('../../utils/tokenUtils')


// GET MY PROFILE CONTROLLER --> for all users
exports.getMyProfile = async(req, res) => {
    const userId = req.user.id      // from isAuthenticated middleware

    // const myProfile = await User.findById(userId).select(['-password', '-__v']).populate('wishList')    //if want to populate
    const myProfile = await User.findById(userId).select(['-password', '-__v'])

    if(!myProfile){
        return res.status(404).json({
            success: false,
            message: "User not exists with that id"
        })
    }

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: myProfile
    })
}




// POST CHANGE PW
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userFound = await User.findById(req.user.id).select('+password');

    if (!userFound) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // compare old password
    const isPwMatched = bcrypt.compareSync(currentPassword, userFound.password);

    if (!isPwMatched) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // hash new password
    userFound.password = bcrypt.hashSync(newPassword, 10);
    await userFound.save();

    // send new token (important after password change)
    sendTokenCookie(res, 200, 'Password changed successfully', userFound);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
 




// UPDATE MY PROFILE CONTROLLER --> for all users
exports.updateMyProfile = async(req, res) => {
    const userId = req.user.id      // from isAuthenticated middleware
    
    // Create an update object with only fields that are provided
    const updateFields = {};
    const allowedFields = ['name', 'email', 'phone', 'location', 'profileImg', 'role']; // Changed profileImage to profileImg to match req.body

    // Special handling for phoneNumber mapping from phone
    if (req.body.phone) updateFields.phoneNumber = req.body.phone;
    // Special handling for profileImage mapping from profileImg
    if (req.body.profileImg) updateFields.profileImage = req.body.profileImg;
    
    Object.keys(req.body).forEach(key => {
        // Only include fields that are in allowedFields and not already handled by special mapping
        if (allowedFields.includes(key) && key !== 'phone' && key !== 'profileImg') {
            updateFields[key] = req.body[key];
        }
    });

    const updatedProfile = await User.findByIdAndUpdate(userId, updateFields, {
        new : true,
        runValidators : true    //validate the frontend data according to User model/schema
    }).select(['-password', '-__v'])

    // Refresh auth cookie so role-based middleware sees the latest role immediately.
    const refreshedToken = generateToken(updatedProfile._id, updatedProfile.role)
    res.cookie('auth_token', refreshedToken, cookieOptions())

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedProfile
    })
}




// DELETE MY PROFILE CONTROLLER ---> for all users
exports.deleteMyProfile = async(req,res) => {
    const userId = req.user.id  //form isAuthenticated middleware
    const { pw } = req.body

    if(!pw){
        return res.status(400).json({success:false, message:"Please enter password to delete."})
    }

    const userFound = await User.findById(userId).select('+password')
    const isPwMatch = bcrypt.compareSync(pw, userFound.password)

    if(!isPwMatch){
        return res.status(400).json({success:false, message:"Enter correct password."})
    }
    
    await User.findByIdAndDelete(userId)

    res.status(200).json({
        success: true,
        message: "Profile deleted successfully.",
        data: null
    })
}