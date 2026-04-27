const bcrypt = require('bcrypt')
const Agency = require('../models/Agency');
const generateOtp = require('../utils/generateOtp');


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

        const otp = generateOtp()
        const hashedOtp = await bcrypt.hash(otp, 10)

        const agency = await Agency.create({
            name,
            email,
            contact,
            address,
            city,
            owner: ownerId,
            otp: hashedOtp,
            otpExpiry: Date.now() + 5 * 60 * 1000,  // OTP valid for 5 minutes,
            isOtpVerified: false
        });

        await sendEmail({
            email: email,
            subject: "OTP for HouseRentalNepal agency registration",
            message: `${otp}`
        })

        res.status(201).json({
            success: true,
            message: "OTP sent to email for agency registration. Please verify to complete registration.",
        });
    } catch (error) {
        console.error("Error registering agency:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during agency registration" 
        });
    }
};



// VERIFY OTP
exports.verifyAgencyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const agency = await Agency.findOne({ email });
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    if (agency.isOtpVerified) {
      return res.status(400).json({ message: "Already verified" });
    }

    if (Date.now() > agency.otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, agency.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    agency.isOtpVerified = true;
    agency.otp = null;
    agency.otpExpiry = null;

    await agency.save();

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const agency = await Agency.findOne({ email });
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    agency.otp = hashedOtp;
    agency.otpExpiry = Date.now() + 5 * 60 * 1000;

    await agency.save();

    await sendEmail({
        email: email,
        subject: "OTP for HouseRentalNepal agency registration",
        message: `${otp}`
    })

    res.status(200).json({
      success: true,
      message: "OTP resent for house rental agency registration",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
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
