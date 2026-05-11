const bcrypt = require('bcrypt')
const Agency = require('../models/agencyModel');
const generateOtp = require('../utils/generateOtp');
const sendEmail = require('../services/sendEmail');
const User = require('../models/userModel');
const { destroyCookie, sendTokenCookie, sendOwnerTokenCookie } = require('../utils/tokenUtils');



// REGISTER AGENCY
exports.registerAgency = async (req, res) => {
  try {
    const { name, contact, email, role, location } = req.body;
    const tenantId = req.user.id;


    if (!name || !email || !contact || !location || !location.province || !location.district ||!location.city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // console.log("form reg agency ", req.body);          //debug

    // Get user (source of truth)
    const tenant = await User.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Register tenant account first",
      });
    }

    // Check if user already has an agency
    const existingAgency = await Agency.findOne({ owner: tenantId });
    if (existingAgency) {
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const agency = await Agency.findOneAndUpdate({ owner: tenantId }, {
            otp: hashedOtp,
            otpExpiry: Date.now() + 1 * 60 * 1000, // OTP valid for 1 minute,
            isOtpVerified: false,
        }, { returnDocument: 'after' });

        await sendEmail({
        email: email,
        subject: "OTP for HouseRentalNepal agency registration",
        message: `${otp}`,
        });

        return res.status(400).json({
            success: false,
            message: "User already has an agency registered. Verify OTP.",
        });
    }

    //  Use logged-in user's email (not from frontend)
    if (tenant && tenant.email !== email) {
      return res.status(400).json({
        success: false,
        message: "Email should be same as user's registered email",
      });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const agency = await Agency.create({
      name,
      email,
      contact,
      location: {
        province: location.province,
        district: location.district,
        city: location.city,
        tole: location.tole || "",
      },
      owner: tenantId,
      otp: hashedOtp,
      otpExpiry: Date.now() + 1 * 60 * 1000, // OTP valid for 1 minute,
      isOtpVerified: false,
    });

    await User.findByIdAndUpdate(tenantId, { $addToSet: { role: 'owner' } }); // Add 'owner' role to user if not already present, dont overwrite or create duplicate roles

    await sendEmail({
      email: email,
      subject: "OTP for HouseRentalNepal agency registration",
      message: `${otp}`,
    });

    res.status(201).json({
      success: true,
      message: "OTP sent to email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error("Error registering agency:", error);
    res.status(500).json({
      success: false,
      message: "Server error during agency registration",
    });
  }
};






// VERIFY OTP
exports.verifyAgencyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const tenant = await User.findOne({ email })
    const agency = await Agency.findOne({ email });
    if (!agency) return res.status(404).json({ message: "Agency not found" });

    if (agency.isOtpVerified) {
        destroyCookie(res, 'auth_token');  // Clear any existing auth token cookie on OTP verification (important if user had a previous session)
        const cookieData = { _id: agency._id, email: agency.email, role: 'owner' };
        return sendOwnerTokenCookie(res, 200, 'Agency registered successfully', cookieData);
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

    // Add 'owner' role to the user if not already present
    // try {
    //   const user = await User.findById(agency.owner).select('+role');
    //   if (user) {
    //     const roles = Array.isArray(user.role) ? user.role.slice() : (user.role ? [user.role] : []);
    //     if (!roles.includes('owner')) {
    //       roles.push('owner');
    //       user.role = roles;
    //       await user.save();
    //     }
    //   }
    // } catch (err) {
    //   console.error('Error appending owner role to user:', err.message);
    // }
    
    await User.findByIdAndUpdate(tenant._id, { $addToSet: { role: 'owner' } }); // Add 'owner' role to user if not already present, dont overwrite or create duplicate roles

    destroyCookie(res, 'auth_token'); // Clear any existing auth token cookie on OTP verification (important if user had a previous session)
    // ALWAYS use the actual User._id, not Agency._id
    const cookieData = { _id: tenant._id, email: tenant.email, role: 'owner' };
    return sendOwnerTokenCookie(res, 200, 'Agency registered successfully', cookieData);
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
    agency.otpExpiry = Date.now() + 1 * 60 * 1000;

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
