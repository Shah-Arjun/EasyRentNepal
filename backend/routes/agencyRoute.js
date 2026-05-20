const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");
const upload = require("../middleware/upload");
const { registerAgency, getMyAgency, verifyAgencyRegisterOtp, resendOtp } = require("../controllers/agencyController");

const router = express.Router();

router.post('/register', isAuthenticated, restrictTo('tenant'), upload.single('qrImage'), registerAgency);
router.post('/verify-otp', verifyAgencyRegisterOtp);
router.post('/resend-otp', resendOtp);
router.get('/my-agency', isAuthenticated, restrictTo('owner'), getMyAgency);

module.exports = router;
