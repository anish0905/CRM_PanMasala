const SubAdminInventory = require('../../models/Inventory/SubAdminInventoryModel');
const mongoose = require('mongoose');
const Message = require("../../models/messageModel");
const subAdmin = require("../../models/subAdmin/subAdminModels");

// Add Inventory




exports.addInventory = async (req, res) => {
    try {
        const { userId, products, revisedBy } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required' });
        }

        let inventory = await SubAdminInventory.findOne({ userId });

        if (!inventory) {
            inventory = new SubAdminInventory({
                userId,
                initialStock: 0,
                remainingStock: 0,
                products: [],
                revisedStockHistory: [],
                dispatchedStockHistory: []
            });
        }

        let revisedDate = new Date();

        products.forEach(({ productId, productName, quantity }) => {
            let qty = Number(quantity);
            if (qty <= 0) {
                return res.status(400).json({ message: 'Quantity must be greater than zero' });
            }

            let existingProduct = inventory.products.find(p => p.productId.toString() === productId);
            let previousStock = existingProduct ? existingProduct.quantity : 0;

            if (existingProduct) {
                existingProduct.quantity += qty;
            } else {
                inventory.products.push({ productId, productName, quantity: qty });
            }

            inventory.remainingStock += qty;

            inventory.revisedStockHistory.push({
                revisedBy,
                revisedDate,
                products: [{
                    productId,
                    productName,
                    previousStock,
                    newStock: previousStock + qty,
                    quantityAdded: qty
                }]
            });
        });

        await inventory.save();
        res.status(200).json({ message: 'Inventory updated successfully with revision history' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating inventory', error });
    }
};




// Dispatch Inventory
exports.dispatchStock = async (req, res) => {
    try {
        const { userId, issuedTo, issuedBy, products, otp, orderId, receivedDate } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required' });
        }

        let inventory = await SubAdminInventory.findOne({ userId });

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        let transactionDate = new Date();
        let dispatchedProducts = [];

        for (let { productId, productName, quantity } of products) {
            let qty = Number(quantity);
            if (qty <= 0) {
                return res.status(400).json({ message: 'Quantity must be greater than zero' });
            }

            let existingProduct = inventory.products.find(p => p.productId.toString() === productId);
            if (!existingProduct || existingProduct.quantity < qty) {
                return res.status(400).json({ message: `Insufficient stock for product: ${productName}` });
            }

            existingProduct.quantity -= qty;
            inventory.remainingStock -= qty;
            inventory.dispatchedStock += qty;

            dispatchedProducts.push({
                receivedDate,
                productId,
                productName,
                quantityDispatched: qty
            });
        }

        inventory.dispatchedStockHistory.push({
            issuedTo,
            issuedBy,
            transactionDate,
            products: dispatchedProducts,
            status: 'dispatched',
            otp,
            orderId,
            receivedDate
        });

        await inventory.save();

        // Fetch sender details correctly
        const UserDetails = await subAdmin.findById(issuedBy);  // Fixed method name

        if (!UserDetails) {
            return res.status(404).json({ message: 'Issued by user not found' });
        }

        // Send notification with corrected parameters
        await sendNotification(
            issuedBy,
            UserDetails.username,  // Correct sender name
            issuedTo,
            `📦 Stock Dispatched  
            Dispatched Products: 
            ${dispatchedProducts.map(p => `🔹 ${p.productName}: ${p.quantityDispatched}`).join('\n')}  
            
            📅 Received Date: ${new Date(receivedDate).toLocaleString()}  
            🆔 Order ID: ${orderId}  
            🔢 OTP (For Receiving Order): ${otp}  
          
            ⚠️ Note: Please share this OTP only at the time of receiving the order for verification.`
        );

        res.status(200).json({ message: 'Stock dispatched successfully with transaction history' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error dispatching stock', error });
    }
};

// Fix sendNotification function
const sendNotification = async (senderId, senderName, recipient, content) => {
    try {
        const message = new Message({
            sender: senderId,
            senderName: senderName,
            subject:"inventory",
            recipient: recipient,
            content: { text: content }  // Correct way to structure the content object
        });
        await message.save(); // Ensure it's saved properly
        console.log("Notification sent successfully");
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};






exports.getInventoryByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const inventory = await SubAdminInventory.findOne({ userId })
            .populate("products.productId")  // Populate productId inside products array
            .populate({
                path: 'revisedStockHistory.revisedBy',  // Populate revisedBy inside revisedStockHistory
                model: 'admin'  // Ensure it references the correct model
            })
            .populate({
                path: 'dispatchedStockHistory.issuedTo',  // Populate revisedBy inside revisedStockHistory
                model: 'CNFAgent'  // Ensure it references the correct model
            })
            .populate({
                path: 'dispatchedStockHistory.issuedBy',  // Populate issuedBy inside dispatchedStockHistory
                model: 'subAdmin'  // Ensure it references the correct model
            });

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.status(200).json({ data: inventory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching inventory', error });
    }
};

exports.getAllInventory = async (req, res) => {
    try {
        const inventories = await SubAdminInventory.find()
           .populate("products.productId")  // Populate productId inside products array
           .populate({
                path: 'dispatchedStockHistory.issuedBy',  // Populate issuedBy inside dispatchedStockHistory
                model: 'CNFAgent'  // Ensure it references the correct model
            })
           .populate({
                path: 'revisedStockHistory.revisedBy',  // Populate revisedBy inside dispatchedStockHistory
                model: 'admin'  // Ensure it references the correct model
            });
            
        res.status(200).json({ data: inventories });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching inventory', error });
    }
}


