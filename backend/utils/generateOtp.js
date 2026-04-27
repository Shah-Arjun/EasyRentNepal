const generateOtp = () => {
    const r_no = Math.random() //gives decimal no. in range 0 to 1
    const fourDigit = r_no * 10000
    const otp = Math.floor(fourDigit).toString()  //converts into integer

    return otp;
}


module.exports = generateOtp;