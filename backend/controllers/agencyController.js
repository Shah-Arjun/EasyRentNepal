const bcrypt = require('bcrypt')
const Agency = require('../models/agencyModel');
const generateOtp = require('../utils/generateOtp');
const sendEmail = require('../services/sendEmail');
const User = require('../models/userModel');
const { destroyCookie, sendTokenCookie, sendOwnerTokenCookie } = require('../utils/tokenUtils');
const uploadToCloudinary = require('../utils/uploadToCloudinary');



// REGISTER AGENCY
exports.registerAgency = async (req, res) => {
  try {
    const { name, contact, email, role, location, esewaId } = req.body;
    const tenantId = req.user.id;

    let parsedLocation = {};
    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (err) {
        // Ignored — location may arrive as flat fields
      }
    } else if (location && typeof location === 'object') {
      parsedLocation = location;
    }

    const province = parsedLocation.province || req.body.province || (req.body.location && req.body.location.province);
    const district = parsedLocation.district || req.body.district || (req.body.location && req.body.location.district);
    const city = parsedLocation.city || req.body.city || (req.body.location && req.body.location.city);
    const tole = parsedLocation.tole || req.body.tole || (req.body.location && req.body.location.tole) || "";

    if (!name || !email || !contact || !province || !district || !city || !esewaId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (including eSewa ID)",
      });
    }

    // Get user (source of truth)
    const tenant = await User.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Register tenant account first",
      });
    }

    // Check if user already has an agency (retry registration)
    const existingAgency = await Agency.findOne({ owner: tenantId });
    if (existingAgency) {
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const qrResult = req.file ? await uploadToCloudinary(req.file.buffer, "agency-esewa-qr") : undefined;

        const updateFields = {
            name,
            email,
            contact,
            location: { province, district, city, tole },
            esewaId,
            otp: hashedOtp,
            otpExpiry: Date.now() + 1 * 60 * 1000,
            isOtpVerified: false,
        };

        if (qrResult) {
            updateFields.esewaQr = {
                url: qrResult.url,
                public_id: qrResult.public_id,
            };
        }

        await Agency.findOneAndUpdate({ owner: tenantId }, updateFields, { returnDocument: 'after' });

        await sendEmail({
          email: email,
          subject: "OTP for EasyRentNepal agency registration",
          message: `${otp}`,
        });

        return res.status(400).json({
            success: false,
            message: "User already has an agency registered. Verify OTP.",
        });
    }

    // Email must match user's registered email
    if (tenant && tenant.email !== email) {
      return res.status(400).json({
        success: false,
        message: "Email should be same as user's registered email",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "eSewa QR Image upload is required",
      });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const qrResult = await uploadToCloudinary(req.file.buffer, "agency-esewa-qr");

    const agency = await Agency.create({
      name,
      email,
      contact,
      location: { province, district, city, tole },
      esewaId,
      esewaQr: {
        url: qrResult.url,
        public_id: qrResult.public_id,
      },
      owner: tenantId,
      otp: hashedOtp,
      otpExpiry: Date.now() + 1 * 60 * 1000,
      isOtpVerified: false,
    });

    // Add 'owner' role to user
    await User.findByIdAndUpdate(tenantId, { $addToSet: { role: 'owner' } });

    await sendEmail({
      email: email,
      subject: "OTP for EasyRentNepal agency registration",
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
        destroyCookie(res, 'auth_token');
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

    await User.findByIdAndUpdate(tenant._id, { $addToSet: { role: 'owner' } });

    destroyCookie(res, 'auth_token');
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
        subject: "OTP for EasyRentNepal agency registration",
        message: `${otp}`
    })

    res.status(200).json({
      success: true,
      message: "OTP resent for agency registration",
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
