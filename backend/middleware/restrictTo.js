
// function to restrict authorization
const restrictTo = (...roles) => {
    // return middleware
    return (req, res, next) => {
        const userRole = req.user.role  //req.user is the logged in user details passed from isAuthenticated

        if(!roles.includes(userRole)){
            return res.status(403).json({
                message: "You don't have permission for this action."
            })
        } else {
            next()
        }
    }

}


module.exports = restrictTo