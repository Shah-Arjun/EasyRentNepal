const express = require("express");
const app = express();

//test api
app.get("/", (req, res) => {
  res.send("Hello, this is home page");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
