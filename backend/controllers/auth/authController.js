const User = require('../../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../../services/sendEmail')


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

    // if user doesnot exist --> created new user with provided email
    const user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10) ,
        phoneNumber: phone,
        role
    })

    res.status(200).json({
        success: true,
        message: "User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
}





// LOGIN USER
exports.loginUser = async(req, res) => {
    const {email, password, role} = req.body

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

    // match check the password if user exists
    const isPwMatched = bcrypt.compareSync(password, userFound[0].password)

    // if matched, generate token
    if(isPwMatched){
        const token = jwt.sign({id: userFound[0]._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: '30d',
            algorithm: 'HS256'
        })
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: userFound[0]._id,
                name: userFound[0].name,
                email: userFound[0].email,
                role: userFound[0].role
            }
        })
    } else {
        res.status(404).json({
            success: false,
            message: "Invalid credentials"
        })
    }
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