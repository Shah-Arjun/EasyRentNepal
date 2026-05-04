const generateOtp = () => {
    const r_no = Math.random() //gives decimal no. in range 0 to 1
    const fourDigit = r_no * 10000
    const otp = Math.floor(fourDigit).toString()  //converts into integer

    if (otp.length < 4) {
        otp = otp.padStart(4, '0');     // padStart adds leading strig of '0' to opt, owrks only in string.
    }

    return otp;
}


module.exports = generateOtp;