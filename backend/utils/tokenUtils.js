const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



//cookie name
const COOKIE_NAME = "auth_token"


//cookie behavior
// const cookieOptions = () => ({
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',                      
//   sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',  
//   maxAge: 12 * 60 * 60 * 1000,   // 12 hours
//   path: '/'
// });



const cookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProduction,
        // Use None in production so the auth cookie is accepted on cross-origin frontends.
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 1 * 60 * 60 * 1000,   // 1 hour
        path: '/'
    };
};




// function to generate token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE || '1h',
        algorithm: 'HS256'
    })
}



// send login token
const sendTokenCookie = (res, statusCode, message, user) => {
  // console.log(user)
  const token = generateToken(user._id, user.role);
  // console.log("from sendToken -> " ,token)
  res.status(statusCode)
    .cookie(COOKIE_NAME, token, cookieOptions())
    .json({ 
        success: true,
        message,
        user: {
            id: user._id,
            // name: user.name,
            // email: user.email,
            role: user.role
        } 
    });
};




// destory cookies
const destroyCookie = (res) => {
    try {
        res.clearCookie(COOKIE_NAME, {                        //overwrites the cookie with empyt string
        ...cookieOptions(),
        expires: new Date(0),                                // immediate expiry
        maxAge: 0
        })
        return true
    } catch{
        console.error("Error clearing cookie:", error.message);
        return false;
    }
}



module.exports = { cookieOptions, generateToken, sendTokenCookie, destroyCookie }