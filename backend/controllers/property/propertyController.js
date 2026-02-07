const Property = require("../../models/propertyModel");


// create room 
exports.createRoom = async(req, res) => {

    const userId = "101"  //form jwt middleware

    const {furnishedStatus, bathroomType, kitchenType, location, bedCount, amenities, images, title, description, highlight, highlightDesc, rent,} = req.body;

    if (!location || !location.streetAddress || !location.city || !location.province) {
      return res.status(400).json({
        success: false,
        message: "Complete location details are required",
      });
    }

    if (!title || !description || !rent) {
      return res.status(400).json({
        success: false,
        message: "Title, description and rent are required",
      });
    }

    // create property object
    const roomData = {
        owner: userId,
        propertyType: "room",  //bydefault room
        bhk: undefined, //room has no bhk value
        furnishedStatus: furnishedStatus || "unfurnished",
        kitchenType: kitchenType || "shared",
        location: location,
        bedroomCount: 1,
        bathroomCount: 1,
        bathroomType: bathroomType || "shared",
        bedCount: bedCount || 1,
        amenities: amenities || [],
        images: images || ["https://images.pexels.com/photos/7027844/pexels-photo-7027844.jpeg"],
        title,
        description,
        highlight,
        highlightDesc,
        rent,
        availability: true,
        isVerified: false,   //admin will verify
        views: 0,
        isDeleted: false,
    }

    // insert into property collection/table
    const room = await Property.create(roomData);

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
}