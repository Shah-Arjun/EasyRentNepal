const express = require('express');
const axios = require('axios');
const router = express.Router();

const ML_API_URL = 'http://127.0.0.1:8000/predict';   //  FastAPI

router.post('/predict', async (req, res) => {
    try {
        const response = await axios.post(ML_API_URL, req.body);
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error("Prediction Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to get prediction",
            error: error.response?.data?.detail || error.message
        });
    }
});



module.exports = router;