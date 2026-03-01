const UserModel = require('../../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// REGISTER USER CONTROLLER
exports.registerUser = async(req, res) => {
    const { name, email, password, phone, role} = req.body

    if(!name || !email || !password || !phone || !role){
        return res.status(400).json({
            message: "Name, email, password, phoneNumber, role must be provided"
        })
    }

    // check if user exists
    const userFound = await UserModel.findOne({email : email})    //returns object
    // console.log(userFound)

    // if user exist
    if(userFound){
        return res.status(400).json({
            message: "User with this email already exists"
        })
    }

    // if user doesnot exist --> created new user with provided email
    const user = await UserModel.create({
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
    const userFound = await UserModel.find({ email: email })


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
            expiresIn: '30d'
        })
        res.status(200).json({
            message: "User logged in successfully",
            token
        })
    } else {
        res.status(404).json({
            message: "Invalid credentials"
        })
    }
}