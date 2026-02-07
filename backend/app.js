const express = require("express");
const app = express();
require('dotenv').config();
const connectMongoDB = require("./database/db")
//routes import
const propertyRoutes = require("./routes/property/propertyRoutes")




// middleware
app.use(express.json())         //helps express to understand/parse JSON
app.use(express.urlencoded({extended: true}))     //handles data from frontend but doesnot handle file, we need multer for file



//calling mongoDB connection function
connectMongoDB();


//test api
app.get("/", (req, res) => {
  res.send("Hello, this is home page");
});



app.use("/api/property", propertyRoutes)



const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
