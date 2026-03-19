require('dotenv').config();   // ⚠️ Must be FIRST - loads .env before any other module reads env vars
const express = require("express");
const cors = require("cors");
// @clerk/express clerkMiddleware removed - auth is now handled in isAuthenticated.js
const app = express();
const connectMongoDB = require("./database/db")

//routes import
const propertyRoutes = require("./routes/property/propertyRoutes")
const authRoutes = require("./routes/auth/authRoutes")
const wishlistRoutes = require("./routes/tenant/wishlistRoutes")
const profileRoutes = require("./routes/profile/profileRoutes")
const reviewsRoutes = require("./routes/tenant/reviewsRoutes")




// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))         //helps express to understand/parse JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' }))     //handles data from frontend but doesnot handle file, we need multer for file
// Clerk authentication is now handled per-route in isAuthenticated.js middleware




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



const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
