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
    const isPwMatched = await bcrypt.compare(password, userFound.password)

    // if matched, generate token and send it using helper function
    if(isPwMatched){
        sendUserTokenCookie(res, 200, 'Login successful', userFound, req.body.role);
    } else {
        res.status(401).json({
            success: false,
            message: "Invalid credentials"
        })
    }
}



// LOGOUT USER
exports.logoutUser = async(req, res) => {
        destroyCookie(res);
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
}



// FORGET PASSWORD
exports.forgetPassword = async(req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please provide an email address"
        })
    }

    // checks if the user exists
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No account found with this email address."
        })
    }

    // generate OTP
    const otp = generateOtp()

    // save hashed otp in db
    user.otp = await bcrypt.hash(otp, 10)
    user.isOtpVerified = false
    user.otpExpiry = Date.now() + 5 * 60 * 1000;   // 10 mins
    await user.save()

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset OTP - EasyRentalNepal",
            message: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`
        });

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email."
        })
    } catch (err) {
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(500).json({
            success: false,
            message: "Failed to send email. Please try again later."
        })
    }
}





// VERIFY OTP-- for pw reset
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required"
        })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    // Check if OTP is expired
    if (user.otpExpiry && Date.now() > user.otpExpiry) {
        return res.status(400).json({
            success: false,
            message: "OTP has expired. Please request a new one."
        })
    }

    // verify OTP
    const isOtpMatched = await bcrypt.compare(otp, user.otp);
    if (!isOtpMatched) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP code"
        })
    }

    // Mark as verified for reset
    user.otp = null
    user.isOtpVerified = true
    user.otpExpiry = null
    await user.save()

    res.status(200).json({
        success: true,
        message: "OTP verified successfully. You can now reset your password."
    })
}




// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body

    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    if (newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long"
        })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    if (!user.isOtpVerified) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized. Please verify OTP first."
        })
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.status(200).json({
        success: true,
        message: "Password reset successful. You can now login with your new password."
    })
}





//register using otp
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, location } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !location ||
      !location.province ||
      !location.district ||
      !location.city
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password, phone number and location details are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }


    if (existingUser && !existingUser.isOtpVerified) {
      if ( existingUser.otpExpiry && existingUser.otpExpiry > Date.now() ) {
        return res.status(200).json({
          success: true,
          message: "Please wait before requesting another OTP.",
        });
      }

      // Generate new OTP
      const otp = generateOtp();

      // Hash OTP + Password
      const [hashedOtp, hashedPassword] = await Promise.all([
        bcrypt.hash(otp, 10),
        bcrypt.hash(password, 10),
      ]);

      // Update existing user
      existingUser.name = name;
      existingUser.phoneNumber = phone;
      existingUser.password = hashedPassword;
      existingUser.role = role || existingUser.role;
      existingUser.location = location;

      existingUser.otp = hashedOtp;
      existingUser.otpExpiry = Date.now() + 5 * 60 * 1000;

      await existingUser.save();

      // Send OTP Email
      await sendEmail({
        email: email,
        subject: "OTP for EasyRentNepal Registration",
        message: `Your OTP is: ${otp}`,
      });

      return res.status(200).json({
        success: true,
        message: "User already exists but not verified. New OTP sent.",
      });
    }

    // =========================================================
    // CASE 3: NEW USER REGISTRATION
    // =========================================================

    // Generate OTP
    const otp = generateOtp();

    // Hash Password + OTP in parallel
    const [hashedPassword, hashedOtp] = await Promise.all([
      bcrypt.hash(password, 10),
      bcrypt.hash(otp, 10),
    ]);

    // Create User
    const user = await User.create({
      name,
      email: email,
      role: role || "tenant",
      password: hashedPassword,
      phoneNumber: phone,
      location,

      otp: hashedOtp,
      isOtpVerified: false,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    // Send OTP Email
    await sendEmail({
      email: email,
      subject: "OTP for EasyRentNepal Registration",
      message: `Your OTP is: ${otp}`,
    });

    return res.status(201).json({
      success: true,
      message: "OTP sent to your email.",
      userId: user._id,
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
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
    });

    res.status(200).json({
        success: true,
        message: "OTP resent for house rental registration",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


