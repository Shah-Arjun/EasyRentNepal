const Agency = require('../models/Agency');

// REGISTER AGENCY
exports.registerAgency = async (req, res) => {
    try {
        const { name, email, contact, address, city } = req.body;
        const ownerId = req.user.id;

        if (!name || !email || !contact || !address || !city) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Check if user already has an agency
        const existingAgency = await Agency.findOne({ owner: ownerId });
        if (existingAgency) {
            return res.status(400).json({ 
                success: false, 
                message: "User already has an agency registered" 
            });
        }

        const agency = await Agency.create({
            name,
            email,
            contact,
            address,
            city,
            owner: ownerId
        });

        res.status(201).json({
            success: true,
            message: "Agency registered successfully",
            agency
        });
    } catch (error) {
        console.error("Error registering agency:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during agency registration" 
        });
    }
};

// GET MY AGENCY
exports.getMyAgency = async (req, res) => {
    try {
        const agency = await Agency.findOne({ owner: req.user.id });
        if (!agency) {
            return res.status(404).json({ 
                success: false, 
                message: "Agency not found" 
            });
        }
        res.status(200).json({ 
            success: true, 
            agency 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server error fetching agency" 
        });
    }
};
