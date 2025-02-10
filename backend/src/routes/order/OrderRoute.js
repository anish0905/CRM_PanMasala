const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/order/OrderController');

router.post('/create', orderController.createOrder);
router.get('/user/:userId', orderController.getUserOrders);
router.get('/:orderId', orderController.getOrderById);
router.put('/update-status/:orderId', orderController.updateOrderStatus);
router.delete('/delete/:orderId', orderController.deleteOrder);
router.get('/find-nearest-distributor', orderController.findNearestDistributor);

module.exports = router;
