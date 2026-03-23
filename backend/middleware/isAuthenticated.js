const { verifyToken, createClerkClient } = require('@clerk/backend');
const User = require('../models/userModel');

// Initialize Clerk client to fetch user details if needed
const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});


const isAuthenticated = async (req, res, next) => {
    try {
        // Read Bearer token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ message: "Please Login" });
        }

        const token = authHeader.split(' ')[1];

        // Verify the Clerk JWT token using secretKey only (no remote JWK fetch)
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        const clerkUserId = payload.sub;

        if (!clerkUserId) {
            return res.status(403).json({ message: "Invalid token" });
        }

        // Find or create the user in our DB using the Clerk userId
        let user = await User.findOne({ clerkId: clerkUserId });

        if (!user) {
            // Fetch user details from Clerk API to populate our DB
            const clerkUser = await clerkClient.users.getUser(clerkUserId);
            user = await User.create({
                clerkId: clerkUserId,
                email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
            });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        res.status(401).json({ message: "Unauthorized: " + err.message });
    }
};

module.exports = isAuthenticated;