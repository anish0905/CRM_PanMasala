const multer = require("multer");
const path = require("path");
const InspectionShop = require("../../models/FieldManagement/inspectionShopDetails.model");
const mongoose = require("mongoose");
const Product = require("../../models/e-commerce_product/e-commerce_product.model");
const User = require("../../models/FieldManagement/Login.model");

// Configure Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure the 'uploads/' folder exists
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Unique timestamp
    const extension = path.extname(file.originalname); // Extract file extension
    const uniqueFilename = `${timestamp}${extension}`; // Construct filename
    cb(null, uniqueFilename);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPEG, JPG, and PNG files are allowed!"), false); // Reject other file types
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: fileFilter,
}).single("photo"); // Ensure the field name in the form is 'photo'

// Controller function to create an inspection shop

// Controller to create InspectionShop
exports.createInspectionShop = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err.message);
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        fieldManagerId,
        PanShopOwner,
        shop_name,
        shop_address,
        shop_contact_number,
        shop_owner_name,
        Issues_Reported,
        Feedback_Provided,
        shop_Location,
        remarks,
        showCaseTestId,
        productId,
        FEA_id,
      } = req.body;

      // Validate required fields
      if (!shop_name || !shop_address || !shop_contact_number) {
        return res.status(400).json({
          error:
            "shop_name, shop_address, and shop_contact_number are required.",
        });
      }

      // Parse showCaseTestId into an array of ObjectIds
      let parsedShowCaseTestId = [];
      if (showCaseTestId) {
        try {
          const ids = Array.isArray(showCaseTestId)
            ? showCaseTestId
            : JSON.parse(showCaseTestId);

          parsedShowCaseTestId = ids.map((id) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
              throw new Error(`Invalid ObjectId: ${id}`);
            }
            return new mongoose.Types.ObjectId(id);
          });
        } catch (parseError) {
          return res.status(400).json({
            error: `Invalid format for showCaseTestId: ${parseError.message}`,
          });
        }
      }

      // Validate and parse shop_Location
      let shopLocation = [];
      if (shop_Location) {
        const location = shop_Location
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
        if (location.length !== 2 || isNaN(location[0]) || isNaN(location[1])) {
          return res.status(400).json({
            error:
              'Invalid shop_Location format. Expected "latitude,longitude".',
          });
        }
        shopLocation = [
          {
            latitude: location[0],
            longitude: location[1],
            timestamp: new Date(),
          },
        ];
      }

      // Create the document
      const newInspectionShop = new InspectionShop({
        fieldManagerId: fieldManagerId || null,
        PanShopOwner: PanShopOwner || null,
        shop_name,
        shop_address,
        shop_contact_number,
        shop_owner_name: shop_owner_name || null,
        Issues_Reported: Issues_Reported || null,
        Feedback_Provided: Feedback_Provided || null,
        Photos_Uploaded: req.file ? req.file.path : null,
        shop_Location: shopLocation,
        remarks: remarks || "",
        status: "pending",
        showCaseTestId: parsedShowCaseTestId,
        productId: Array.isArray(productId) ? productId : [],
        FEA_id: FEA_id,
      });

      // Save to database
      const savedShop = await newInspectionShop.save();

      res.status(201).json({
        message: "Inspection Shop Details Created Successfully!",
        data: savedShop,
      });
    } catch (error) {
      console.error("Error creating inspection shop:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
};

exports.getInspectionShop = async (req, res) => {
  console.log("Fetching Inspection Shop Details...");
  try {
    const inspectionShop = await InspectionShop.find()
      .populate("fieldManagerId")
      .populate("showCaseTestId"); // Ensure this matches your schema

    if (!inspectionShop || inspectionShop.length === 0) {
      return res.status(404).json({
        message: "No inspection shop details found.",
      });
    }

    res.status(200).json(inspectionShop);
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching inspection shop details.",
      details: error.message, // Optional: Include detailed error message for debugging
    });
  }
};

exports.getInspectionShopByFEAId = async (req, res) => {
  try {
    const FEA_id = req.params.id;

    const inspectionShop = await InspectionShop.find({ FEA_id })
      .populate("fieldManagerId")
      .populate("showCaseTestId"); // Ensure this matches your schema

    if (!inspectionShop || inspectionShop.length === 0) {
      return res.status(404).json({
        message: "No inspection shop details found.",
      });
    }

    res.status(200).json(inspectionShop);
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching inspection shop details.",
      details: error.message, // Optional: Include detailed error message for debugging
    });
  }
};

exports.getInspectionShopByfieldManagerId = async (req, res) => {
  try {
    const id = req.params.id;
    const inspectionShop = await InspectionShop.find({ fieldManagerId: id })
      .populate("fieldManagerId")
      .populate("showCaseTestId"); // Ensure this matches your schema

    if (!inspectionShop || inspectionShop.length === 0) {
      return res.status(404).json({
        message: "No inspection shop details found.",
      });
    }

    res.status(200).json(inspectionShop);
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching inspection shop details.",
      details: error.message, // Optional: Include detailed error message for debugging
    });
  }
};

