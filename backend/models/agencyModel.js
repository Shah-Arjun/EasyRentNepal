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

    paymentMethods: {
        khalti: {
            isEnabled: { type: Boolean, default: false },
            number: { type: String },
            qr: {
              url: { type: String },
              public_id: { type: String }
            }
        },

        esewa: {
            isEnabled: { type: Boolean, default: false },
            number: { type: String },
            qr: {
              url: { type: String },
              public_id: { type: String }
            }
        }
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