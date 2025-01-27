const asyncHandler = require("express-async-handler");
const PanShopOrder = require('../../models/panshop/panShopOrderModel');
const PanShopOwner = require("../../models/panshop/panShopOwnerModel");
// const Stockist = require("../models/stockistModel");
const qrcode = require('qrcode'); // Add QR code generation
const fs = require('fs'); // Add file system module for file handling
 const mongoose = require("mongoose");

 function generateOtp() {
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  return otp.toString();  // Return OTP as a string
}

// Create a new Pan Shop Order
// const asyncHandler = require('express-async-handler'); // Ensure this is imported

const createPanShopOrder = asyncHandler(async (req, res) => {
  const { products, superStockistEmail, stockistEmail, panShopOwner_id, panShopOwnerName, panShopOwnerstate, panShopOwneraddress, status, deliveryTime, assignTo, otp } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Products array is required and cannot be empty" });
  }

  // Calculate total price
  const totalPrice = products.reduce((acc, product) => acc + product.quantity * product.price, 0);

  // Generate unique orderId
  const randomAlphabets = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  const randomNumbers = () => Math.floor(1000 + Math.random() * 9000);
  const orderId = `${randomAlphabets()}${randomNumbers()}`;

  try {
    // Create the order
    const order = await PanShopOrder.create({
      products,
      totalPrice,
      superStockistEmail,
      stockistEmail,
      panShopOwner_id,
      panShopOwnerName,
      panShopOwnerstate,
      panShopOwneraddress,
      status,
      deliveryTime,
      assignTo,
      otp,
      orderId, // Include generated orderId
    });

    res.status(201).json(order); // Return the created order
  } catch (error) {
    console.error("Error creating pan shop order:", error);
    res.status(500).json({ error: "Failed to create pan shop order" });
  }
});


// Get a Pan Shop Order by ID
const getPanShopOrderById = asyncHandler(async (req, res) => {
  const order = await PanShopOrder.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order detail not found");
  }
  res.status(200).json(order);
});

// Delete a Pan Shop Order by ID
const deletePanShopOrderById = asyncHandler(async (req, res) => {
  const order = await PanShopOrder.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order detail not found");
  }

  await order.deleteOne();

  res.status(200).json({ message: "Order deleted successfully" });
});

// Update Email, AssignTo, and Delivery Time for an Order
const assignedToorderStockitAndSuperStockit = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const existingOrder = await PanShopOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const {
      superStockistEmail,
      stockistEmail,
      status,superStockistStatus,stockistStatus
    } = req.body;

    // Update specific fields if they exist in the request body
    if (superStockistEmail) existingOrder.superStockistEmail = superStockistEmail;
    if (stockistEmail) existingOrder.stockistEmail = stockistEmail;
    if (status) existingOrder.status = status; // Update order status if provided
    if (superStockistStatus) existingOrder.superStockistStatus = superStockistStatus;
    if (stockistStatus) existingOrder.stockistStatus = stockistStatus; // Update stockist status if provided

    // Save the updated order
    const updatedOrder = await existingOrder.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating panShop order:", error);
    res.status(500).json({ error: "An error occurred while updating the panShop order" });
  }
});



const assignToOrderToDeliverBoy = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { deliverBoyId,deliveryTime,superStockistdeliveryTime, deliveryBoyOrderStatus } = req.body;

  try {
    // Check if the order exists
    const existingOrder = await PanShopOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure deliverBoyId is provided
    if (!deliverBoyId) {
      return res.status(400).json({ error: "Delivery boy ID is required" });
    }

    // Assign deliverBoyId and update order status
    existingOrder.deliveryBoyId = deliverBoyId;
    existingOrder.status = "confirmed";
    existingOrder.deliveryBoyOrderStatus = deliveryBoyOrderStatus;
    existingOrder.deliveryTime = deliveryTime; // Update delivery time if provided
    existingOrder.superStockistdeliveryBoyId = superStockistdeliveryTime;

    // Save the updated order
    const updatedOrder = await existingOrder.save();
    res.status(200).json({ message: "Order assigned to delivery boy successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating panShop order:", error);
    res.status(500).json({ error: "An error occurred while assigning the order" });
  }
});

// const assignToOrderToSuperStockistDeliverBoy = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { deliveryBoyId, deliveryTime, superStockistDeliveryBoyOrderStatus,superStockistdeliveryTime } = req.body;

//   try {
//     // Check if the order exists
//     const existingOrder = await PanShopOrder.findById(id);
//     if (!existingOrder) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     // Ensure deliverBoyId is provided
//     if (!deliveryBoyId) {
//       return res.status(400).json({ error: "Delivery boy ID is required" });
//     }

