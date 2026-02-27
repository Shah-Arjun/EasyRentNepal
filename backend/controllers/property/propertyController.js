const Property = require("../../models/propertyModel");


// create room 
exports.createRoom = async(req, res) => {

    const userId = "101"  //form jwt middleware

    const {furnishedStatus, bathroomType, location, bedCount, amenities, images, title, description} = req.body;

    if (!location || !location.municipality || !location.district || !location.province) {
      return res.status(400).json({
        success: false,
        message: "Complete location details are required",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, description are required",
      });
    }

    // create property object
    const roomData = {
        title,
        category,
        listingType,
        noOfFlat,
        bedrooms,
        bathrooms,
        bathroomType: bathroomType,
        bedCount: bedCount,
        living,
        kitchens,
        parking,
        furnishedStatus,
        builtYear,
        builtArea,
        landArea,
        facing,
        price,
        location,
        direction,
        roadSize,
        fullDescription: description,
        images: images || ["https://images.pexels.com/photos/7027844/pexels-photo-7027844.jpeg"],
        owner,
        amenities,
        status,
    }

    // insert into property collection/table
    const room = await Property.create(roomData);

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
}