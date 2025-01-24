const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./src/config/dbConnection");
const adminRoutes = require("./src/routes/adminRoutes");

connectDb();
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5001;

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Importing routes


app.use("/api/admin", adminRoutes);