// Controller to fetch shop location by ID
exports.getShopLocationById = async (req, res) => {
  try {
    const shopId = req.params.id;

    // Fetch the shop by ID, selecting only the `shop_Location` field
    const shop = await InspectionShop.findById(shopId).select("shop_Location");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Return the shop location data
    res.status(200).json(shop.shop_Location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to update Inspection Shop details (excluding shop_Location)
exports.updateInspectionShop = async (req, res) => {
  

  // Handle file uploads (if files are passed)
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err.message);
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id } = req.params; // Get ID from request params

      // Find the existing InspectionShop document
      const existingShop = await InspectionShop.findById(id);
      if (!existingShop) {
        return res.status(404).json({ error: "Inspection Shop not found." });
      }

      // Extract the fields to update from req.body
      const {
        fieldManagerId,
        PanShopOwner,
        shop_name,
        shop_address,
        shop_contact_number,
        shop_owner_name,
        status,
        Issues_Reported,
        Feedback_Provided,
      } = req.body;

    

      // If a new file is uploaded, update Photos_Uploaded; otherwise, preserve the existing photo
      let uploadedPhotos = existingShop.Photos_Uploaded; // Preserve existing photos
      if (req.file) {
        uploadedPhotos = req.file.path; // Update with new photo path
      }

      const userId = req.body.updatedBy || "Unknown";

      // Update the fields (excluding shop_Location)
      existingShop.fieldManagerId =
        fieldManagerId || existingShop.fieldManagerId;
      existingShop.PanShopOwner = PanShopOwner || existingShop.PanShopOwner;
      existingShop.shop_name = shop_name || existingShop.shop_name;
      existingShop.shop_address = shop_address || existingShop.shop_address;
      existingShop.shop_contact_number =
        shop_contact_number || existingShop.shop_contact_number;
      existingShop.shop_owner_name =
        shop_owner_name || existingShop.shop_owner_name;
      existingShop.status = status || existingShop.status;
      existingShop.Issues_Reported =
        Issues_Reported || existingShop.Issues_Reported;
      existingShop.Feedback_Provided =
        Feedback_Provided || existingShop.Feedback_Provided;

      // Only update Photos_Uploaded if a new file is uploaded
      if (req.file) {
        existingShop.Photos_Uploaded = uploadedPhotos;
      }

      existingShop._updatedBy = userId;


      // Save the updated document
      await existingShop.save();

      return res.status(200).json({
        message: "Inspection Shop Details Updated Successfully!",
        data: existingShop,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ error: "Error updating inspection shop details." });
    }
  });
};


