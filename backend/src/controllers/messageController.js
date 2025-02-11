const Message = require("../models/messageModel");

// Send a Message
exports.sendMessage = async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Debugging line

    const {
      sender,
      senderName,
      subject,
      recipient,
      text,
      originalMessage,
      replyMsg,
      attachments,
    } = req.body;
    console.log("Parsed Data:", sender);

    if (
      !sender ||
      !recipient ||
      (!text &&
        !originalMessage &&
        !replyMsg &&
        (!attachments || attachments.length === 0))
    ) {
      return res.status(400).json({ error: "Message content cannot be empty" });
    }

    const newMessage = new Message({
      sender,
      senderName,

      recipient,
      subject,
      content: {
        text,
        originalMessage,
        replyMsg,
        attachments,
      },
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Messages Between Users
exports.getMessages = async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort({ createdAt: 1 }); // Sort by timestamp

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesByrecipientId = async (req, res) => {
  try {
    const {  recipientId } = req.params;

    const messages = await Message.find({
      recipient: recipientId,
      
      
    }).sort({ createdAt: 1 }); // Sort by timestamp

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unReadMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const unReadMessages = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true }, // isRemoved ko true set kar rahe hain
      { new: true }
    );

    if (!unReadMessages) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Message hidden", unReadMessages });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error hiding message",
      error: error.message,
    });
  }
};



