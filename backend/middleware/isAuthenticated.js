const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Agency = require('../models/agencyModel');


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.['auth_token']

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please login"
            })
        }

        // Verify the custom JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded || !decoded.id) {
            return res.status(403).json({ message: "Invalid token" });
        }

        const role = Array.isArray(decoded.role) ? decoded.role[0] : decoded.role;

        // Always look up users in the User collection (both tenant and owner users are stored here)
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        // req.user = user;

        req.user = {
            id: user._id,
            role: role
        }

        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        res.status(401).json({ message: "Unauthorized: " + err.message });
    }
};

module.exports = isAuthenticated;