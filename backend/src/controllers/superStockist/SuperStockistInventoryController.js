const SuperStockistInventory = require('../../models/superStockist/SuperStockistInventory.Model');

/**
 * Get all inventory items for a user by their userId.
 */
const getAllInventoryByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const inventories = await SuperStockistInventory.find({ userId: id }).populate('productId');

        if (!inventories.length) {
            return res.status(404).json({ message: 'No inventory found for this user' });
        }

        res.status(200).json(inventories);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

/**
 * Add new inventory or update existing inventory for a product.
 */
const addInventory = async (req, res) => {
    const { userId, productId, orderId, productName, receivedStock,issuedBy  } = req.body;

    try {
        if (!userId || !productId || !productName || receivedStock == null) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        const stockToAdd = Number(receivedStock);
        if (isNaN(stockToAdd) || stockToAdd < 0) {
            return res.status(400).json({ message: 'Invalid stock value' });
        }

        const existingInventory = await SuperStockistInventory.findOne({ productId });

        if (existingInventory) {
            existingInventory.receivedStock += stockToAdd;
            existingInventory.remainingStock += stockToAdd;

            existingInventory.transactionHistory.push({
                issuedBy:issuedBy,
                quantity: stockToAdd,
                productId,
                transactionDate: new Date(),
            });

            const updatedInventory = await existingInventory.save();

            return res.status(200).json({
                message: 'Stock updated successfully',
                inventory: updatedInventory,
            });
        } else {
            const remainingStock = stockToAdd;
            const newInventory = new SuperStockistInventory({
                userId,
                productId,
                orderId,
                productName,
                receivedStock: stockToAdd,
                dispatchedStock: 0,
                remainingStock,
            });

            newInventory.transactionHistory.push({
                issuedBy:issuedBy,
                quantity: stockToAdd,
                productId,
                transactionDate: new Date(),
            });

            const savedInventory = await newInventory.save();

            return res.status(201).json({
                message: 'Inventory added successfully',
                inventory: savedInventory,
            });
        }
    } catch (error) {
        console.error('Error adding inventory:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

/**
 * Get inventory history by inventoryId.
 */
const getHistroyByInventorId = async (req, res) => {
    const { id } = req.params;

    try {
        const inventory = await SuperStockistInventory.findById(id)
            .populate('productId')
            .populate({
                path: 'transactionHistory.issuedBy',
            })
            .populate({
                path: 'transactionHistory.issuedTo',
            });

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error fetching inventory history:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

/**
 * Dispatch inventory to a recipient.
 */
const dispatchInventory = async (req, res) => {
    const { inventoryId, issuedTo, quantity, productId } = req.body;

    try {
        if (!inventoryId || !issuedTo || !quantity || !productId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const superStockistInventory = await SuperStockistInventory.findById(inventoryId);

        if (!superStockistInventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        const quantityToDispatch = Number(quantity);
        if (isNaN(quantityToDispatch) || quantityToDispatch <= 0) {
            return res.status(400).json({ message: 'Invalid quantity value' });
        }

        if (superStockistInventory.remainingStock < quantityToDispatch) {
            return res.status(400).json({ message: 'Insufficient stock available' });
        }

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
            message: 'Stock dispatched successfully',
            inventory: updatedInventory,
        });
    } catch (error) {
        console.error('Error dispatching inventory:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    getAllInventoryByUserId,
    getHistroyByInventorId,
    addInventory,
    dispatchInventory,
};
