const User = require('../../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../../services/sendEmail')
const crypto = require('crypto')


// REGISTER USER CONTROLLER
exports.registerUser = async(req, res) => {
    const { name, email, password, phone, role} = req.body

    if(!name || !email || !password || !phone || !role){
        return res.status(400).json({
            message: "Name, email, password, phoneNumber, role must be provided"
        })
    }

    // check if user exists
    const userFound = await User.findOne({email : email})    //returns object
    // console.log(userFound)

    // if user exist
    if(userFound){
        return res.status(400).json({
            message: "User with this email already exists"
        })
    }

    // generate OTP
    const r_no = Math.random() //gives decimal no. in range 0 to 1
    const fourDigit = r_no * 10000
    const otp = Math.floor(fourDigit)  //converts into integer

    // if user doesnot exist --> created new user with provided email
    // Set as unverified and save OTP
    const user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10) ,
        phoneNumber: phone,
        role,
        verified: false,
        otp: otp,
        isOtpVerified: false
    })

    // send email with OTP
    try {
        await sendEmail({
            email: email,
            subject: "OTP for HouseRentalNepal Registration",
            message: `Your registration OTP is: ${otp}`
        })

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email. Please verify.",
            isOtpStep: true,
            userId: user._id
        })
    } catch (error) {
        console.error("Email error:", error)
        res.status(500).json({
            success: false,
            message: "Error sending OTP email"
        })
    }
}


// VERIFY REGISTRATION OTP
exports.verifyRegistrationOtp = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message: "User ID and OTP are required"
        });
    }

    const userFound = await User.findById(userId);

    if (!userFound) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (userFound.otp !== Number(otp)) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP. Try again"
        });
    }

    // OTP matched perfectly, now verify the user
    userFound.otp = undefined; // clear OTP
    userFound.isOtpVerified = true;
    userFound.verified = true; // Complete registration
    await userFound.save();

    res.status(200).json({
        success: true,
        message: "User registered and verified successfully"
    });
}





// LOGIN USER
exports.loginUser = async(req, res) => {
    const {email, password, role, deviceToken} = req.body

    if(!email || !password || !role){
        return res.send(400).json({
            message: "Email, password and role must be provided"
        })
    }

    // console.log(req.body)

    
    // checks if user exist 
    const userFound = await User.find({ email: email })


    // if user not found i.e. not registered
    if(userFound.length == 0){
        return res.status(400).json({
            message: "User not registered"
        })
    }

    const user = userFound[0];

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({
            success: false,
            message: "Account is locked due to too many failed attempts. Try again after 1 hour."
        })
    }

    // match check the password if user exists
    const isPwMatched = bcrypt.compareSync(password, user.password)

    // if matched, check for existing known device token
    if(isPwMatched){
        // Bypass OTP if device is known
        if (deviceToken && user.knownDevices && user.knownDevices.includes(deviceToken)) {
            user.loginAttempts = 0;
            user.lockUntil = undefined;
            await user.save();

            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {
                expiresIn: '30d',
                algorithm: 'HS256'
            })
            return res.status(200).json({
                success: true,
                message: "User logged in successfully (Recognized Device)",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
        }

        // generate OPT for unknown device
        const r_no = Math.random() //gives decimal no. in range 0 to 1
        const fourDigit = r_no * 10000
        const otp = Math.floor(fourDigit)  //converts into integer

        // save otp in db
        user.otp = otp
        user.isOtpVerified = false // reset verification status just in case
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save()

        // send email with OTP
        try {
            await sendEmail({
                email: email,
                subject: "OTP for HouseRentalNepal Login",
                message: `Your login OTP is: ${otp}`
            })
            
            res.status(200).json({
                success: true,
                message: "OTP sent successfully to your email.",
                isOtpStep: true,
                userId: user._id
            })
        } catch (error) {
            console.error("Email error:", error)
            res.status(500).json({
                success: false,
                message: "Error sending OTP email"
            })
        }
    } else {
        user.loginAttempts += 1;
        
        if (user.loginAttempts >= 3) {
            user.lockUntil = Date.now() + 60 * 60 * 1000; // 1 hour lockout
            await user.save();
            return res.status(403).json({
                success: false,
                message: "Account locked due to 3 failed attempts. Try again after 1 hour."
            })
        }

        await user.save();
        res.status(404).json({
            success: false,
            message: `Invalid credentials. ${3 - user.loginAttempts} attempts remaining.`
        })
    }
}


// VERIFY LOGIN OTP
exports.verifyLoginOtp = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message: "User ID and OTP are required"
        });
    }

    const userFound = await User.findById(userId);

    if (!userFound) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (userFound.otp !== Number(otp)) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP. Try again"
        });
    }

    // OTP matched perfectly, generate device token and issue the JWT token
    const newDeviceToken = crypto.randomBytes(32).toString('hex');

    userFound.otp = undefined; // clear OTP
    userFound.isOtpVerified = true;
    userFound.knownDevices.push(newDeviceToken);
    await userFound.save();

    const token = jwt.sign({id: userFound._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d',
        algorithm: 'HS256'
    });

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        deviceToken: newDeviceToken,
        user: {
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            role: userFound.role
        }
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
    const r_no = Math.random() //gives decimal no. in range 0 to 1
    const fourDigit = r_no * 10000
    const otp = Math.floor(fourDigit)  //converts into integer

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





// VERIFY OTP
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