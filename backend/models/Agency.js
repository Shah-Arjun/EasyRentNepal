const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    otp: { type: String },
    isOtpVerified: { type: Boolean, default: false },
    otpExpiry: { type: Date }

}, { timestamps: true });

const Agency = mongoose.model("Agency", agencySchema);

module.exports = Agency;