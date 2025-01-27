const asyncHandler = require("express-async-handler");
const DistributorOrder = require("../../models/Distributor/DistributorOrder.Model");
const mongoose = require("mongoose")

// Current User Information
const currentUser = asyncHandler(async (req, res) => {
  const { userExecutive } = req;

  if (!userExecutive) {
    res.status(401).json({ error: "User is not authenticated" });
    return;
  }

  res.status(200).json({
    username: userExecutive.username,
    email: userExecutive.email,
    id: userExecutive.id,
    message: "Current user information",
  });
});

// Get All Distributor Orders
const getDistributorOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await DistributorOrder.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching Distributor orders:", error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
});

// Get a Distributor Order by ID
const getDistributorOrder = asyncHandler(async (req, res) => {
  try {
    const order = await DistributorOrder.findById(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Authorization check
    if (order.user_id.toString() !== req.user.id) {
      res.status(403).json({ error: "User doesn't have permission to access this order" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching Distributor order:", error);
    res.status(500).json({ error: "An error occurred while fetching the order" });
  }
});

// Create a New Distributor Order
const createDistributorOrder = asyncHandler(async (req, res) => {
  const { products,status , date, time,  message ,DistributorMessage,superstockistEmail } = req.body;
   console.log(products ,status);
  if (!products  || !Array.isArray(products) || products.length === 0) {
    res.status(400).json({ error: "At least one product must be provided." });
    return;
  }

  const { userExecutive } = req;

  if (!userExecutive) {
    res.status(401).json({ error: "User is not authenticated." });
    return;
  }

  try {
    const newOrder = await DistributorOrder.create({
      products,
      status,
      date,
      time,
      message,
      DistributorMessage,
      supersistributorEmail,
      username: userExecutive.username,
      email: userExecutive.email,
      
    });
    console.log(newOrder);
    res.status(201).json({ message: "Distributor order created successfully.", order: newOrder });
  } catch (error) {
    console.error("Error creating Distributor order:", error);
    res.status(500).json({ error: "An error occurred while creating the Distributor order." });
  }
});






// Delete a Distributor Order


// Delete a Distributor order by ID
const deleteDistributorOrder = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ error: "Invalid order ID format." });
      return;
    }

    // Find the Distributor order by ID
    const order = await DistributorOrder.findById(orderId);

    await DistributorOrder.deleteOne({ _id: orderId });

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting Distributor order:", error);
    res.status(500).json({ error: "An error occurred while deleting the order." });
  }
});

const updateDistributorOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the provided order ID is a valid MongoDB object ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    
    const existingOrder = await DistributorOrder.findById(id);

    // Check if the Distributor order exists
    if (!existingOrder) {
      return res.status(404).json({ error: "Distributor order not found" });
    }

    const { date, time, message,DistributorMessage, ...updateData } = req.body;
    // console.log( date, time, message,DistributorMessage);

    // Update the Distributor order with the provided data including date, time, and message
    const updatedOrder = await DistributorOrder.findByIdAndUpdate(
      id,
      {
        ...updateData, // Update the existing fields
        date, // Add or update the date field
        time, // Add or update the time field
        message ,// Add or update the message field
        DistributorMessage
      },
      { new: true }
    );
  console.log(updatedOrder);

    // Return the updated Distributor order in the response
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating Distributor order:", error);
    res.status(500).json({ error: "An error occurred while updating the Distributor order" });
  }
});

const updateDistributorOrderPaticular = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the provided order ID is a valid MongoDB object ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  try {
    const existingOrder = await DistributorOrder.findById(id);

    // Check if the Distributor order exists
    if (!existingOrder) {
      return res.status(404).json({ error: "Distributor order not found" });
    }

    // Extract fields from the request body for partial update
    const { status, date, time, message,DistributorMessage, ...updateData } = req.body;
    // console.log(status, date, time, message,DistributorMessage);

    // Apply partial updates to the existing order
    if (status) existingOrder.status = status;
    if (date) existingOrder.date = date;
    if (time) existingOrder.time = time;
    if (message) existingOrder.message = message;
    if(DistributorMessage) existingOrder.DistributorMessage=DistributorMessage;
    // Update other fields as necessary
    for (let key in updateData) {
      existingOrder[key] = updateData[key];
    }

    // Save the updated order
    const updatedOrder = await existingOrder.save();

    // Return the updated Distributor order in the response
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating Distributor order:", error);
    res.status(500).json({ error: "An error occurred while updating the Distributor order" });
  }
});



module.exports = {
  getDistributorOrders,
  getDistributorOrder,
  createDistributorOrder,
  updateDistributorOrder,
  deleteDistributorOrder,
  currentUser,
updateDistributorOrderPaticular
 
};