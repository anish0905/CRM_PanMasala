const CNFInventory = require('../../models/Inventory/CNFInventoryModel')
const Message = require("../../models/messageModel");
const CNFAgent = require('../../models/CNF_Agent.Model');
const SubAdminInventory = require('../../models/Inventory/SubAdminInventoryModel');

exports.addInventory = async(req, res, next) => {
    try{
        const {userId, products, revisedBy , revisedDate, orderId } = req.body;
        
        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({message: 'Products array is required'})
        }

        let verificationOrderId = await SubAdminInventory.findOne({ "dispatchedStockHistory.orderId": orderId , "dispatchedStockHistory.issuedTo":userId});

        if(!verificationOrderId){
            return res.status(400).json({message: 'Invalid Order Id'})
        }
        
        let cnfInventory = await CNFInventory.findOne({userId});

        if(!cnfInventory){
            cnfInventory = new CNFInventory({
                userId,
                initialStock: 0,
                remainingStock: 0,
                dispatchedStockHistory: [],
                products: [],
                revisedStockHistory: [],
                dispatchedStockHistory: [],

            });
        }
  
        let updateDate = new Date();


        products.forEach(({productId,productName, quantity}) => {
            let qty = Number(quantity);
            if(qty <= 0){
                return res.status(400).json({message: 'Quantity must be greater than zero'})
            }
            
            let existingProduct = cnfInventory.products.find(p => p.productId.toString() === productId);
            let previousStock = existingProduct? existingProduct.quantity : 0;
            
            if(existingProduct){
                existingProduct.quantity += qty;
            }else{
                cnfInventory.products.push({productId, productName, quantity: qty });
            }
            
            cnfInventory.remainingStock += qty;


            cnfInventory.dispatchedStockHistory.push({
                revisedBy,
                revisedDate,
                orderId,
                updateDate,
                products: [{
                    productId,
                    productName,
                    previousStock,
                    newStock: previousStock + qty,
                    quantityAdded: qty
                }]
            });

        }); 

            await cnfInventory.save();
            res.status(200).json({ message: 'Inventory updated successfully with revision history' });


    }catch{
        return res.status(500).json({message: "Failed to add inventory"})
    }
}


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
                path: 'revisedStockHistory.revisedBy',  // Populate revisedBy inside revisedStockHistory
              
            })
            .populate({
                path: 'dispatchedStockHistory.issuedTo',  // Populate revisedBy inside revisedStockHistory
               
            })
            .populate({
                path: 'dispatchedStockHistory.issuedBy',  // Populate issuedBy inside dispatchedStockHistory
               
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