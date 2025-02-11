const DeleteRequest = require("../../models/FieldManagement/deleteRequestSchema");
const FieldManager = require("../../models/FieldManagement/Login.model");
const Distributors = require("../../models/Distributor/Distributor.Model");

// it is used for check status of delete users
const deleteRequestStatus = async (req, res) => {
  try {
    const distributorId = req.params.id;

    const deleteRequest = await DeleteRequest.findOne({ distributorId });
    if (!deleteRequest) {
      return res.status(404).json({ message: "Delete request not found" });
    }
    res.status(200).json(deleteRequest);
  } catch (error) {
    console.error("Error fetching delete request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//field management Delete request

const approveFieldDeleteRequest = async (req, res) => {
  const { requestId, action } = req.body; // action = "Approved" or "Rejected"

  try {
    const deleteRequest = await DeleteRequest.findById(requestId);
    if (!deleteRequest) {
      return res.status(404).json({ message: "Delete request not found" });
    }

    if (action === "Approved") {
      // Delete the Field Manager
      await FieldManager.findByIdAndDelete(deleteRequest.fieldManagerId);
      await Distributors.findByIdAndDelete(deleteRequest.fieldManagerId);
      deleteRequest.status = "Approved";
    } else {
      deleteRequest.status = "Rejected";
    }

    await deleteRequest.save();
    res.json({
      message: `Delete request ${action.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error processing delete request:", error);
    res.status(500).json({ message: "Server error in processing request" });
  }
};

const getApprovedFieldManager = async (req, res) => {
  try {
    const pendingRequests = await DeleteRequest.find({ status: "Pending" });

    if (pendingRequests.length === 0) {
      return res.status(404).json({ message: "No pending requests found" });
    }

    const fieldManagerIds = pendingRequests.map(
      (request) => request.fieldManagerId
    );

    const fieldManagers = [
      ...(await FieldManager.find({ _id: { $in: fieldManagerIds } }).populate(
        "distributors_id"
      )),
      ...(await Distributors.find({ _id: { $in: fieldManagerIds } }).populate(
        "superstockist"
      )),
    ];

    return res.status(200).json({
      pendingRequests, // Includes all pending requests
      fieldManagers, // Includes corresponding field managers
    });
  } catch (error) {
    console.error("Error fetching pending field managers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Distributor Delete

module.exports = {
  approveFieldDeleteRequest,
  getApprovedFieldManager,
  deleteRequestStatus,
};
