const express = require("express");
const app = express();
require('dotenv').config();

//test api
app.get("/", (req, res) => {
  res.send("Hello, this is home page");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
