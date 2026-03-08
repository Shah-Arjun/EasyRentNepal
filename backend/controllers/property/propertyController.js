const Property = require("../../models/propertyModel");
const { generateSlug } = require("../../utils/generateSlug");


// create room / ADD PROPERTY  --> owner
exports.addProperty = async(req, res) => {

    const ownerId = req.user.id  //form jwt middleware

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
      owner : ownerId,
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
      message: "Property created successfully",
      data: property,
    });
}





// GET ALL PROPERTY --> admin, tenant
exports.getProperties = async(req, res) => {
  const properties = await Property.find()    //returns array of properties

  if(properties.length === 0){
    return res.status(400).json({
      success: false,
      message: "No property found"
    })
  }

  res.status(200).json({
    success: true,
    properties 
  })
}




// GET SINGLE PROPERTY BY ID
exports.getSingleProperty = async(req, res) => {
  const {id} = req.params

  // console.log("\nreq.params---->\n" ,req.params)

  if(!id){
    return res.status(400).json({
      message: "Please provide property id"
    })
  }
  
  const property = await Property.find({ _id : id })

  if(property.length == 0){
    return res.status(400).json({
      message: "No property found with that id",
      property: [],
    })
  }

  return res.status(200).json({
    message: "Property found with that id",
    property
  })
}