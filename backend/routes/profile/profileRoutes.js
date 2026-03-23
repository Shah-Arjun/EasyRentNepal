// const { getMyProfile, updateMyProfile, deleteMyProfile } = require('../../controllers/profile/profileController')
const isAuthenticated = require('../../middleware/isAuthenticated')
// const catchAsync = require('../../services/catchAsync')


// const router = require('express').Router()


// router.route('/')
//     .get(isAuthenticated, catchAsync(getMyProfile))
//     .patch(isAuthenticated, catchAsync(updateMyProfile))
//     .delete(isAuthenticated, catchAsync(deleteMyProfile))


// module.exports = router



const express = require('express');
const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
  res.json({
    message: "User profile fetched",
    user: req.user,
  });
});

module.exports = router;