//     // Generate a 4-digit OTP
//     const stockistOtp = generateOtp();

//     // Assign deliverBoyId, update order status, and add OTP
//     existingOrder.superStockistdeliveryBoyId = deliveryBoyId;
//     existingOrder.superStockistdeliveryTime = superStockistdeliveryTime;
//     existingOrder.status = "confirmed";
//     existingOrder.deliveryTime = deliveryTime;
//     existingOrder.superStockistDeliveryBoyOrderStatus = superStockistDeliveryBoyOrderStatus;
//     existingOrder.stockistOtp = stockistOtp;  // Save the generated OTP

//     // Save the updated order
//     const updatedOrder = await existingOrder.save();
//     res.status(200).json({ message: "Order assigned to delivery boy successfully", order: updatedOrder });
//   } catch (error) {
//     console.error("Error updating panShop order:", error);
//     res.status(500).json({ error: "An error occurred while assigning the order" });
//   }
// });

// Helper function to generate a 4-digit OTP


// cancelled order

const cancelOrder = async (req, res) => {
  const { orderId } = req.params; // Get orderId from URL params

  try {
      // Find the order by ID and update the status to 'canceled'
      const order = await PanShopOrder.findByIdAndUpdate(
          orderId,
          { status: 'canceled' },
          { new: true } // This will return the updated document
      );

      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Send the updated order details as a response
      res.status(200).json({ message: 'Order canceled successfully', order });
  } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Get All Pan Shop Orders
const getPanShopOrder = asyncHandler(async (req, res) => {
  try {
    const orders = await PanShopOrder.find()
      // .populate({
      //   path: 'deliveryBoyId', // Populating deliveryBoyId
      // })
      // .populate({
      //   path: 'panShopOwner_id', // Populating panShopOwner_id
      //   select: '-qrCodeImage', // Excludes the qrCodeImage field
      // }).populate({
      //   path: 'superStockistdeliveryBoyId',
      // })

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Get Pan Shop Owner by ID with QR Code generation
const getPanShopOwnerById = asyncHandler(async (req, resp) => {
  const owner = await PanShopOwner.findById(req.params.id);

  if (!owner) {
    resp.status(404);
    throw new Error("PanShop Owner Not Found");
  }

  try {
    // Generate QR code data
    const qrData = `https://atticapanmasala-ecommerce.onrender.com/login/${owner._id}`;

    console.log(qrData);

    // Generate QR code image as a base64 string
    const qrCodeBase64 = await qrcode.toDataURL(qrData);

    // Send the pan shop owner details along with the QR code base64 data
    resp.status(200).json({ qrCode: qrCodeBase64, owner });
  } catch (error) {
    resp.status(500).json({ error: "Failed to generate QR code" });
  }
});


// Get All Order History by Pan Shop Owner ID
const getAllOrderHistroyByShopOwnerId = asyncHandler(async (req, resp) => {
  try {
    const id = req.params.id; // Retrieve the Shop Owner ID from request params

    // Check if the Pan Shop Owner exists
    const owner = await PanShopOwner.findById(id);

    if (!owner) {
      return resp.status(404).json({ message: "User Doesn't Exist" });
    }

    // Aggregate query to match orders with the Shop Owner ID
    const orders = await PanShopOrder.aggregate([
      {
        $match: {
          panShopOwner_id: new mongoose.Types.ObjectId(id), // Convert string ID to ObjectId
        },
      },
    ]);

    resp.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ success: false, message: "An error occurred while retrieving orders" });
  }
});



const updateAssignDeliveryTime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const existingOrder = await PanShopOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { assignTo, deliveryTime, status, ...updateData } = req.body;

    // Update specific fields if they exist in the request body
    if (assignTo) existingOrder.assignTo = assignTo;
    if (deliveryTime) existingOrder.deliveryTime = deliveryTime;
    if (status) existingOrder.status = status;

    // Loop through updateData to update any other fields
    for (let key in updateData) {
      existingOrder[key] = updateData[key];
    }

    // Save the updated order
    const updatedOrder = await existingOrder.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating panShop order:", error);
    res.status(500).json({ error: "An error occurred while updating the panShop order assignTo and DeliveyTime" });
  }
});

