const asyncHandler = require("express-async-handler");
const PanShopOwner = require("../../models/panshop/panShopOwnerModel");
const fs = require('fs');

const qrcode = require('qrcode');

function validatePhoneNumber(phoneNumber) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneno.test(phoneNumber);
}


const createPanShopOwner = asyncHandler(async (req, res) => {
    const { panShopOwner, phoneNumber, address, latitude, longitude ,id , city,  district ,subDivision , state } = req.body;

    

    if (!panShopOwner || !phoneNumber || !address || !latitude || !longitude || !district || !subDivision || !state ) {
        return res.status(400).json({ error: "panShopOwner, phoneNumber, address, latitude ,district subDivision state longitude are mandatory fields" });
    }

    if (!validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone number format" });
    }
    

    try {

        const existingOwner = await PanShopOwner.findOne({ phoneNumber });

        if (existingOwner) {
            return res.status(400).json({ error: "Phone number already exists"});
          }
        // Create the pan shop owner 
        const owner = await PanShopOwner.create({
            panShopOwner,
            phoneNumber,
            address,
            latitude,
            longitude,
            user_id:id||"", // Make sure this is correct
            city,
            district,
            subDivision,
            state,
       
        });

         console.log(owner)
        const qrData = JSON.stringify({
            Id :owner._id,
            panShopOwner: owner.panShopOwner
        });
        // Generate and store the QR code
        const qrImageFilePath =` qr_${owner._id}.png`; // File path for the QR code image
        await qrcode.toFile(qrImageFilePath, qrData);

        // Read the QR code image file as a buffer
        const qrImageData = fs.readFileSync(qrImageFilePath);

        // Delete the QR code image file after reading it
        fs.unlinkSync(qrImageFilePath);

        // Store the QR code image data in the owner object
        owner.qrCodeImage = {
            data: qrImageData,
            contentType: 'image' // Adjust according to the image format
        };
        await owner.save();
        const qrCodeBase64 = qrImageData.toString('base64');
        res.status(201).json({ qrCodeBase64 ,owner});
    } catch (error) {
        // If an error occurs during the creation process, send an error response
        console.error(error);
        res.status(500).json({ error: "Failed to create pan shop owner" });
    }
});


const updatePanShoperOwner = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { panShopOwner, phoneNumber, address, latitude, longitude } = req.body;

    // Check if the pan shop owner exists
    let owner = await PanShopOwner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: 'Pan shop owner not found' });
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Check if phone number already exists for another owner
    const existingOwner = await PanShopOwner.findOne({ phoneNumber: phoneNumber, _id: { $ne: ownerId } });
    if (existingOwner) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Update the pan shop owner
    const updatedOwner = await PanShopOwner.findByIdAndUpdate(ownerId, {
      panShopOwner,
      phoneNumber,
      address,
      latitude,
      longitude,
    }, { new: true });

    if (!updatedOwner) {
      return res.status(500).json({ error: 'Failed to update pan shop owner' });
    }

    // Generate QR code and update owner with QR code data
    const qrData = JSON.stringify({
      Id: updatedOwner._id,
      panShopOwner: updatedOwner.panShopOwner,
    });

    const qrImageFilePath = `qr_${updatedOwner._id}.png`;
    await qrcode.toFile(qrImageFilePath, qrData);
    const qrImageData = fs.readFileSync(qrImageFilePath);
    fs.unlinkSync(qrImageFilePath);

    // Update the pan shop owner with the new QR code
    updatedOwner.qrCodeImage = {
      data: qrImageData,
      contentType: 'image/png', // Adjust content type as needed
    };
    await updatedOwner.save();

    const qrCodeBase64 = qrImageData.toString('base64');

    // Return the updated pan shop owner with QR code base64
    res.status(200).json({ qrCodeBase64, owner: updatedOwner });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to update pan shop owner' });
  }
});

  

const deletePanShopOwner = asyncHandler(async (req, res) => {
  const owner = await PanShopOwner.findById(req.params.id);

  if (!owner) {
      res.status(404);
      throw new Error('Pan Shop Owner not found');
  }

  // Perform deletion if the owner exists
  await PanShopOwner.deleteOne({ _id: req.params.id });

  // Return a response with the deleted owner data
  res.status(200).json({
      message: 'Pan Shop Owner deleted successfully',
      deletedOwner: owner
  });
});




const getPanShopOwnerById = asyncHandler(async (req, resp) => {
    // Find the Pan Shop Owner by ID
    const owner = await PanShopOwner.findById(req.params.id);
    if (!owner) {
        resp.status(404);
        throw new Error("PanShop Owner Not Found");
    }

    // Generate the link for the QR code
    const link = `https://atticapanmasala.com/login/${owner._id}`;

    // File path for the QR code image
    const qrImageFilePath = `qr_${owner._id}.png`;

    try {
        // Generate QR code image with the link directly
        await qrcode.toFile(qrImageFilePath, link);

        // Read the QR code image file as a buffer
        const qrImageData = fs.readFileSync(qrImageFilePath);

        // Delete the QR code image file after reading it
        fs.unlinkSync(qrImageFilePath);

        // Convert QR code image data to base64
        const qrCodeBase64 = qrImageData.toString("base64");

        // Attach the QR code image data (optional)
        owner.qrCodeImage = {
            data: qrImageData,
            contentType: "image/png", // Image format
        };

        // Send the Pan Shop Owner details along with the QR code as Base64
        resp.status(200).json({
            qrCodeBase64,
            owner,
        });
    } catch (error) {
        resp.status(500);
        throw new Error("Error generating QR Code: " + error.message);
    }
});





const getAllPanShopOwner = asyncHandler(async (req, res) => {
  try {
      // Fetch all Pan Shop Owners from the database
      const shopOwners = await PanShopOwner.find();

      // Return the list of shop owners in the response
      res.status(200).json({
          success: true,
          data: shopOwners,
      });
  } catch (error) {
      // Handle any potential errors
      res.status(500).json({
          success: false,
          message: "Failed to retrieve Pan Shop Owners",
          error: error.message,
      });
  }
});


module.exports = { 
  createPanShopOwner
   ,updatePanShoperOwner
    ,deletePanShopOwner
    ,getAllPanShopOwner ,
    getPanShopOwnerById};