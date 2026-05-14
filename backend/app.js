const express = require("express");
const cors = require("cors");
const app = express();
const connectMongoDB = require("./database/db")
const cookieParser = require('cookie-parser');
require('dotenv').config(); 


//routes import
const propertyRoutes = require("./routes/property/propertyRoutes")
const authRoutes = require("./routes/auth/authRoutes")
const wishlistRoutes = require("./routes/tenant/wishlistRoutes")
const profileRoutes = require("./routes/profile/profileRoutes")
const reviewsRoutes = require("./routes/tenant/reviewsRoutes")
const tenantDashboardRoutes = require("./routes/tenant/dashboardRoutes")
const agencyRoutes = require("./routes/agencyRoute")
const predictionRoutes = require('./routes/prediction');
const bookingRoutes = require('./routes/booking/bookingRoutes');




// middleware
app.use(cors({
  origin: [
    "https://easy-rent-nepal.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json({ limit: '100mb' }))         //helps express to understand/parse JSON
app.use(express.urlencoded({ extended: true, limit: '100mb' }))     //handles data from frontend but doesnot handle file, we need multer for file
app.use(cookieParser());




//calling mongoDB connection function
connectMongoDB();


//test api
app.get("/", (req, res) => {
  res.send("Hello, this is home page");
});



//APIs
app.use("/api/auth", authRoutes)
app.use("/api/property", propertyRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/reviews", reviewsRoutes)
app.use("/api/tenant", tenantDashboardRoutes)
app.use("/api/agency", agencyRoutes)
app.use("/api/prediction", predictionRoutes)
app.use("/api/bookings", bookingRoutes)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
