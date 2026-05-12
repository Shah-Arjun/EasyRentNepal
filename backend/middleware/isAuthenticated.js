const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { COOKIE_NAME, destroyCookie, normalizeRole, normalizeRoles } = require('../utils/tokenUtils');


const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.[COOKIE_NAME]

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please login"
            })
        }

        // Verify the custom JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded || !decoded.id) {
            destroyCookie(res);
            return res.status(403).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.id).select('role name email phoneNumber location profileImage isOtpVerified createdAt updatedAt');

        if (!user) {
            destroyCookie(res);
            return res.status(403).json({ message: "User not found" });
        }

        const availableRoles = normalizeRoles(user.role);
        const tokenRole = normalizeRole(decoded.role);
        const activeRole = availableRoles.includes(tokenRole) ? tokenRole : (availableRoles[0] || tokenRole);

        if (!activeRole) {
            destroyCookie(res);
            return res.status(403).json({ message: "Role not available for this account" });
        }

        req.user = {
            id: user._id,
            role: activeRole,
            roles: availableRoles,
        }

        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        if (err.name === 'TokenExpiredError') {
            destroyCookie(res);
            return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
        }

        destroyCookie(res);
        res.status(401).json({ message: "Unauthorized: " + err.message });
    }
};

module.exports = isAuthenticated;