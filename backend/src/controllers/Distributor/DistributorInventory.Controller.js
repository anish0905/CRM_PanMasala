// Import the DistributorInventory model
const DistributorInventory = require("../../models/Distributor/DistributorInventory.Model");

/**
 * Fetch all inventory for a specific user by userId
 */
const getAllInventoryByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const inventories = await DistributorInventory.find({ userId: id }).populate("productId");

        if (!inventories.length) {
            return res.status(404).json({ message: "No inventory found for this user" });
        }

        res.status(200).json(inventories);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

/**
 * Add or update inventory for a product
 */
const addInventory = async (req, res) => {
    const { userId, productId, orderId, productName, receivedStock, issuedBy } = req.body;

    try {
        // Validate required fields
        if (!userId || !productId || !productName || receivedStock == null) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const stockToAdd = Number(receivedStock);

        if (isNaN(stockToAdd) || stockToAdd < 0) {
            return res.status(400).json({ message: "Invalid stock value" });
        }

        const existingInventory = await DistributorInventory.findOne({ productId });

        if (existingInventory) {
            // Update existing inventory
            existingInventory.receivedStock += stockToAdd;
            existingInventory.remainingStock += stockToAdd;

            existingInventory.transactionHistory.push({
                issuedBy,
                quantity: stockToAdd,
                productId,
                transactionDate: new Date(),
            });

            const updatedInventory = await existingInventory.save();

            return res.status(200).json({
                message: "Stock updated successfully",
                inventory: updatedInventory,
            });
        } else {
            // Create new inventory entry
            const remainingStock = stockToAdd;
            const newInventory = new DistributorInventory({
                userId,
                productId,
                orderId,
                productName,
                receivedStock: stockToAdd,
                dispatchedStock: 0,
                remainingStock,
                transactionHistory: [
                    {
                        issuedBy,
                        quantity: stockToAdd,
                        productId,
                        transactionDate: new Date(),
                    },
                ],
            });

            const savedInventory = await newInventory.save();

            return res.status(201).json({
                message: "Inventory added successfully",
                inventory: savedInventory,
            });
        }
    } catch (error) {
        console.error("Error adding inventory:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

/**
 * Fetch transaction history for a specific inventory by inventory ID
 */
const getHistoryByInventoryId = async (req, res) => {
    const { id } = req.params;

    try {
        const inventory = await DistributorInventory.findById(id)
            .populate("productId")
            .populate("transactionHistory.issuedBy")
            .populate("transactionHistory.issuedTo");

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        res.status(200).json(inventory);
    } catch (error) {
        console.error("Error fetching inventory history:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

/**
 * Dispatch inventory for a product
 */
const dispatchInventory = async (req, res) => {
    const { inventoryId, issuedTo, quantity, productId } = req.body;

    try {
        // Validate required fields
        if (!inventoryId || !issuedTo || !quantity || !productId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const superStockistInventory = await StockistInventory.findById(inventoryId);

        if (!superStockistInventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }

        const quantityToDispatch = Number(quantity);

        if (isNaN(quantityToDispatch) || quantityToDispatch <= 0) {
            return res.status(400).json({ message: "Invalid quantity value" });
        }

        if (superStockistInventory.remainingStock < quantityToDispatch) {
            return res.status(400).json({ message: "Insufficient stock available" });
        }

        // Update inventory
        superStockistInventory.dispatchedStock += quantityToDispatch;
        superStockistInventory.remainingStock -= quantityToDispatch;

        superStockistInventory.transactionHistory.push({
            issuedTo,
            quantity: quantityToDispatch,
            productId,
            transactionDate: new Date(),
        });

        const updatedInventory = await superStockistInventory.save();

        res.status(200).json({
            message: "Stock dispatched successfully",
            inventory: updatedInventory,
        });
    } catch (error) {
        console.error("Error dispatching inventory:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getAllInventoryByUserId,
    getHistoryByInventoryId,
    addInventory,
    dispatchInventory,
};
