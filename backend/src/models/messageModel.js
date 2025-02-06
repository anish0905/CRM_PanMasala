const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    isRead: {
      type: Boolean,
      default: false,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: " admin || CNFAgent || SuperStockist || subAdmin || FieldManagerLogin  || Distributor ",
      required: true,
      index: true, // Indexing for faster queries
    },
    senderName: {
      type: String,
    },
    subject: {
      type: String,
    },
    recipient: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: " admin || CNFAgent || SuperStockist ||  subAdmin || FieldManagerLogin || Distributor",
        required: true,
        index: true, // Indexing for faster queries
      },
    ],
    content: {
      text: {
        type: String,
        default: null,
      },
      originalMessage: {
        type: String, // Fixed incorrect type
        default: null,
      },
      replyMsg: {
        type: String, // Fixed incorrect type
        default: null,
      },
      image: {
        type: String,
        default: null,
      },
      document: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
