const Order = require('../../models/Order/OrderModel');
const Distributor = require('../../models/Distributor/Distributor.Model'); // Assuming you have a Distributor model

/**
 * Create a New Order
 */
exports.createOrder = async (req, res) => {
    try {
        const { userId, products, shippingAddress } = req.body;

        if (!userId || !products || !shippingAddress) {
            return res.status(400).json({ message: "User ID, products, and shipping address are required" });
        }

        const totalPrice = products.reduce((total, item) => total + item.price * item.quantity, 0);

        // Find nearest distributor based on shipping address coordinates
        const nearestDistributor = await Distributor.findOne({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: shippingAddress.location.coordinates },
                    $maxDistance: 50000 // 50km range
                }
            }
        });

        const newOrder = new Order({
            userId,
            products,
            shippingAddress,
            totalPrice,
            distributorId: nearestDistributor ? nearestDistributor._id : null,
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
};

/**
 * Get Orders by User ID
 */
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId }).populate("products.productId").populate("distributorId");
        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error });
    }
};

/**
 * Get Order by Order ID
 */
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({ orderId }).populate("products.productId").populate("distributorId");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order", error });
    }
};

/**
 * Update Order Status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["pending", "processing", "confirmed", "delivered", "canceled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error });
    }
};

/**
 * Delete an Order
 */
exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOneAndDelete({ orderId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
};

/**
 * Find Nearest Distributor
 */
exports.findNearestDistributor = async (req, res) => {
    try {
        const { longitude, latitude } = req.query;

        if (!longitude || !latitude) {
            return res.status(400).json({ message: "Longitude and latitude are required"} );
        }

        const nearestDistributor = await Distributor.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)], // Convert string to number
                    },
                    $maxDistance: 50000, // 50km range
                }
            }
        });

        if (!nearestDistributor) {
            return res.status(404).json({ message: "No distributor found nearby" });
        }

        res.status(200).json({ message: "Nearest distributor found", distributor: nearestDistributor });
    } catch (error) {
        res.status(500).json({ message: "Error finding nearest distributor", error });
    }
};