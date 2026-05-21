const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { COOKIE_NAME } = require('../utils/tokenUtils');

const isOptionalAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.[COOKIE_NAME];

        if (!token) {
            return next();
        }

        // Verify the custom JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded || !decoded.id) {
            return next();
        }

        const user = await User.findById(decoded.id).select('role name email');

        if (!user) {
            return next();
        }

        req.user = {
            id: user._id,
            role: decoded.role || user.role?.[0] || 'tenant',
        };

        next();
    } catch (err) {
        // Soft fail - do not block the request, just let it proceed unauthenticated
        next();
    }
};

module.exports = isOptionalAuthenticated;
