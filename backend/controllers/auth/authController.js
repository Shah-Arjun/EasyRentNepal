const UserModel = require('../../models/userModel')
const bcrypt = require('bcrypt')


// REGISTER USER CONTROLLER
exports.registerUser = async(req, res) => {
    const { name, email, password, phone, role} = req.body

    if(!name || !email || !password || !phone || !role){
        return res.status(400).json({
            message: "Name, email, password, phoneNumber, role must be provided"
        })
    }

    // check if user exists
    const userFound = await UserModel.findOne({email : email})

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