const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDb = require("./src/config/dbConnection");
const adminRoutes = require("./src/routes/adminRoutes");
const subAdminRoutes = require("./src/routes/subAdmin/subAdminRoutes");
const superStockist = require("./src/routes/superStockist/superStockistRoutes");

// Field Management Variables
const fieldManagerLogin = require("./src/routes/fieldManagement/fieldManagerRoute.router");
const inspectionShopRoutes = require("./src/routes/fieldManagement/inspectionShopRoute.router");
const fieldManagerLocation = require("./src/routes/fieldManagement/FieldManagerLocation.router");
const showCaseRoute = require("./src/routes/fieldManagement/ShowCaseRoutes.router");
const vendorNotInterested = require("./src/routes/fieldManagement/VendorNotIntrestedRoutes.router");

// Attendance Variables
const attendanceRoute = require("./src/routes/Attendance/attendance.router");

// E-commerce Variables
const productEcomm = require("./src/routes/e-commerce/e-commerce.router");

const CNF_AgentRoute = require("./src/routes/CNF_AgentRouter");

// Connect to the database
connectDb();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON payloads

// Field Management Routes
app.use("/api/fieldManager", fieldManagerLogin);
app.use("/api/inspectionShop", inspectionShopRoutes);
app.use("/api/fieldManagerLocation", fieldManagerLocation); 
app.use("/api/showCase", showCaseRoute);
app.use("/api/vendornotIntrested", vendorNotInterested); 

// Attendance Routes
app.use("/api/attendance", attendanceRoute);

// E-commerce Routes

app.use("/api/e-commerce_product", productEcomm); 

// Admin Routes
app.use("/api/admin", adminRoutes);

// CNF_Agents Routes
app.use("/api/CNF_Agent", CNF_AgentRoute);



// Server Listening
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Admin  routes

app.use("/api/admin", adminRoutes);

//subadmin routes

app.use("/api/subAdmin", subAdminRoutes);
app.use("/api/superstockist", superStockist);
