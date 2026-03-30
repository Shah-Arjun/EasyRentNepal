require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/propertyModel');

const generateTitle = (category, municipality) => {
    const adjectives = ["Beautiful", "Cozy", "Modern", "Spacious", "Luxurious", "Affordable", "Comfortable", "Elegant"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    if (category === "Room") return `${adj} Single Room in ${municipality}`;
    if (category === "House" || category === "Villa") return `${adj} Family ${category} in ${municipality}`;
    return `${adj} ${category} for Rent in ${municipality}`;
};

const generateDescription = (category, municipality, beds) => {
    if (category === "Room") {
        return `A well-maintained and affordable single room available for rent in ${municipality}. Perfect for a student or single professional. Close to local amenities, public transport, and markets.`;
    }
    return `Discover this wonderful ${beds}-bedroom ${category.toLowerCase()} located in the heart of ${municipality}. Featuring modern interiors, ample natural light, and a convenient location. Ideal for individuals or families looking for a comfortable living space with easy access to schools, hospitals, and shopping centers.`;
};

const updatePropertiesData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const properties = await Property.find();
    console.log(`Found ${properties.length} properties to update.`);

    for (let i = 0; i < properties.length; i++) {
        const p = properties[i];
        
        // Randomize realistic room counts
        let beds = 1;
        let baths = 1;
        if (p.category === 'House' || p.category === 'Villa') {
            beds = Math.floor(Math.random() * 4) + 2; // 2 to 5
            baths = Math.floor(Math.random() * 3) + 1; // 1 to 3
        } else if (p.category === 'Apartment' || p.category === 'Flat') {
            beds = Math.floor(Math.random() * 3) + 1; // 1 to 3
            baths = Math.floor(Math.random() * 2) + 1; // 1 to 2
        }

        const title = generateTitle(p.category, p.location.municipality);
        const description = generateDescription(p.category, p.location.municipality, beds);

        await Property.updateOne({ _id: p._id }, {
            $set: {
                title: title,
                fullDescription: description,
                bedrooms: beds,
                bathrooms: baths,
                bedCount: beds // Sync bed count with bedrooms for the tenant filter
            }
        });
    }

    console.log(`Successfully updated titles, descriptions, and room counts for ${properties.length} properties.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating properties:', error);
    process.exit(1);
  }
};

updatePropertiesData();
