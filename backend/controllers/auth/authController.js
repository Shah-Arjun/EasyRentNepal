const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/userModel')
const sendEmail = require('../../services/sendEmail')
const { destroyCookie, sendUserTokenCookie } = require('../../utils/tokenUtils')
const generateOtp = require('../../utils/generateOtp')





// LOGIN USER
exports.loginUser = async(req, res) => {
    const {email, password} = req.body

    if(!email || !password ){
        return res.status(400).json({
            message: "Email, password must be provided"
        })
    }

    // console.log(req.body)

    
    // checks if user exist 
    const userFound = await User.findOne({ email: email }).select("+password")


    // if user not found i.e. not registered
    if(!userFound){
        return res.status(400).json({
            message: "User not registered"
        })
    }

    // if user exist but not verified
    if(!userFound.isOtpVerified){
        return res.status(403).json({
            message: "Please verify your account first"
        })
    }


    // match check the password if user exists
    const isPwMatched = bcrypt.compareSync(password, userFound.password)

    // if matched, generate token and send it using helper function
    if(isPwMatched){
        sendUserTokenCookie(res, 200, 'Login successful', userFound);
    } else {
        res.status(404).json({
            success: false,
            message: "Invalid credentials"
        })
    }
}




// LOGOUT USER
exports.logoutUser = async(req, res) => {
    const isDestroyed = destroyCookie(res);

      if (isDestroyed) {
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Failed to logout'
  });
}






// FORGET PASSWORD
exports.forgetPassword = async(req, res) => {
    const {email} = req.body

    if(!email){
        return res.status(400).json({
            message: "Please send an email"
        })
    }

    //checks if the user exists
    const userExist = await User.find({ email : email})

    if(userExist.length == 0){
        return res.status(400).json({
            message: "User not registered with this email."
        })
    }

    //if user exists then send OTP to that email
    const otp = generateOtp()

    // save otp in db
    userExist[0].otp = otp
    await userExist[0].save()

    await sendEmail({
        email: email,
        subject: "OTP for HouseRentalNepal password reset",
        message: `${otp}`
    })

    res.status(200).json({
        message: "OTP sent successfully."
    })
}





// VERIFY OTP-- for pw reset
exports.verifyOtp = async (req, res) => {
    const {email, otp} = req.body

    // checks if email and otp provided or not
    if(!email || !otp){
        return res.status(400).json({
            message: "Please enter email, otp"
        })
    }


    //CHECKS if otp is registered or not
    const userExist = await User.find({email : email})
    if(userExist.length == 0){
        return res.status(404).json({
            message: "This email is not registered"
        })
    }

    // checks if the otp matched or not
    if(userExist[0].otp !== otp) {
        res.status(400).json({
            message: "Invalid OTP. Try again"
        })
    } else {
        res.status(200).json({
            message: "OTP verified"
        })

        //dispose OTP after verifyed so cannot be used same otp next time
        userExist[0].otp = undefined
        userExist[0].isOtpVerified = true
        await userExist[0].save()
    }

}




// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const {email, newPassword, confirmPassword} = req.body

    if(!email || !newPassword || ! confirmPassword){
        return res.status(400).json({
            message: "Provide email, newPassword and confirmPassword"
        })
    }

    //checks if newPassword and confirmPassword same
    if(newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "newPassword and confirmPassword didn't match"
        })
    }

    const userExist = await User.find({email : email})
    if(userExist.length == 0){
        return res.status(400).json({
            message: "The email you entered is not registered"
        })
    }

    //check otp verified or not
    if(userExist[0].isOtpVerified !== true){
        return res.status(403).json({
            message: "You cannot perform this action"
        })
    }
    
    //replace the password with newPassword in db--> save hashed password
    userExist[0].password = bcrypt.hashSync(newPassword, 10)
    userExist[0].isOtpVerified = false
    await userExist[0].save()

    res.status(200).json({
        message: "Password changed successfully"
    })
}







//register using otp
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, location } = req.body
    
    if(!name || !email || !password || !phone || !location || !location.province || !location.district || !location.city ){
        return res.status(400).json({
            success: false,
            message: "Name, email, password, phoneNumber and location details must be provided"
        })
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);
        existingUser.otp = hashedOtp;
        existingUser.otpExpiry = Date.now() + 1 * 60 * 1000;
        sendEmail({
            email: email,
            subject: "OTP for HouseRentalNepal registration",
            message: `Your OTP for registration is: ${otp}`
        })
        existingUser.isOtpVerified = false; 
        await existingUser.save();
        return res.status(400).json({ message: "User already exists with this email." })
    }

// console.log("hello")
    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOtp();

    const hashedOtp = await bcrypt.hash(otp, 10)

// console.log("hash",hashedOtp)
    const user = await User.create({
      name,
      email,
      role: role || "tenant",
      password: hashedPassword,
      phoneNumber: phone,
      location,
      otp: hashedOtp,
      isOtpVerified: false,
      otpExpiry: Date.now() + 1 * 60 * 1000,   // 1 min
    });

    // console.log("from register controller")
    await sendEmail({
        email: email,
        subject: "OTP for HouseRentalNepal tenant registration",
        message: `${otp}`
    })

    res.status(201).json({ 
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};






// VERIFY OTP
exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isOtpVerified) {
      return res.status(400).json({ message: "Already verified" });
    }

    if (otp && Date.now() > user.otpExpiry) {
      return res.status(400).json({success:false, message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({success:false, message: "Invalid OTP" });
    }

    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 1 * 60 * 1000;

    await user.save();

    await sendEmail({
        email: email,
        subject: "OTP for HouseRentalNepal registration",
        message: `${otp}`
    })

    res.status(200).json({
      success: true,
      message: "OTP resent for house rental registration",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


