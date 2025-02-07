const CNFInventory = require('../../models/Inventory/CNFInventoryModel')
const Message = require("../../models/messageModel");
const CNFAgent = require('../../models/CNF_Agent.Model');
const SubAdminInventory = require('../../models/Inventory/SubAdminInventoryModel');

exports.addInventory = async (req, res, next) => {
    try {
        const { userId, revisedDate, orderId } = req.body;

        // Validate input
        if (!userId || !orderId) {
            return res.status(400).json({ message: 'User ID and Order ID are required' });
        }

        // Find the dispatched stock history from SubAdminInventory
        const verification = await SubAdminInventory.findOne({
            "dispatchedStockHistory": {
                $elemMatch: { issuedTo: userId, orderId: orderId }
            }
        });

        if (!verification) {
            return res.status(400).json({ message: 'Invalid User ID or Order ID' });
        }

        const matchedHistory = verification.dispatchedStockHistory.find(
            history => history.orderId === orderId && history.issuedTo.toString() === userId
        );

        if (!matchedHistory) {
            return res.status(400).json({ message: 'No matching dispatched stock history found' });
        }

        const revisedBy = matchedHistory.issuedBy;
        const dispatchedProducts = matchedHistory.products;
        

        let cnfInventory = await CNFInventory.findOne({ userId });

        // If CNF Inventory does not exist, create a new record
        if (!cnfInventory) {
            cnfInventory = new CNFInventory({
                userId,
                initialStock: 0,
                remainingStock: 0,
                dispatchedStockHistory: [],
                products: [],
                revisedStockHistory: [],
            });
        }

        // **Check if orderId already exists in revisedStockHistory**
        const existingOrder = cnfInventory.revisedStockHistory.find(history => history.orderId === orderId);
        if (existingOrder) {
            return res.status(400).json({ message: 'Order ID already exists. Inventory update not allowed.' });
        }

        const updateDate = new Date();
        let totalAddedStock = 0;

        // Process dispatched products
        const productUpdates = dispatchedProducts.map(({ productId, quantityDispatched }) => {
            let qty = Number(quantityDispatched);

            if (qty <= 0) {
                throw new Error(`Quantity for product ${productId} must be greater than zero`);
            }

            // Check if product already exists in inventory
            let existingProduct = cnfInventory.products.find(p => p.productId.toString() === productId.toString());
            let previousStock = existingProduct ? existingProduct.quantity : 0;

            if (existingProduct) {
                // If product exists, update quantity
                existingProduct.quantity += qty;
            } else {
                // If product does not exist, add as new
                cnfInventory.products.push({ productId, quantity: qty });
            }

            totalAddedStock += qty;

            return {
                productId,
                previousStock,
                newStock: previousStock + qty,
                quantityAdded: qty
            };
        });

        // Update remaining stock
        cnfInventory.remainingStock += totalAddedStock;

        // Add revision history
        cnfInventory.revisedStockHistory.push({
            revisedBy,
            revisedDate,
            orderId,
            updateDate,
            products: productUpdates
        });

        // Save inventory
        await cnfInventory.save();
        res.status(200).json({ message: 'Inventory updated successfully with revision history' });
    } catch (error) {
        console.error("Error adding inventory:", error);
        return res.status(500).json({ message: "Failed to add inventory", error: error.message });
    }
};







exports.dispatchStock = async (req, res) => {
    try {
        const { userId, issuedTo, issuedBy, products, otp, orderId, receivedDate } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required' });
        }

        let inventory = await CNFInventory.findOne({ userId });

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
        const UserDetails = await CNFAgent.findById(issuedBy);  // Fixed method name

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



const sendNotification = async (senderId, senderName, recipient, content) => {
    try {
        const message = new Message({
            sender: senderId,
            senderName: senderName,
            recipient: recipient,
            subject:"inventory",
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

        const inventory = await CNFInventory.findOne({ userId })
            .populate("products.productId")  // Populate productId inside products array
            .populate({
                path: 'revisedStockHistory.revisedBy',  
              
            })
            .populate({
                path: 'dispatchedStockHistory.issuedTo',  
               
            })
            .populate({
                path: 'dispatchedStockHistory.issuedBy',  
               
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