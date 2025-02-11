const DistributoryInventory = require('../../models/Inventory/DistributorInventory')
const Message = require("../../models/messageModel");
const Distributor = require('../../models/Distributor/Distributor.Model');
const SuperStockistInventory = require('../../models/Inventory/superStockistInventory');


exports.addInventory = async (req, res) => {
    try {
        const { userId, revisedDate, orderId } = req.body;

        if (!userId || !orderId) {
            return res.status(400).json({ message: 'User ID and Order ID are required' });
        }

        // Find dispatched stock history from SuperStockistInventory
        const verification = await SuperStockistInventory.findOne({
            "dispatchedStockHistory": { $elemMatch: { issuedTo: userId, orderId: orderId } }
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

        let DistributoryInventoryData = await DistributoryInventory.findOne({ userId });

        if (!DistributoryInventoryData) {
            DistributoryInventoryData = new DistributoryInventory({
                userId,
                initialStock: 0,
                remainingStock: 0,
                dispatchedStockHistory: [],
                products: [],
                revisedStockHistory: [],
            });
        }

        // Check if orderId already exists in revisedStockHistory
        const existingOrder = DistributoryInventoryData.revisedStockHistory.find(
            history => history.orderId === orderId
        );
        if (existingOrder) {
            return res.status(400).json({ message: 'Order ID already exists. Inventory update not allowed.' });
        }

        let totalAddedStock = 0;
        const productUpdates = dispatchedProducts.map(({ productId, quantityDispatched }) => {
            let qty = Number(quantityDispatched);
            if (qty <= 0) {
                throw new Error(`Quantity for product ${productId} must be greater than zero`);
            }

            let existingProduct = DistributoryInventoryData.products.find(
                p => p.productId.toString() === productId.toString()
            );
            let previousStock = existingProduct ? existingProduct.quantity : 0;

            if (existingProduct) {
                existingProduct.quantity += qty;
            } else {
                DistributoryInventoryData.products.push({ productId, quantity: qty });
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
        DistributoryInventoryData.remainingStock += totalAddedStock;

        // Add revision history
        DistributoryInventoryData.revisedStockHistory.push({
            revisedBy,
            revisedDate,
            orderId,
            updateDate: new Date(),
            products: productUpdates
        });

        await DistributoryInventoryData.save();
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

        let inventory = await DistributoryInventory.findOne({ userId });

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
        const UserDetails = await Distributor.findById(issuedBy);  // Fixed method name

        if (!UserDetails) {
            return res.status(404).json({ message: 'Issued by user not found' });
        }

        // Send notification with corrected parameters
        await sendNotification(
            issuedBy,
            UserDetails.username,  // Correct sender name
            issuedTo,
            "inventory"
            ` 
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



const sendNotification = async (senderId, senderName, recipient,subject, content) => {
    console.log(content)
    try {
        const message = new Message({
            sender: senderId,
            senderName: senderName,
            recipient: recipient,
            subject: subject,
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

        const inventory = await DistributoryInventory.findOne({ userId })
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


exports.sendRequiredForInventory = async (req, res) => {
    try {
        const { inventoryItems, requestMessage, recipient
            , deadline, sender } = req.body;

        // Validate inventory items
        if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) {
            return res.status(400).json({ message: 'Inventory items array is required' });
        }

        // Validate sender and recipient
        if (!sender || !recipient) {
            return res.status(400).json({ message: 'Sender and recipient are required' });
        }

        // Validate deadline
        if (!deadline) {
            return res.status(400).json({ message: 'Deadline is required' });
        }

        // Get sender's name asynchronously
        const Sendername = await Distributor.findById(sender);
        if (!Sendername) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        // Ensure deadline is a valid date
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate)) {
            return res.status(400).json({ message: 'Invalid deadline date' });
        }

        // Send notification
        sendNotification(
            sender,
            Sendername.username,
            recipient,

            "Inventory Required",
            ` 
            ${inventoryItems.map(p => `🛍️ ${p.productName}: ${p.quantity}`).join('\n')}  
            
            📅 Deadline Date: ${deadlineDate.toLocaleString()}  
            📝 Request Message: ${requestMessage}`
        );

        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending notification', error });
    }
};


exports.getSuperInventoryBySuperstockistId = async (req, res) => {
    try {
        const { superstockistId } = req.params;

        // Validate if the SuperstockistId is provided and is valid
        if (!superstockistId || superstockistId.trim() === '') {
            return res.status(400).json({ message: 'SuperstockistId is required' });
        }

        // Fetch distributors based on the SuperstockistId
        const SuperstockistDistributor = await Distributor.find({ superstockist: superstockistId });

        // Check if no distributors are found for the provided superstockistId
        if (!SuperstockistDistributor || SuperstockistDistributor.length === 0) {
            return res.status(404).json({ message: 'No distributors found for this SuperstockistId' });
        }

        // Map over distributors to fetch their inventory
        const superstockistData = await Promise.all(SuperstockistDistributor.map(async (superstockist) => {
            // Fetch the inventory for each distributor
            const superstockistInventory = await DistributoryInventory.find({
                userId: superstockist._id
            })
                .populate('products.productId') // Populate product details
                .populate({
                    path: 'userId', // Populate user details
                    select: 'username mobileNo state district' // Only select necessary fields for the user
                });

            // Return a structured response even if inventory is not found
            return {
                distributoryId: superstockist._id,
                distributoryName: superstockist.username,
                state: superstockist.state,
                district: superstockist.district,
                mobileNo: superstockist.mobileNo,
                inventory: superstockistInventory.length ? superstockistInventory.map(inventory => ({
                    productId: inventory.products.map(product => ({
                        productName: product.productId.title,
                        quantity: product.quantity,
                    }))
                })) : [] // If no inventory, return empty array
            };
        }));

        // Return the superstockist data with their inventory
        return res.status(200).json(superstockistData);

    } catch (error) {
        // Log the error and return a 500 status code
        console.error('Error fetching superstockist inventory:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};







