const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const { registerAgency, getMyAgency } = require("../controllers/agencyController");

const router = express.Router();

router.post('/', isAuthenticated, registerAgency);
router.get('/my-agency', isAuthenticated, getMyAgency);

module.exports = router;
