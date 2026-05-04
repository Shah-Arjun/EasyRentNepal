const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");
const { registerAgency, getMyAgency, verifyAgencyRegisterOtp, resendOtp } = require("../controllers/agencyController");

const router = express.Router();

router.post('/register', isAuthenticated, restrictTo('tenant'), registerAgency);
router.post('/verify-otp', verifyAgencyRegisterOtp);
router.post('/resend-otp', resendOtp);
router.get('/my-agency', isAuthenticated, restrictTo('owner'), getMyAgency);

module.exports = router;
