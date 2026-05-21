const Property = require("../models/propertyModel");

/**
 * Calculates the cosine similarity between two numeric vectors with feature weights.
 * @param {number[]} vecA - Vector A (User preference)
 * @param {number[]} vecB - Vector B (Property)
 * @param {number[]} weights - Vector of weights corresponding to each feature dimension
 * @returns {number} similarity score between 0 and 1
 */
function weightedCosineSimilarity(vecA, vecB, weights) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    const w = weights[i] || 1;
    const valA = (Number(vecA[i]) || 0) * w;
    const valB = (Number(vecB[i]) || 0) * w;

    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return isNaN(similarity) ? 0 : similarity;
}

/**
 * Builds recommendation list for a user based on their preferences
 * @param {object} preferences - User preferences object
 * @param {string|null} currentUserId - The logged-in user's ID
 * @returns {Promise<object[]>} Sorted array of properties with similarity score
 */
async function getRecommendedProperties(preferences = {}, currentUserId = null) {
  try {
    // 1. Fetch all available properties and populate owner to allow owner filter exclusion
    const properties = await Property.find({ status: "Available" })
      .populate({
        path: 'owner',
        select: 'owner'
      })
      .select('-plot_embedding');

    if (properties.length === 0) return [];

    // Filter out properties owned by the current logged-in user to prevent owner-self-recommendation loop
    let filteredProperties = properties;
    if (currentUserId) {
      filteredProperties = properties.filter(p => {
        if (!p.owner) return true;
        const ownerUserId = p.owner.owner 
          ? String(p.owner.owner._id || p.owner.owner) 
          : String(p.owner._id || p.owner);
        return ownerUserId !== String(currentUserId);
      });
    }

    if (filteredProperties.length === 0) return [];

    // 2. Safely collect active preference attributes with strict type handling
    const categoryPref = preferences && typeof preferences.category === 'string' ? preferences.category.trim() : "";
    const listingTypePref = preferences && typeof preferences.listingType === 'string' ? preferences.listingType.trim() : "";
    const districtPref = preferences && typeof preferences.district === 'string' ? preferences.district.trim() : "";
    const municipalityPref = preferences && typeof preferences.municipality === 'string' ? preferences.municipality.trim() : "";
    const minPricePref = preferences && typeof preferences.minPrice !== 'undefined' ? (Number(preferences.minPrice) || 0) : 0;
    const maxPricePref = preferences && typeof preferences.maxPrice !== 'undefined' ? (Number(preferences.maxPrice) || 0) : 0;
    const bedroomsPref = preferences && typeof preferences.bedrooms !== 'undefined' ? (Number(preferences.bedrooms) || 0) : 0;
    const bathroomsPref = preferences && typeof preferences.bathrooms !== 'undefined' ? (Number(preferences.bathrooms) || 0) : 0;
    const furnishedPref = preferences && typeof preferences.furnishedStatus === 'string' ? preferences.furnishedStatus.trim() : "";
    const facingPref = preferences && typeof preferences.facing === 'string' ? preferences.facing.trim() : "";

    // Combine historical interaction categories safely to boost matching items
    const rawWishlist = preferences && Array.isArray(preferences.wishlistCategories) ? preferences.wishlistCategories : [];
    const rawViewed = preferences && Array.isArray(preferences.viewedCategories) ? preferences.viewedCategories : [];
    const rawSearch = preferences && Array.isArray(preferences.searchHistory) ? preferences.searchHistory : [];

    const historyCategories = new Set([
      ...rawWishlist.filter(item => typeof item === 'string'),
      ...rawViewed.filter(item => typeof item === 'string'),
      ...rawSearch.filter(item => typeof item === 'string').map(q => q.toLowerCase())
    ].filter(Boolean));

    // Determine if user has any active preference/interaction history
    const hasPreferences = !!(
      categoryPref ||
      listingTypePref ||
      districtPref ||
      municipalityPref ||
      minPricePref ||
      maxPricePref ||
      bedroomsPref ||
      bathroomsPref ||
      furnishedPref ||
      facingPref ||
      historyCategories.size > 0
    );

    // FALLBACK: If no preferences exist, return trending properties (by views and averageRating)
    if (!hasPreferences) {
      console.log("No user preferences found. Falling back to trending/popular properties.");
      return filteredProperties
        .sort((a, b) => (b.views || 0) - (a.views || 0) || (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 10)
        .map(p => ({
          ...p.toObject(),
          similarityScore: 1.0, // default placeholder match for trending
          isTrendingFallback: true,
        }));
    }

    // 3. Find global min/max price and bedroom/bathroom ranges to normalize values
    const prices = filteredProperties.map(p => p.price?.value).filter(v => typeof v === 'number' && !isNaN(v));
    const maxPriceDB = prices.length > 0 ? Math.max(...prices) : 1000000;
    const minPriceDB = prices.length > 0 ? Math.min(...prices) : 0;
    const priceRange = maxPriceDB - minPriceDB || 1;

    const bedroomCounts = filteredProperties.map(p => p.bedrooms).filter(v => typeof v === 'number' && !isNaN(v));
    const maxBedroomsDB = bedroomCounts.length > 0 ? Math.max(...bedroomCounts) : 10;

    const bathroomCounts = filteredProperties.map(p => p.bathrooms).filter(v => typeof v === 'number' && !isNaN(v));
    const maxBathroomsDB = bathroomCounts.length > 0 ? Math.max(...bathroomCounts) : 10;

    // 4. Define vocabularies for one-hot encoding
    const categories = ["House", "Land", "Apartment", "Flat", "Office", "Room", "Shutter"];
    const listingTypes = ["Sale", "Rent"];
    const furnishedStatuses = ["unfurnished", "semi-furnished", "fully-furnished"];
    const facings = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

    // Collect unique locations dynamically from properties in the database to build precise spatial dimensions
    const districts = [...new Set(filteredProperties.map(p => p.location?.district).filter(Boolean))];
    const municipalities = [...new Set(filteredProperties.map(p => p.location?.municipality).filter(Boolean))];

    // 5. Construct user preference vector and define the weights vector
    const userVec = [];
    const weights = [];

    // Define Feature Weight constants
    const WT_HIGH = 5.0;
    const WT_MED_HIGH = 4.0;
    const WT_MED = 3.0;
    const WT_LOW_MED = 2.0;

    // Category dimensions
    categories.forEach(c => {
      userVec.push(c.toLowerCase() === categoryPref.toLowerCase() ? 1 : 0);
      weights.push(WT_HIGH);
    });

    // Listing Type dimensions
    listingTypes.forEach(lt => {
      userVec.push(lt.toLowerCase() === listingTypePref.toLowerCase() ? 1 : 0);
      weights.push(WT_MED_HIGH);
    });

    // District dimensions
    districts.forEach(d => {
      userVec.push(d.toLowerCase() === districtPref.toLowerCase() ? 1 : 0);
      weights.push(WT_HIGH);
    });

    // Municipality dimensions
    municipalities.forEach(m => {
      userVec.push(m.toLowerCase() === municipalityPref.toLowerCase() ? 1 : 0);
      weights.push(WT_HIGH);
    });

    // Furnished Status dimensions
    furnishedStatuses.forEach(fs => {
      userVec.push(fs.toLowerCase() === furnishedPref.toLowerCase() ? 1 : 0);
      weights.push(WT_MED);
    });

    // Facing dimensions
    facings.forEach(f => {
      userVec.push(f.toLowerCase() === facingPref.toLowerCase() ? 1 : 0);
      weights.push(WT_LOW_MED);
    });

    // Bedrooms dimension
    const normBedroomsPref = maxBedroomsDB > 0 ? (bedroomsPref / maxBedroomsDB) : 0;
    userVec.push(normBedroomsPref);
    weights.push(WT_MED);

    // Bathrooms dimension
    const normBathroomsPref = maxBathroomsDB > 0 ? (bathroomsPref / maxBathroomsDB) : 0;
    userVec.push(normBathroomsPref);
    weights.push(WT_LOW_MED);

    // Price dimension
    let normPricePref = 0;
    if (minPricePref || maxPricePref) {
      const avgPrice = (minPricePref + (maxPricePref || minPricePref)) / 2;
      normPricePref = (avgPrice - minPriceDB) / priceRange;
    } else {
      // default to mid-point
      normPricePref = 0.5;
    }
    userVec.push(normPricePref);
    weights.push(WT_MED_HIGH);

    // History Match dimension
    userVec.push(1); // User always matches themselves
    weights.push(WT_LOW_MED);

    // 6. Map each property into vector space and compute cosine similarity
    const scoredProperties = filteredProperties.map(property => {
      const propVec = [];

      // Category one-hot
      categories.forEach(c => {
        propVec.push(property.category && typeof property.category === 'string' && property.category.toLowerCase() === c.toLowerCase() ? 1 : 0);
      });

      // Listing type one-hot
      listingTypes.forEach(lt => {
        propVec.push(property.listingType && typeof property.listingType === 'string' && property.listingType.toLowerCase() === lt.toLowerCase() ? 1 : 0);
      });

      // District one-hot
      districts.forEach(d => {
        propVec.push(property.location?.district && typeof property.location.district === 'string' && property.location.district.toLowerCase() === d.toLowerCase() ? 1 : 0);
      });

      // Municipality one-hot
      municipalities.forEach(m => {
        propVec.push(property.location?.municipality && typeof property.location.municipality === 'string' && property.location.municipality.toLowerCase() === m.toLowerCase() ? 1 : 0);
      });

      // Furnished status one-hot
      furnishedStatuses.forEach(fs => {
        propVec.push(property.furnishedStatus && typeof property.furnishedStatus === 'string' && property.furnishedStatus.toLowerCase() === fs.toLowerCase() ? 1 : 0);
      });

      // Facing one-hot
      facings.forEach(f => {
        propVec.push(property.facing && typeof property.facing === 'string' && property.facing.toLowerCase() === f.toLowerCase() ? 1 : 0);
      });

      // Bedrooms normalized
      const propBedrooms = typeof property.bedrooms === 'number' ? property.bedrooms : 0;
      propVec.push(maxBedroomsDB > 0 ? (propBedrooms / maxBedroomsDB) : 0);

      // Bathrooms normalized
      const propBathrooms = typeof property.bathrooms === 'number' ? property.bathrooms : 0;
      propVec.push(maxBathroomsDB > 0 ? (propBathrooms / maxBathroomsDB) : 0);

      // Price normalized
      const propPrice = property.price?.value || 0;
      propVec.push((propPrice - minPriceDB) / priceRange);

      // History Match one-hot
      let histMatch = 0;
      if (property.category && historyCategories.has(property.category.toLowerCase())) {
        histMatch = 1;
      }
      // Also scan searches
      if (property.title && typeof property.title === 'string') {
        for (const term of historyCategories) {
          if (property.title.toLowerCase().includes(term)) {
            histMatch = 1;
            break;
          }
        }
      }
      propVec.push(histMatch);

      // Calculate weighted cosine similarity
      const similarityScore = weightedCosineSimilarity(userVec, propVec, weights);

      return {
        ...property.toObject(),
        similarityScore: parseFloat(similarityScore.toFixed(4)),
      };
    });

    // 7. Sort by similarityScore descending, take top 10
    return scoredProperties
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 10);
  } catch (error) {
    console.error("Critical error in getRecommendedProperties engine:", error);
    return [];
  }
}

module.exports = {
  getRecommendedProperties
};
