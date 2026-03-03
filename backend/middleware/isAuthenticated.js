const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const {promisify} = require('util')


const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization

    if(!token){
        return res.status(403).json({
            message: "Please Login"
        })
    }

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)
        console.log("Promisify result: ", decoded)
        const doesUserExist = await User.findOne({ _id : decoded.id })

        if(!doesUserExist){
            return res.status(404).json({
                message: "User doesnot exists with that token/id"
            })
        }
        
        req.user = doesUserExist

        next()
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = isAuthenticated