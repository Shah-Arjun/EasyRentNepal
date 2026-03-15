import User from "../models/userModel.js"
import Agency from "../models/Agency.js"

export const agencyReg = async (req, res) => {
    try {
        const { name, email, address, contact, city } = req.body
        const owner = req.user._id

        const agency = await Agency.findOne({ owner })
        if (agency) {
            return res.json({ success: false, message: "Owner Already Registered." })
        }

        await Agency.create({
            name,
            email,
            address,
            contact,
            city,
        });
        await User.findByIdAndUpdate(owner, { role: "AgencyOwner" })


        res.json({ success: true, message: "Owner Registered Successfully." })
    } catch (error) {
        
        return res.json({ success: false, message: error.message })
    }
}