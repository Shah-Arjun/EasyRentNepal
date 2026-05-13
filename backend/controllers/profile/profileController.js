const bcrypt = require('bcrypt')
const User = require('../../models/userModel')
const { sendUserTokenCookie, generateToken, cookieOptions, sendToggleTokenCookie, normalizeRoles } = require('../../utils/tokenUtils')
const Agency = require('../../models/agencyModel')

const buildFullAddress = (location = {}) => {
    return [location.tole, location.city, location.district, location.province]
        .filter(Boolean)
        .join(', ')
}




// GET MY PROFILE CONTROLLER --> for all users
exports.getMyProfile = async(req, res) => {
    const userId = req.user.id      // from isAuthenticated middleware
    const currentActiveRole = req.user.role  // role from decoded token (current active role)

    // Fetch from User collection only. Owners are stored as Users with role='owner'
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
        user: {
            ...myProfile.toObject(),
            role: normalizeRoles(myProfile.role),
            currentActiveRole: currentActiveRole,
            fullAddress: buildFullAddress(myProfile.location),
            joinedDate: myProfile.createdAt,
        }
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
    sendUserTokenCookie(res, 200, 'Password changed successfully', userFound);

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
    const allowedFields = ['name', 'email', 'phone', 'phoneNumber', 'location', 'profileImg', 'profileImage', 'role'];

    // Special handling for phoneNumber mapping from phone
    if (req.body.phone) updateFields.phoneNumber = req.body.phone;
    if (req.body.phoneNumber) updateFields.phoneNumber = req.body.phoneNumber;
    // Special handling for profileImage mapping from profileImg
    if (req.body.profileImg) updateFields.profileImage = req.body.profileImg;
    if (req.body.profileImage) updateFields.profileImage = req.body.profileImage;

    // Handle role updates with append/remove semantics
    if (Object.prototype.hasOwnProperty.call(req.body, 'role')) {
      const desiredRole = req.body.role;
      const user = await User.findById(userId).select('role');
      const currentRoles = Array.isArray(user.role) ? user.role.slice() : (user.role ? [user.role] : []);

      if (desiredRole === 'owner') {
        if (!currentRoles.includes('owner')) currentRoles.push('owner');
      } else if (desiredRole === 'tenant') {
        // downgrade to tenant only
        currentRoles.length = 0;
        currentRoles.push('tenant');
      }

      updateFields.role = currentRoles;
    }

    Object.keys(req.body).forEach(key => {
      // Only include fields that are in allowedFields and not already handled by special mapping
      if (allowedFields.includes(key) && key !== 'phone' && key !== 'profileImg' && key !== 'role') {
        updateFields[key] = req.body[key];
      }
    });

    const updatedProfile = await User.findByIdAndUpdate(userId, updateFields, {
        new : true,
        runValidators : true    //validate the frontend data according to User model/schema
    }).select(['-password', '-__v'])

    // Refresh auth cookie so role-based middleware sees the latest role immediately.
    const refreshedRole = Array.isArray(updateFields.role) ? updateFields.role[0] : (updateFields.role || req.user.role)
    const refreshedToken = generateToken(updatedProfile._id, refreshedRole)
    res.cookie('auth_token', refreshedToken, cookieOptions())

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
            ...updatedProfile.toObject(),
            role: normalizeRoles(updatedProfile.role),
            currentActiveRole: req.user.role,
            fullAddress: buildFullAddress(updatedProfile.location),
            joinedDate: updatedProfile.createdAt,
        }
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




// TOGGLE ROLE CONTROLLER --> switches between owner and tenant
exports.toggleProfileRole = async (req, res) => {
    const userId = req.user.id;
    const currentRole = req.user.role;

    try {
        let newRole, newUserData;
        
        // Always look up the user in User collection
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if(currentRole === 'tenant') {
            // Check if user is registered as owner
            if (!normalizeRoles(user.role).includes('owner')) {
                return res.status(400).json({
                    success: false,
                    message: "Register as owner first to switch role."
                });
            }
            // check if agency exists
            const agency = await Agency.findOne({ owner: userId });
            if(!agency) {
                return res.status(400).json({
                    success: false,
                    message: "Agency not found. Complete owner registration."
                });
            }
            
            newRole = 'owner';

        } else if(currentRole === 'owner') {
            if (!normalizeRoles(user.role).includes('tenant')) {
                return res.status(400).json({
                    success: false,
                    message: "You don't have tenant role"
                });
            }
            newRole = 'tenant';
        }

        const refreshedProfile = await User.findById(userId).select(['-password', '-__v'])

        // ALWAYS use USER ID for token generation (not Agency ID)
        sendToggleTokenCookie(res, 200, `Role switched to ${newRole} successfully`, refreshedProfile, newRole);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
