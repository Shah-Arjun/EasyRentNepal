const {
  addProperty,
  getProperties,
  getSingleProperty,
  getOwnerProperties,
  deleteProperty,
  getOwnerDashboardData,
  updatePropertyStatus,
  editProperty,
} = require("../../controllers/property/propertyController");
const catchAsync = require("../../services/catchAsync");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");
const upload = require("../../middleware/upload");
const multer = require("multer");
const {
  getSimilarRecommendProperties,
  getRecommendPropertiesBySearchTerm,
} = require("../../controllers/property/recommendController");

const router = require("express").Router();

// property routes endpoints
router.route("/").get(catchAsync(getProperties));


router.post("/addProperty", isAuthenticated, restrictTo("owner"), upload.array("images", 5), catchAsync(addProperty),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE:
          "Each image must be under 5 MB. Please reduce the file size and try again.",
        LIMIT_FILE_COUNT: "You can upload a maximum of 5 images.",
        LIMIT_UNEXPECTED_FILE: "Unexpected field name for file upload.",
      };
      return res.status(400).json({
        success: false,
        message: messages[err.code] || `Upload error: ${err.message}`,
      });
    }
    // Pass non-Multer errors to Express default handler
    next(err);
  },
);

router
  .route("/owner")
  .get(isAuthenticated, restrictTo("owner"), catchAsync(getOwnerProperties));

router
  .route("/owner-dashboard")
  .get(isAuthenticated, restrictTo("owner"), catchAsync(getOwnerDashboardData));
  
router.route("/search").get(catchAsync(getRecommendPropertiesBySearchTerm));
router.route("/recommend/:id").get(catchAsync(getSimilarRecommendProperties));

router
  .route("/:id")
  .get(catchAsync(getSingleProperty))
  .delete(isAuthenticated, restrictTo("owner"), catchAsync(deleteProperty))
  .patch(isAuthenticated, restrictTo("owner"), catchAsync(updatePropertyStatus))
  .put(isAuthenticated, restrictTo("owner"), upload.array("images", 5), catchAsync(editProperty),
    (err, req, res, next) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
      }
      next(err);
    },
  );



module.exports = router;
