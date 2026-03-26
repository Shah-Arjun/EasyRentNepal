const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const isAuthenticated = async (req, res, next) => {
    try {
        // Read Bearer token from Authorization header
        const authHeader = req.headers.authorization;   //from frontend

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("Auth failed: No bearer token found");
            return res.status(403).json({ message: "Please Login" });
        }


        //token 
        const token = authHeader.split(' ')[1];

        // Verify the custom JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded || !decoded.id) {
            console.log("Auth failed: Invalid token structure", decoded);
            return res.status(403).json({ message: "Invalid token" });
        }

        // Find the user in our DB
        const user = await User.findById(decoded.id);

        if (!user) {
            console.log("Auth failed: User not found for ID:", decoded.id);
            return res.status(403).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        res.status(401).json({ message: "Unauthorized: " + err.message });
    }
};

module.exports = isAuthenticated;