require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/propertyModel');
const User = require('./models/userModel');

const seedProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Find or create an owner user
    let user = await User.findOne({ role: 'owner' });
    if (!user) {
      user = await User.create({
        name: 'Demo Owner',
        email: 'demoowner@example.com',
        password: 'password123',
        role: 'owner',
        verified: true,
      });
      console.log('Created demo owner');
    }

    const ownerId = user._id;

    const properties = [
      {
        title: "Cozy 2-Bedroom Apartment in Kathmandu",
        category: "Apartment",
        listingType: "Rent",
        noOfFlat: 1,
        bedrooms: 2,
        bathrooms: 1,
        bathroomType: "attached",
        bedCount: 2,
        living: 1,
        kitchen: 1,
        furnishedStatus: "semi-furnished",
        price: { value: 25000, currency: "NPR", perUnit: "per month" },
        location: {
          province: "Bagmati Pradesh",
          district: "Kathmandu",
          municipality: "Kathmandu",
          tole: "Baneshwor",
          wardNo: 10
        },
        fullDescription: "A beautiful 2-bedroom apartment located in the heart of Kathmandu. Perfect for a small family or 2 tenants. Close to all amenities.",
        images: [{ url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", isPrimary: true }],
        owner: ownerId,
        status: "Available",
      },
      {
        title: "Spacious Family House in Pokhara",
        category: "House",
        listingType: "Rent",
        bedrooms: 4,
        bathrooms: 3,
        bathroomType: "attached",
        bedCount: 4,
        living: 2,
        kitchen: 1,
        furnishedStatus: "fully-furnished",
        price: { value: 45000, currency: "NPR", perUnit: "per month" },
        location: {
          province: "Gandaki Pradesh",
          district: "Kaski",
          municipality: "Pokhara",
          tole: "Lakeside",
          wardNo: 6
        },
        fullDescription: "Large fully furnished house near the lake with beautiful mountain views. Perfect for large families.",
        images: [{ url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg", isPrimary: true }],
        owner: ownerId,
        status: "Available",
      },
      {
        title: "Affordable Single Room in Lalitpur",
        category: "Room",
        listingType: "Rent",
        bedrooms: 1,
        bathrooms: 1,
        bathroomType: "shared",
        bedCount: 1,
        living: 0,
        kitchen: 0,
        furnishedStatus: "unfurnished",
        price: { value: 8000, currency: "NPR", perUnit: "per month" },
        location: {
          province: "Bagmati Pradesh",
          district: "Lalitpur",
          municipality: "Lalitpur",
          tole: "Patan",
          wardNo: 3
        },
        fullDescription: "Clean and affordable single room for students or single professionals. Includes access to shared bathroom.",
        images: [{ url: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg", isPrimary: true }],
        owner: ownerId,
        status: "Available",
      }
    ];

    // Delete existing dummy properties if running multiple times (optional)
    await Property.deleteMany({ 'location.district': { $in: ['Kathmandu', 'Kaski', 'Lalitpur'] }, status: "Available" });

    // Ensure slug generation by triggering the model's pre-save hook (if any) or manually generating
    // The controller uses `generateSlug` which isn't in the model schema, so we'll just add a simple slug
    const propertiesWithSlugs = properties.map(p => ({
      ...p,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4)
    }));

    await Property.insertMany(propertiesWithSlugs);
    console.log(`Successfully added ${propertiesWithSlugs.length} sample properties.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }
};

seedProperties();
