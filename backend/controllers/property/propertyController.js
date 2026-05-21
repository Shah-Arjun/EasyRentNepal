// const Property = require("../../models/propertyModel");
const Agency = require("../../models/agencyModel");
const Property = require("../../models/propertyModel");
const Review = require("../../models/reviewModel");
const { createNewPropertyEmbeddingWhiteAdding } = require("../../utils/createNewPropertyEmbeddingWhileAdding");
const uploadToCloudinary = require("../../utils/uploadToCloudinary");




// create room / ADD PROPERTY  --> owner
exports.addProperty = async (req, res) => {
  const userId = req.user.id;

  const owner = await Agency.findOne({ owner: userId })

  // console.log('hhhh---', owner._id)

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
    owner: owner._id,
    title: title.trim(),
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
    status: status || "Available",
  };

  console.log("property data ready to save--", propertyData)


  // SAVE TO DATABASE
  let result;
  try {
      result = await Property.create(propertyData);

      const embedding = await createNewPropertyEmbeddingWhiteAdding(result);

  if (embedding) {
      result.plot_embedding = embedding;
      await result.save();
  }
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






// EDIT PROPERTY  --> owner
exports.editProperty = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const owner = await Agency.findOne({ owner: userId })
  const ownerId = owner._id;

  // Simple fields
  const {
    title, category, listingType, noOfFlat, bedrooms, bathrooms, bathroomType, bedCount,
    living, kitchen, parking, furnishedStatus, builtYear, facing, fullDescription, videoUrl, status,
  } = req.body;

  // JSON fields
  let price, location, builtArea, landArea, roadSize, amenities, retainedImages;

  try {
    price = JSON.parse(req.body.price);
    location = JSON.parse(req.body.location);
    builtArea = JSON.parse(req.body.builtArea);
    landArea = JSON.parse(req.body.landArea);
    roadSize = JSON.parse(req.body.roadSize);
    amenities = JSON.parse(req.body.amenities);
    retainedImages = JSON.parse(req.body.retainedImages || "[]");
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid form data format" });
  }

  // FILE VALIDATION
  const files = req.files || [];

  if (retainedImages.length + files.length === 0) {
    return res.status(400).json({ success: false, message: "At least 1 image is required" });
  }

  if (retainedImages.length + files.length > 5) {
    return res.status(400).json({ success: false, message: "Max 5 images allowed" });
  }

  const MAX_SIZE = 5 * 1024 * 1024;
  for (const file of files) {
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ success: false, message: "Only image files are allowed" });
    }
    if (file.size > MAX_SIZE) {
      return res.status(400).json({ success: false, message: "Each image must be less than 5MB" });
    }
  }

  // FIELD VALIDATION
  if (!title?.trim() || !fullDescription?.trim() || !price?.value || price.value <= 0) {
    return res.status(400).json({ success: false, message: "Title, description and valid price are required" });
  }

  if (!location?.province || !location?.district || !location?.municipality) {
    return res.status(400).json({ success: false, message: "Complete location details are required" });
  }

  // Find Property
  let property = await Property.findOne({ _id: id, owner: ownerId });
  if (!property) {
    return res.status(404).json({ success: false, message: "Property not found or unauthorized to edit" });
  }

  // UPLOAD NEW IMAGES
  let uploadedImages = [];
  try {
    if (files.length > 0) {
      uploadedImages = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer, "house-rental-properties"))
      );
    }
  } catch (err) {
    console.error("Cloudinary Error:", err);
    return res.status(500).json({ success: false, message: "Image upload failed" });
  }

  // Combine Images
  const allImages = [...retainedImages, ...uploadedImages].map((img, index) => ({
    ...img,
    isPrimary: index === 0,
  }));

  // Update Data
  const propertyData = {
    title: title.trim(),
    category: category === "Shutter/Shop" ? "Shutter" : category,
    listingType, noOfFlat, bedrooms, bathrooms, bathroomType, bedCount,
    living, kitchen, parking, furnishedStatus, builtYear, builtArea, landArea,
    facing, price, location, roadSize, fullDescription: fullDescription.trim(), videoUrl,
    images: allImages, amenities: Array.isArray(amenities) ? amenities : [],
    status: status || property.status,
  };

  try {
    property = await Property.findOneAndUpdate({ _id: id, owner: ownerId }, propertyData, { new: true, runValidators: true });
    
    // update embeddings
    const embedding = await createNewPropertyEmbeddingWhiteAdding(property);
    if (embedding) {
      property.plot_embedding = embedding;
      await property.save();
    }

    return res.status(200).json({ success: true, message: "Property updated successfully", data: property });
  } catch (error) {
    console.error("Database Error:", error);
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0]?.message;
      return res.status(400).json({ success: false, message: firstError || "Invalid property data" });
    }
    return res.status(500).json({ success: false, message: "Database error while updating property" });
  }
};




// GET ALL PROPERTY --> admin, tenant
exports.getProperties = async(req, res) => {
  const properties = await Property.find().populate('owner').select('-plot_embedding').sort({ createdAt: -1 })    //returns array of properties sorted by newest first
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
    // Increment the property views count
    const property = await Property.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .populate('owner', 'name email contact profileImage')
      .select('-plot_embedding');

    if(!property){
      return res.status(404).json({
        success: false,
        message: "No property found with that id"
      })
    }

    // If a logged-in user viewed the property, update their viewedCategories
    if (req.user && req.user.id) {
      const User = require("../../models/userModel");
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { "userPreferences.viewedCategories": property.category }
      }).catch(err => console.error("Error updating viewedCategories preference:", err));
    }

    // Also find the agency associated with the owner, if the owner still exists
    const ownerId = property.owner?._id || property.owner;
    const agency = ownerId ? await Agency.findOne({ owner: ownerId }) : null;

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

    console.log("property with agency--", propertyWithAgency)

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
  const userId = req.user.id;
  const owner = await Agency.findOne({ owner: userId })

  const ownerId = owner._id;
  const properties = await Property.find({ owner: ownerId });

  res.status(200).json({
    success: true,
    properties 
  });
}




// DELETE PROPERTY
exports.deleteProperty = async(req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const owner = await Agency.findOne({ owner: userId })

  const ownerId = owner._id;
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




// UPDATE PROPERTY STATUS
exports.updatePropertyStatus = async(req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Available', 'Sold', 'Rented'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const owner = await Agency.findOne({ owner: userId })
    const ownerId = owner._id;
    const property = await Property.findOneAndUpdate(
      { _id: id, owner: ownerId },
      { status },
      { new: true }
    );

    if(!property){
      return res.status(404).json({
        success: false,
        message: "Property not found or unauthorized to update"
      });
    }

    res.status(200).json({
      success: true,
      message: "Property status updated successfully",
      property
    });
  } catch (error) {
    console.error("Error updating property status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating status"
    });
  }
}




// GET OWNER DASHBOARD DATA
exports.getOwnerDashboardData = async(req, res) => {
  try {
    const userId = req.user.id;

    // Properties are stored against the Agency _id, not the User _id.
    const agency = await Agency.findOne({ owner: userId });
    if (!agency) {
      return res.status(404).json({
        success: false,
        message: "Agency not found for this owner"
      });
    }

    // 1. Get all properties for this owner agency
    const properties = await Property.find({ owner: agency._id });
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
        status: p.status,
        location: p.location,
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