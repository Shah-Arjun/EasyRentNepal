const Property = require("../../models/propertyModel");
const Agency = require("../../models/Agency");
const Review = require("../../models/reviewModel");
const uploadToCloudinary = require("../../utils/uploadToCloudinary");




// create room / ADD PROPERTY  --> owner
exports.addProperty = async (req, res) => {
  const ownerId = req.user.id;

  // Simple fields
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
    facing,
    fullDescription,
    videoUrl,
    status,
  } = req.body;

  // JSON fields
  let price, location, builtArea, landArea, roadSize, amenities;

  try {
    price = JSON.parse(req.body.price);
    location = JSON.parse(req.body.location);
    builtArea = JSON.parse(req.body.builtArea);
    landArea = JSON.parse(req.body.landArea);
    roadSize = JSON.parse(req.body.roadSize);
    amenities = JSON.parse(req.body.amenities);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid form data format",
    });
  }

  // FILE VALIDATION
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No images uploaded",
    });
  }

  if (files.length > 5) {
    return res.status(400).json({
      success: false,
      message: "Max 5 images allowed",
    });
  }

  const MAX_SIZE = 5 * 1024 * 1024;

  for (const file of files) {
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed",
      });
    }

    if (file.size > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: "Each image must be less than 5MB",
      });
    }
  }

  // FIELD VALIDATION
  if (
    !title?.trim() ||
    !fullDescription?.trim() ||
    !price?.value ||
    price.value <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Title, description and valid price are required",
    });
  }

  if (
    !location?.province ||
    !location?.district ||
    !location?.municipality
  ) {
    return res.status(400).json({
      success: false,
      message: "Complete location details are required",
    });
  }


//  console.log("all validation done-backend")


  // UPLOAD IMAGES
  let uploadedImages;
  try {
    uploadedImages = await Promise.all(
      files.map((file) =>
        uploadToCloudinary(file.buffer, "house-rental-properties")
      )
    );
  } catch (err) {
    console.error("Cloudinary Error:", err);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }


// console.log("images uploaded to cloudinary--")


  // MARK PRIMARY IMAGE
  const imagesWithPrimary = uploadedImages.map((img, index) => ({
    ...img,
    isPrimary: index === 0,
  }));



  // CLEAN DATA
  const propertyData = {
    owner: ownerId,
    title: title.trim(),
    // Keep backward compatibility with older clients using "Shutter/Shop".
    category: category === "Shutter/Shop" ? "Shutter" : category,
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
    roadSize,
    fullDescription: fullDescription.trim(),
    videoUrl,
    images: imagesWithPrimary,
    amenities: Array.isArray(amenities) ? amenities : [],
    status: status || "Pending",
  };

  // console.log("property data ready to save--", propertyData)


  // SAVE TO DATABASE
  let result;
  try {
    result = await Property.create(propertyData);
  } catch (error) {
    console.error("Database Error:", error);
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message;
      return res.status(400).json({
        success: false,
        message: firstError || "Invalid property data",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Database error while creating property",
    });
  }

  // SUCCESS RESPONSE
  return res.status(201).json({
    success: true,
    message: "Property created successfully",
    data: result,
  });
};






// GET ALL PROPERTY --> admin, tenant
exports.getProperties = async(req, res) => {
  const properties = await Property.find().populate('owner', 'name email phoneNumber')    //returns array of properties

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

  if(!id){
    return res.status(400).json({
      success: false,
      message: "Please provide property id"
    })
  }
  
  try {
    const property = await Property.findById(id).populate('owner', 'name email phoneNumber profileImage');

    if(!property){
      return res.status(404).json({
        success: false,
        message: "No property found with that id"
      })
    }

    // Also find the agency associated with the owner
    const agency = await Agency.findOne({ owner: property.owner._id });

    // Calculate average rating
    const reviews = await Review.find({ propertyId: id });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
        : 0;

    // Combine them for the frontend
    const propertyWithAgency = {
      ...property.toObject(),
      agency: agency || null,
      averageRating: parseFloat(averageRating),
      totalReviews
    };

    return res.status(200).json({
      success: true,
      message: "Property found",
      property: propertyWithAgency
    })
  } catch (error) {
    console.error("Error fetching single property:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching property"
    });
  }
}




// GET OWNER PROPERTIES
exports.getOwnerProperties = async(req, res) => {
  const ownerId = req.user.id;
  
  const properties = await Property.find({ owner: ownerId });

  res.status(200).json({
    success: true,
    properties 
  });
}




// DELETE PROPERTY
exports.deleteProperty = async(req, res) => {
  const ownerId = req.user.id;
  const { id } = req.params;

  const property = await Property.findOneAndDelete({ _id: id, owner: ownerId });

  if(!property){
    return res.status(404).json({
      success: false,
      message: "Property not found or unauthorized to delete"
    });
  }

  res.status(200).json({
    success: true,
    message: "Property deleted successfully"
  });
}




// GET OWNER DASHBOARD DATA
exports.getOwnerDashboardData = async(req, res) => {
  try {
    const ownerId = req.user.id;
    
    // 1. Get all properties for this owner
    const properties = await Property.find({ owner: ownerId });
    const propertyIds = properties.map(p => p._id);
    
    // 2. Get all reviews for these properties
    const reviews = await Review.find({ propertyId: { $in: propertyIds } })
      .populate('userId', 'name profileImage')
      .populate('propertyId', 'title')
      .sort({ createdAt: -1 });

    // 3. Calculate statistics
    const totalProperties = properties.length;
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProperties,
        totalReviews,
        averageRating: parseFloat(averageRating)
      },
      latestReviews: reviews.slice(0, 5), // Only last 5 for dashboard
      properties: properties.map(p => ({
        _id: p._id,
        title: p.title,
        price: p.price,
        images: p.images
      }))
    });
  } catch (error) {
    console.error("Error fetching owner dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data"
    });
  }
}