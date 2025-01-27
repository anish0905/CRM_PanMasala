const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDb = require("./src/config/dbConnection");

// Import Routes
const adminRoutes = require("./src/routes/adminRoutes");
const subAdminRoutes = require("./src/routes/subAdmin/subAdminRoutes");
const superStockistRoutes = require("./src/routes/superStockist/superStockist.Routes");

// Field Management Routes
const fieldManagerLogin = require("./src/routes/fieldManagement/fieldManagerRoute.routes");
const inspectionShopRoutes = require("./src/routes/fieldManagement/inspectionShopRoute.routes");
const fieldManagerLocation = require("./src/routes/fieldManagement/FieldManagerLocation.routes");
const showCaseRoute = require("./src/routes/fieldManagement/ShowCaseRoutes.routes");
const vendorNotInterested = require("./src/routes/fieldManagement/VendorNotIntrestedRoutes.routes");

// Attendance Routes
const attendanceRoute = require("./src/routes/Attendance/attendance.routes");

// E-commerce Routes
const productEcommRoutes = require("./src/routes/e-commerce/e-commerce.routes");

// CNF Routes
const cnfAgentRoutes = require("./src/routes/CNF_AgentRouter");

// Super Stockist Routes
const superStockistSignupRoutes = require("./src/routes/superStockist/superStockist.Routes");
const superStockistDeliveryBoyRoutes = require("./src/routes/superStockist/SuperStockistDeveliveyBoy.Routes");
const superStockistProductDetailsRoutes = require("./src/routes/superStockist/superStockistProductDetails.Routes");
const superStockistInventoryRoutes = require("./src/routes/superStockist/SuperStockistInvertory.Routes");


//Distributor variables
const DistributorOrderRoutes = require("./src/routes/Distributor/distributor.Routes");
const DistributorInventoryRoute = require("./src/routes/Distributor/DistributorInventory.Routes");
const DistributorRoutes = require("./src/routes/Distributor/Distributer.Routes");

// Connect to Database
connectDb();

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Admin Routes
app.use("/api/admin", adminRoutes);

// Sub-admin Routes
app.use("/api/subAdmin", subAdminRoutes);

// Super Stockist Routes
app.use("/api/superstockist", superStockistSignupRoutes);
app.use("/api/superstockist/deliveryBoy", superStockistDeliveryBoyRoutes);
app.use("/api/superstockist/productDetails", superStockistProductDetailsRoutes);
app.use("/api/superstockist/inventory", superStockistInventoryRoutes);

// Field Management Routes
app.use("/api/fieldManager", fieldManagerLogin);
app.use("/api/inspectionShop", inspectionShopRoutes);
app.use("/api/fieldManagerLocation", fieldManagerLocation);
app.use("/api/showCase", showCaseRoute);
app.use("/api/vendorNotInterested", vendorNotInterested);

// Attendance Routes
app.use("/api/attendance", attendanceRoute);

// E-commerce Routes
app.use("/api/e-commerce", productEcommRoutes);

// CNF Agent Routes
app.use("/api/cnfAgent", cnfAgentRoutes);

// Distributor Routes
app.use("/api/Distributor/order", DistributorOrderRoutes);
app.use("/api/Distributorinventory", DistributorInventoryRoute);
app.use("/api/DistributorRoutes", DistributorRoutes);

// Fallback Route for Undefined Endpoints
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start Server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
