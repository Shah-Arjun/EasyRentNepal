const Property = require("../../models/propertyModel");
const { generateSlug } = require("../../utils/generateSlug");


// create room / ADD PROPERTY  --> owner
exports.addProperty = async(req, res) => {

    // const userId = req.body.owner.user  //form jwt middleware

    const {
      title,
      category,
      listingType,
      noOfFlat,
      bedrooms,
      bathrooms,
      bathroomType,
      bedCount,
      living,
      kitchen,
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
      fullDescription,
      images,
      amenities,
      status,
    } = req.body;

    
    if (!title || !fullDescription || !price?.value) {
      return res.status(400).json({
        success: false,
        message: "Title, description and price are required",
      });
    }

    if (!location || !location.municipality || !location.district || !location.province) {
      return res.status(400).json({
        success: false,
        message: "Complete location details are required",
      });
    }

    // id image provided then save the url else set default
    const setImage = images || 
       [{
          url: "https://images.pexels.com/photos/7027844/pexels-photo-7027844.jpeg",
          isPrimary: true
        }]


    // create property object
    const propertyData = {
      title,
      category,
      listingType,
      noOfFlat,
      bedrooms,
      bathrooms,
      bathroomType,
      bedCount,
      living,
      kitchen,
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
      fullDescription,
      images: setImage,
      amenities,
      status,
    }

    propertyData.slug = generateSlug(title, location);

    // insert into property collection/table
    const property = await Property.create(propertyData);

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: property,
    });
}





// GET ALL PROPERTY --> admin, tenant
exports.getProperties = async(req, res) => {
  const properties = await Property.find()
  // if(!)
  console.log(properties)
}