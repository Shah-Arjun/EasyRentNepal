const mongoose = require("mongoose");


const agencySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    location: {
        province: { type: String },
        district: { type: String },
        city: { type: String },
        tole: { type: String },
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    esewaId: {
        type: String,
        required: true
    },

    esewaQr: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    },

    otp: {
        type: String,
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    otpExpiry: {
        type: Date,
    },
}, { timestamps: true });



const Agency = mongoose.model("Agency", agencySchema);
module.exports = Agency;