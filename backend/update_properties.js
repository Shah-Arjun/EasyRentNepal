require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/propertyModel');

const citiesList = [
  { province: "Koshi Pradesh", district: "Sunsari", municipality: "Itahari" },
  { province: "Koshi Pradesh", district: "Morang", municipality: "Biratnagar" },
  { province: "Koshi Pradesh", district: "Sunsari", municipality: "Dharan" },
  { province: "Bagmati Pradesh", district: "Kathmandu", municipality: "Kathmandu" },
  { province: "Gandaki Pradesh", district: "Kaski", municipality: "Pokhara" },
  { province: "Sudurpashchim Pradesh", district: "Kailali", municipality: "Dhangadhi" },
  { province: "Bagmati Pradesh", district: "Kavrepalanchok", municipality: "Dhulikhel" },
  { province: "Madhesh Pradesh", district: "Parsa", municipality: "Birgunj" },
];

const updateProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const properties = await Property.find();
    console.log(`Found ${properties.length} properties to update.`);

    for (let i = 0; i < properties.length; i++) {
        const p = properties[i];
        
        // Pick a random city from the valid list
        const randomCityInfo = citiesList[Math.floor(Math.random() * citiesList.length)];
        
        // Ensure proper location object structure
        p.location = {
            ...p.location,
            province: randomCityInfo.province,
            district: randomCityInfo.district,
            municipality: randomCityInfo.municipality,
            tole: "Central Area", 
            wardNo: Math.floor(Math.random() * 15) + 1
        };

        // Change the money value to something realistic depending on category
        let basePrice = 15000;
        if (p.category === 'Room') basePrice = 5000 + Math.floor(Math.random() * 5000);
        else if (p.category === 'Apartment' || p.category === 'Flat') basePrice = 15000 + Math.floor(Math.random() * 20000);
        else if (p.category === 'House' || p.category === 'Villa') basePrice = 30000 + Math.floor(Math.random() * 50000);

        p.price = {
            value: basePrice,
            currency: 'NPR',
            perUnit: 'per month'
        };

        // Randomize bedCount to match bedrooms just in case it is missing for filtering
        if (!p.bedCount && p.bedrooms) {
             p.bedCount = p.bedrooms;
        } else if (!p.bedCount) {
             p.bedCount = Math.floor(Math.random() * 3) + 1;
        }

        await Property.updateOne({ _id: p._id }, {
            $set: {
                location: p.location,
                price: p.price,
                bedCount: p.bedCount
            }
        });
    }

    console.log(`Successfully updated ${properties.length} properties with new locations and prices.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating properties:', error);
    process.exit(1);
  }
};

updateProperties();
