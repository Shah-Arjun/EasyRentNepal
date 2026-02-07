

// create property
exports.createProperty = async(req, res) => {
    const {ownerId, propertyType, bhk, furnishedType, bathroomType, kitchenType, location, bedreoomCount, bedCount, amenities, images, title, description, highlight, rent, isVerified} = req.body;

    if(!ownerId || furnishedType || bathroomType || kitchenType || location || bedreoomCount || bedCount|| amenities || images || title || description || highlight || rent || isVerified){
        return res.this.status(400).({
            message: "Provide all details."
        })
    }
}