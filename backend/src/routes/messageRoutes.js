const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/send", messageController.sendMessage);
router.put("/unread/:messageId", messageController.unReadMessage);

router.get("/get/:senderId/:recipientId", messageController.getMessages);
router.delete("/delete/:messageId", messageController.deleteMessage);

module.exports = router;
