require("dotenv").config();
const connectMongoDB = require("./database/db");
const Property = require("./models/propertyModel");

const updateProperties = async () => {
  try {
    const properties = await Property.find().sort({ createdAt: 1 });

    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];

      // only update if propertyId is missing
      if (!prop.propertyId) {
        prop.propertyId = "OLD-" + String(i + 1).padStart(3, "0");
        await prop.save();
      }
    }

    console.log("✅ All properties updated successfully");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error updating properties:", err);
    process.exit(1);
  }
};



connectMongoDB()
  .then(() => {
    console.log("Connected to MongoDB");
    updateProperties();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });