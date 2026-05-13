
// function to restrict authorization
const restrictTo = (...roles) => {
    // return middleware
    return (req, res, next) => {
        const userRole = req.user?.role

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