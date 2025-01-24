const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./src/config/dbConnection");
const adminRoutes = require("./src/routes/adminRoutes");
const subAdminRoutes = require("./src/routes/subAdmin/subAdminRoutes");
const superStockist = require("./src/routes/superStockist/superStockistRoutes");

connectDb();
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5001;

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Admin  routes

app.use("/api/admin", adminRoutes);

//subadmin routes

app.use("/api/subAdmin", subAdminRoutes);
app.use("/api/superstockist", superStockist);