exports.deleteInspectionShop = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from request params

    // Find the InspectionShop document by ID
    const existingShop = await InspectionShop.findById(id);
    if (!existingShop) {
      return res.status(404).json({ error: "Inspection Shop not found." });
    }

    // Delete the document
    await existingShop.deleteOne();

    // Return success response
    return res.status(200).json({
      message: "Inspection Shop deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting Inspection Shop:", error.message);
    return res.status(500).json({ error: "Error deleting inspection shop." });
  }
};
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, remarks, } = req.body;
  const updatedBy = req.body.updatedBy || "Unknown";

  try {
    // Find the document by id and update the status and remarks
    const updatedStatus = await InspectionShop.findByIdAndUpdate(
      id, // Find by the provided id
      { status, remarks,updatedBy }, // Update the status and remarks
      { new: true, runValidators: true } // 'new: true' returns the updated document, 'runValidators' ensures validation
    );

    // If no document is found with the given id
    if (!updatedStatus) {
      return res.status(404).json({ message: "Status not found" });
    }

    // Return the updated document
    return res.status(200).json(updatedStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllByExecutivebyid = async (req, res) => {
  const { executiveId } = req.params;

  try {
    // Fetch InspectionShop details and populate showcase test data
    const inspectionShops = await InspectionShop.find({
      fieldManagerId: executiveId,
    }).populate("showCaseTestId");

    if (!inspectionShops || inspectionShops.length === 0) {
      return res
        .status(404)
        .json({ message: "No inspection shop details found." });
    }

    // Process each InspectionShop to fetch related product details
    const enrichedShops = await Promise.all(
      inspectionShops.map(async (shop) => {
        if (shop.showCaseTestId && Array.isArray(shop.showCaseTestId)) {
          // Fetch products for each showcase
          const enrichedShowcases = await Promise.all(
            shop.showCaseTestId.map(async (showcase) => {
              if (showcase.productId) {
                // Fetch product details using productId
                const productDetails = await Product.findById(
                  showcase.productId
                );
                return { ...showcase.toObject(), productDetails };
              }
              return showcase;
            })
          );
          // Attach enriched showcases back to the shop
          return { ...shop.toObject(), showCaseTestId: enrichedShowcases };
        }
        return shop;
      })
    );

    res.status(200).json(enrichedShops);
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching inspection shop details.",
      details: error.message,
    });
  }
};
exports.ProductAvrageRating = async (req, res) => {
  const inspectionShops = await InspectionShop.find()
    .populate("showCaseTestId")
    .select("showCaseTestId")
    .lean(); // Use lean to avoid circular references

  if (!inspectionShops || inspectionShops.length === 0) {
    return res
      .status(404)
      .json({ message: "No inspection shop details found." });
  }

  // Process each InspectionShop to fetch related product details
  const enrichedShops = await Promise.all(
    inspectionShops.map(async (shop) => {
      if (shop.showCaseTestId && Array.isArray(shop.showCaseTestId)) {
        // Group showcases by productId
        const productGroups = shop.showCaseTestId.reduce((acc, showcase) => {
          if (showcase.productId) {
            if (!acc[showcase.productId]) {
              acc[showcase.productId] = {
                productId: showcase.productId,
                fragranceRatings: [],
                tasteAndFlavorRatings: [],
                reviewRatings: [],
                showcases: [],
              };
            }

            // Collect ratings for each product
            if (showcase.fragrance && showcase.fragrance.length) {
              acc[showcase.productId].fragranceRatings.push(
                ...showcase.fragrance
              );
            }

            if (showcase.tasteAndFlavor && showcase.tasteAndFlavor.length) {
              acc[showcase.productId].tasteAndFlavorRatings.push(
                ...showcase.tasteAndFlavor
              );
            }

            if (showcase.reviews && showcase.reviews.length) {
              acc[showcase.productId].reviewRatings.push(...showcase.reviews);
            }

            // Collect the showcase details
            acc[showcase.productId].showcases.push(showcase);
          }
          return acc;
        }, {});

        // Now process each group and calculate averages
        const enrichedProducts = await Promise.all(
          Object.values(productGroups).map(async (group) => {
            // Fetch product details using the productId
            const productDetails = await Product.findById(
              group.productId
            ).lean();

            // Calculate average ratings for fragrance, tasteAndFlavor, and reviews
            const averageFragranceRating = group.fragranceRatings.length
              ? group.fragranceRatings.reduce(
                  (acc, rating) => acc + rating.rating,
                  0
                ) / group.fragranceRatings.length
              : null;

            const averageTasteAndFlavorRating = group.tasteAndFlavorRatings
              .length
              ? group.tasteAndFlavorRatings.reduce(
                  (acc, rating) => acc + rating.rating,
                  0
                ) / group.tasteAndFlavorRatings.length
              : null;

            const averageReviewRating = group.reviewRatings.length
              ? group.reviewRatings.reduce(
                  (acc, rating) => acc + rating.rating,
                  0
                ) / group.reviewRatings.length
              : null;

            // Calculate the overall rating (taking the average of the available ratings)
            const totalRatings = [
              averageFragranceRating,
              averageTasteAndFlavorRating,
              averageReviewRating,
            ].filter((rating) => rating !== null);

            const overallRating =
              totalRatings.length > 0
                ? totalRatings.reduce((acc, rating) => acc + rating, 0) /
                  totalRatings.length
                : null;

            return {
              productDetails, // Returning full product details
              averageFragranceRating,
              averageTasteAndFlavorRating,
              overallRating,
            };
          })
        );

        // Attach the enriched product details back to the shop
        return { ...shop, showCaseTestId: enrichedProducts };
      }
      return shop;
    })
  );

  return res.json({ enrichedShops });
};


exports.getHistoryWithUserDetails = async (req, res) => {
  try {
    const recordId = req.params.recordId;

    // Fetch the shop history by shop ID
    const shop = await InspectionShop.findById(recordId).select('history');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Map over the history and fetch user details
    const enrichedHistory = await Promise.all(
      shop.history.map(async (entry) => {
        let userDetails = null;

        // Fetch the user details if `updatedBy` is present and valid
        if (entry.updatedBy && entry.updatedBy !== "Unknown") {
          // Exclude the `password` field while fetching user details
          const user = await User.findById(entry.updatedBy).select('-password');
          if (user) {
            userDetails = user; // Include all user details except the password
          }
        }

        return {
          field: entry.field,
          oldValue: entry.oldValue,
          newValue: entry.newValue,
          updatedBy: entry.updatedBy || "Unknown",
          timestamp: entry.timestamp,
          updatedByUser: userDetails || "Unknown User",
        };
      })
    );

    res.status(200).json({
      message: "Shop history fetched successfully",
      history: enrichedHistory,
    });
  } catch (error) {
    console.error("Error fetching shop history:", error);
    res.status(500).json({ message: "An error occurred while fetching shop history" });
  }
};