const matchOtp=asyncHandler(async(req,res)=>{
  try {
   const order=await PanShopOrder.findById(req.params.id)
   if (!order) {
     res.status(404);
     throw new Error(" order detail not found");
   }
    const {otp}=req.body;
    if(order.otp===otp){
     // res.status(200).json({message: "otp Match the data "})
     if(order.status==="confirmed"){
       order.status="delivered"
       order.save()
      // res.status(200).json(order)
     }
     res.status(200).json({order,message: "otp Match the data"})
    }
    else{
     res.status(404).json({message:"otp not match the data "})
    }
 
  } catch (error) {
   console.error("Error not geytting the order:", error);
     res.status(500).json({ error: "An error occurred while Getting the otp " });
   }
 })


 const getSuperStockistDeliveryBoy = asyncHandler(async (req, res) => {
  try {
    // Fetch orders based on superStockistdeliveryBoyId, excluding unwanted fields
    const orders = await PanShopOrder.find({
      superStockistdeliveryBoyId: req.params.id
    })
      .select('-panShopOwner_id -panShopOwnerName -panShopOwnerstate -panShopOwneraddress -status -otp'); // Exclude specific fields

    // Check if orders are found
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Fetch stockist details for each order based on `stockistEmail`
    const enhancedOrders = await Promise.all(
      orders.map(async order => {
        const stockistDetails = await Stockist.findOne({
          email: order.stockistEmail,
        }).select('-password  -confirmPassword');;

        return {
          ...order._doc,
          stockistDetails, // Include full stockist details in the response
        };
      })
    );

    // Return the enhanced response with stockist details
    return res.status(200).json(enhancedOrders);

  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
});


// const updateOrderStatusfromSuperStockistDeliveryBoy = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Validate the ID (ensure it's valid for MongoDB ObjectId)
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ error: "Invalid order ID format" });
//     }

//     const existingOrder = await PanShopOrder.findById(id);

//     if (!existingOrder) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     const { status, otp } = req.body;

//     // Ensure status is provided
//     if (!status) {
//       return res.status(400).json({ error: "Status field is required" });
//     }

//     // Ensure OTP is provided
//     if (!otp) {
//       return res.status(400).json({ error: "OTP is required" });
//     }

//     // Convert OTP from request body to a number for comparison
//     const otpAsNumber = Number(otp);

//     // Debugging logs
//     console.log("Received OTP:", otpAsNumber);
//     console.log("Stored OTP:", existingOrder.stockistOtp);

//     // Compare the OTP after type coercion
//     if (otpAsNumber !== existingOrder.stockistOtp) {
//       return res.status(400).json({ error: "Invalid OTP" });
//     }

//     // OTP matched; update the order status
//     existingOrder.superStockistdeliveryBoyOrderStatus = status;

//     // Save the updated order
//     const updatedOrder = await existingOrder.save();

//     res.status(200).json({
//       success: true,
//       message: "Order status updated successfully",
//       data: updatedOrder,
//     });
//   } catch (error) {
//     console.error("Error updating PanShop order:", error);
//     res.status(500).json({
//       success: false,
//       error: "An error occurred while updating the PanShop order",
//     });
//   }
// };


// const cancleOrderFromTheSuperStockistDeliveyBoy = async(req, res)=>{
//   const { id } = req.params;

//   try {
//     // Validate the ID (ensure it's valid for MongoDB ObjectId)
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ error: "Invalid order ID format" });
//     }

//     const existingOrder = await PanShopOrder.findById(id);
//     if (!existingOrder) {
//       return res.status(404).json({ error: "Order not found" });
//     }
//     const { status } = req.body;

//     // Ensure status is provided
//     if (!status) {
//       return res.status(400).json({ error: "Status field is required" });
//     }

//     // Cancelling the order
//     existingOrder.superStockistdeliveryBoyOrderStatus = status;

//     // Save the updated order
//     const updatedOrder = await existingOrder.save();
//     res.status(200).json({
//       success: true,
//       message: "Order status updated successfully",
//       data: updatedOrder,
//     });
    
//   } catch (error) {
//     console.error("Error updating PanShop order:", error);
//     res.status(500).json({
//       success: false,
//       error: "An error occurred while updating the PanShop order",
//     });
//   }


// }






module.exports = {
  createPanShopOrder,
  getPanShopOrderById,
  assignedToorderStockitAndSuperStockit,
  getPanShopOrder,
  deletePanShopOrderById,
  getPanShopOwnerById,
  getAllOrderHistroyByShopOwnerId,
  updateAssignDeliveryTime,
  matchOtp,
  assignToOrderToDeliverBoy,
  cancelOrder,
  // assignToOrderToSuperStockistDeliverBoy,
  getSuperStockistDeliveryBoy,
  // updateOrderStatusfromSuperStockistDeliveryBoy,
  // cancleOrderFromTheSuperStockistDeliveyBoy
  
 
};
