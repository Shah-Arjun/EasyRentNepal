const Property = require("../../models/propertyModel");
const Agency = require("../../models/Agency");
const Review = require("../../models/reviewModel");
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