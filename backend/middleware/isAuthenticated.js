const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const {promisify} = require('util')    //to convert callback based function to promises based function


const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization  //if split to remove Bearer,,,,,   ?.split(" ")[1]

    // console.log("token -->:", token)

    if(!token){
        return res.status(403).json({
            message: "Please Login"
        })
    }

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)
        // console.log("Promisify result: ", decoded)
        const doesUserExist = await User.findById(decoded.id )   //returns object

        if(!doesUserExist){
            return res.status(404).json({
                message: "User doesnot exists with that token/id"
            })
        }
        
        // console.log("\nDoes user exists(form isAuthenticated): ", doesUserExist)
        req.user = doesUserExist  //append user key in db, passes the user details to next parameter ie. restrictTo controller

        // console.log(req.user)   

        next()
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = isAuthenticated