const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const isAuthenticated = async (req, res, next) => {
    try {
        // Read Bearer token from Authorization header
        // const authHeader = req.headers.authorization;   //from frontend

        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     console.log("Auth failed: No bearer token found");  //debug
        //     return res.status(403).json({ message: "Please Login" });
        // }


        //token 
        // const token = authHeader.split(' ')[1];



        //reads jwt token form the httpOnly cookie
        const token = req.cookies?.['auth_token']

        // console.log("from isAuth---> ", token)

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please login"
            })
        }



        // Verify the custom JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // console.log("decoded from isAuth--> ", decoded)

        if (!decoded || !decoded.id) {
            // console.log("Auth failed: Invalid token structure", decoded);   //debug
            return res.status(403).json({ message: "Invalid token" });
        }

        // Find the user in DB
        const user = await User.findById(decoded.id);     // returns object

        if (!user) {
            console.log("Auth failed: User not found for ID:", decoded._id);
            return res.status(403).json({ message: "User not found" });
        }

        // req.user = user;
        req.user = {
            id: user._id,
            role: user.role
        }


        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        res.status(401).json({ message: "Unauthorized: " + err.message });
    }
};

module.exports = isAuthenticated;