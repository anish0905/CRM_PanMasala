const mongoose = require("mongoose");

const inspectionShopDetailsSchema = mongoose.Schema(
  {
    fieldManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldManagerLogin",
      default: null,
    },
    FEA_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldManagerLogin",
      default: null,
    },
    PanShopOwner: {
      type: String,
    },
    shop_name: {
      type: String,
      required: true,
    },
    shop_address: {
      type: String,
      required: true,
    },
    shop_contact_number: {
      type: String,
      required: true,
    },
    shop_owner_name: {
      type: String,
    },
    Feedback_Provided: {
      type: String,
    },
    Photos_Uploaded: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected", "re-verify"],
      default: "pending",
    },
    shop_Location: [
      {
        longitude: { type: Number },
        latitude: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    showCaseTestId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShowCase",
        default: null,
      },
    ],
    history: [
      {
        field: { type: String },
        oldValue: { type: mongoose.Schema.Types.Mixed },
        newValue: { type: mongoose.Schema.Types.Mixed },
        updatedBy: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to track changes// Middleware to track changes with user ID
inspectionShopDetailsSchema.pre("save", async function (next) {
  const doc = this;

  if (doc.isNew) {
    return next();
  }

  try {
    const existingDoc = await doc.constructor.findById(doc._id).lean();

    if (existingDoc) {
      const historyUpdates = [];
      const modifiedFields = doc.modifiedPaths();
      const updatedBy = doc._updatedBy || "Unknown"; // Use the user ID passed to the model

      modifiedFields.forEach((field) => {
        if (field !== "history") {
          const oldValue = existingDoc[field];
          const newValue = doc.get(field);

          const isEqual =
            JSON.stringify(oldValue) === JSON.stringify(newValue);

          if (!isEqual) {
            historyUpdates.push({
              field,
              oldValue,
              newValue,
              updatedBy,
              timestamp: new Date(),
            });
          }
        }
      });

      if (historyUpdates.length > 0) {
        doc.history = [...(existingDoc.history || []), ...historyUpdates];
      }
    }

    next();
  } catch (error) {
    console.error("Error in pre-save middleware:", error);
    next(error);
  }
});










const InspectionShop = mongoose.model(
  "vendorRegisterShop",
  inspectionShopDetailsSchema
);

module.exports = InspectionShop;
