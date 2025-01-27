const express = require("express");
const {
    createPanShopOrder,
    getPanShopOrderById,
    assignedToorderStockitAndSuperStockit,
    getPanShopOrder,
    // getTodays24HoursSell
    deletePanShopOrderById,
    assignToOrderToDeliverBoy,
    matchOtp,
    cancelOrder,
    // assignToOrderToSuperStockistDeliverBoy,
    // getSuperStockistDeliveryBoy,
    // updateOrderStatusfromSuperStockistDeliveryBoy,
    // cancleOrderFromTheSuperStockistDeliveyBoy,
    getAllOrderHistroyByShopOwnerId
} = require("../../controllers/panshop/panShopOrderController");

const router = express.Router();

router.route("/")
    .post(createPanShopOrder)
    .get(getPanShopOrder);

router.route("/:id")
    .get(getPanShopOrderById)
    .patch(assignedToorderStockitAndSuperStockit)
    .delete(deletePanShopOrderById)

 // Add routes for super stockist delivery boy's routes here
// router.route("/updateOrderStatus/:id").patch(updateOrderStatusfromSuperStockistDeliveryBoy)



router.route("/assignedToDeliverBoy/:id").patch(assignToOrderToDeliverBoy);

// router.route("/assignedTosuperStockistDeliverBoy/:id").patch(assignToOrderToSuperStockistDeliverBoy)

router.route("/:id").post(matchOtp);


router.route("/cancel/:orderId").put(cancelOrder)

// router.route("/getAllOrdersuperStockistDeliverBoybyId/:id").get(getSuperStockistDeliveryBoy)

// router.route("/cancleOrderFromTheSuperStockistDeliveyBoy/:id").patch(cancleOrderFromTheSuperStockistDeliveyBoy)

router.route("/orderHistroy/:id").get(getAllOrderHistroyByShopOwnerId)





module.exports = router;
