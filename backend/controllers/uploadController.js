// const Image = require("../models/imageModel");
// const uploadToCloudinary = require("../utils/uploadToCloudinary");

// const createProperty = async (req, res) => {
//   try {
//     const { title } = req.body;
//     const files = req.files;

//     if (!files || files.length === 0) {
//       return res.status(400).json({ message: "No images uploaded" });
//     }

//     if (files.length > 5) {
//       return res.status(400).json({ message: "Max 5 images allowed" });
//     }

//     // Upload all images
//     const uploadPromises = files.map((file) =>
//       uploadToCloudinary(file.buffer, "house-rental-properties")
//     );

//     const uploadedImages = await Promise.all(uploadPromises);



//     const property = await Image.create({
//       title,
//       images: uploadedImages,
//     });



//     res.status(201).json(property);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { createProperty };