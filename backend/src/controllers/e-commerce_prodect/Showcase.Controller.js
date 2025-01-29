const ShowCase = require("../../models/e-commerce_product/Showcase.Model");
const ProductEomm = require("../../models/e-commerce_product/e-commerce_product.model");
const createShowCase = async (req, res) => {
  try {
    const {
      productId,
      fieldManagerId,
      fragrance,
      tasteAndFlavor,
      productSimilarity,
      locations,
      reviews,
      FEA_id
    } = req.body;

    // Validate required fields
    if (!productId || !fragrance || !tasteAndFlavor || !productSimilarity) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Helper function to normalize ratings
    const normalizeRating = (rating) => {
      if (Array.isArray(rating)) {
        // Convert all items to objects with a 'rating' field
        return rating.map((r) =>
          typeof r === "number" ? { rating: r } : { rating: r?.rating || 0 }
        );
      }
      return [{ rating: typeof rating === "number" ? rating : 0 }];
    };

    // Normalize fragrance and tasteAndFlavor
    const normalizedFragrance = normalizeRating(fragrance);
    const normalizedTasteAndFlavor = normalizeRating(tasteAndFlavor);

    // Validate ratings for fragrance and tasteAndFlavor
    const isValidRating = (ratings) =>
      ratings.every(
        (rating) =>
          typeof rating.rating === "number" &&
          rating.rating >= 1 &&
          rating.rating <= 10
      );

    if (!isValidRating(normalizedFragrance)) {
      return res
        .status(400)
        .json({ message: "Ratings for fragrance must be between 1 and 10." });
    }
    if (!isValidRating(normalizedTasteAndFlavor)) {
      return res.status(400).json({
        message: "Ratings for taste and flavor must be between 1 and 10.",
      });
    }

    // Normalize reviews
    const normalizedReviews = Array.isArray(reviews)
      ? reviews.map((review) => ({
          rating: review?.rating || 0,
          timestamp: review?.timestamp || Date.now(),
        }))
      : [
          {
            rating: typeof reviews === "number" ? reviews : 0,
            timestamp: Date.now(),
          },
        ];

    // Validate reviews
    const isValidReview = (reviews) =>
      reviews.every(
        (review) =>
          typeof review.rating === "number" &&
          review.rating >= 1 &&
          review.rating <= 10
      );

    if (!isValidReview(normalizedReviews)) {
      return res
        .status(400)
        .json({ message: "Ratings for reviews must be between 1 and 10." });
    }

    // Normalize locations
    const normalizedLocations = Array.isArray(locations)
      ? locations.map((location) => ({
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp || Date.now(),
        }))
      : [];

    // Create the ShowCase object
    const newShowCase = new ShowCase({
      productId,
      fieldManagerId: fieldManagerId || null,
      fragrance: normalizedFragrance,
      tasteAndFlavor: normalizedTasteAndFlavor,
      productSimilarity,
      locations: normalizedLocations,
      reviews: normalizedReviews,
      FEA_id
    });

    // Save the ShowCase object
    const savedShowCase = await newShowCase.save();

    // Respond with success
    res.status(201).json({
      message: "ShowCase created successfully.",
      data: savedShowCase,
    });
  } catch (error) {
    console.error("Error creating ShowCase:", error);
    res.status(500).json({
      message: "An error occurred while creating the ShowCase.",
      error: error.message,
    });
  }
};

const findShowCase = async (req, res) => {
  try {
    const showCases = await ShowCase.find()
      .populate("productId")
      .populate("fieldManagerId");
    res.status(200).json({ data: showCases });
  } catch (error) {
    console.error("Error finding ShowCases:", error);
    res.status(500).json({
      message: "An error occurred while finding the ShowCases.",
      error: error.message,
    });
  }
};

// Controller to find a ShowCase by ID
const findShowCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const showCase = await ShowCase.findById(id).populate("productId");

    if (!showCase) {
      return res.status(404).json({ message: "ShowCase not found." });
    }

    res.status(200).json({ data: showCase });
  } catch (error) {
    console.error("Error finding ShowCase:", error);
    res.status(500).json({
      message: "An error occurred while finding the ShowCase.",
      error: error.message,
    });
  }
};

// Controller to find a ShowCase by ID
const findShowCaseByfieldManagerId = async (req, res) => {
  try {
    const { fieldManagerId } = req.params;
    const showCase = await ShowCase.find({
      fieldManagerId: fieldManagerId,
    }).populate("productId");

    if (!showCase) {
      return res.status(404).json({ message: "ShowCase not found." });
    }

    res.status(200).json({ data: showCase });
  } catch (error) {
    console.error("Error finding ShowCase:", error);
    res.status(500).json({
      message: "An error occurred while finding the ShowCase.",
      error: error.message,
    });
  }
};

// Controller to update a ShowCase by ID
const updateShowCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedShowCase = await ShowCase.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedShowCase) {
      return res.status(404).json({ message: "ShowCase not found." });
    }

    res.status(200).json({
      message: "ShowCase updated successfully.",
      data: updatedShowCase,
    });
  } catch (error) {
    console.error("Error updating ShowCase:", error);
    res.status(500).json({
      message: "An error occurred while updating the ShowCase.",
      error: error.message,
    });
  }
};

// Controller to delete a ShowCase by ID
const deleteShowCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedShowCase = await ShowCase.findByIdAndDelete(id);

    if (!deletedShowCase) {
      return res.status(404).json({ message: "ShowCase not found." });
    }

    res.status(200).json({
      message: "ShowCase deleted successfully.",
      data: deletedShowCase,
    });
  } catch (error) {
    console.error("Error deleting ShowCase:", error);
    res.status(500).json({
      message: "An error occurred while deleting the ShowCase.",
      error: error.message,
    });
  }
};

//rating average rating for a  product title ShowCase fragrance tasteAndFlavor reviews

const getAverageRatingsByProductId = async (req, res) => {
  try {
    const { productId } = req.params; // Product ID from request parameters
    console.log(productId);

    // Fetch all documents that match the given productId
    const matchingDocuments = await ShowCase.find({ productId });

    if (!matchingDocuments || matchingDocuments.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching documents found for this productId" });
    }

    // Helper function to calculate average rating
    const calculateAverage = (documents, field) => {
      const ratings = documents.flatMap((doc) =>
        doc[field].map((item) => item.rating)
      );
      if (ratings.length === 0) return 0;
      const total = ratings.reduce((sum, rating) => sum + rating, 0);
      return (total / ratings.length).toFixed(2); // Rounded to 2 decimal places
    };

    // Calculate averages
    const averageFragranceRating = calculateAverage(
      matchingDocuments,
      "fragrance"
    );
    const averageTasteAndFlavorRating = calculateAverage(
      matchingDocuments,
      "tasteAndFlavor"
    );
    const averageReviewsRating = calculateAverage(matchingDocuments, "reviews");

    res.status(200).json({
      productId,
      averageFragranceRating,
      averageTasteAndFlavorRating,
      averageReviewsRating,
    });
  } catch (error) {
    console.error("Error calculating average ratings:", error);
    res.status(500).json({
      message: "An error occurred while calculating average ratings.",
      error: error.message,
    });
  }
};

const getAverageRatingsForAllProducts = async (req, res) => {
  try {
    const results = await ShowCase.aggregate([
      {
        $group: {
          _id: "$productId",
          averageFragranceRating: { $avg: { $avg: "$fragrance.rating" } },
          averageTasteAndFlavorRating: {
            $avg: { $avg: "$tasteAndFlavor.rating" },
          },
          averageReviewsRating: { $avg: { $avg: "$reviews.rating" } },
        },
      },
      {
        $lookup: {
          from: "ProductEomm", // Ensure this matches the actual collection name
          localField: "productId", // `productId` in `ShowCase`
          foreignField: "_id", // `_id` in `ProductEomm`
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.title", // Replace `title` if necessary
          productDescription: "$productDetails.description", // Replace `description` if necessary
          productPrice: "$productDetails.price", // Replace `price` if necessary
          averageFragranceRating: { $round: ["$averageFragranceRating", 2] },
          averageTasteAndFlavorRating: {
            $round: ["$averageTasteAndFlavorRating", 2],
          },
          averageReviewsRating: { $round: ["$averageReviewsRating", 2] },
        },
      },
    ]);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Enhance product details by adding additional data from `ProductEomm`
    const productDetails = await Promise.all(
      results.map(async (product) => {
        const id = product.productId;
        const productEomm = await ProductEomm.findById(id);
        const productEommDetails = productEomm ? productEomm.toObject() : null; // Add a check for null

        if (productEommDetails) {
          product.productEommDetails = productEommDetails;
        }

        return product; // Return product with added details
      })
    );

    res.status(200).json(productDetails); // Send the enriched results
  } catch (error) {
    console.error("Error calculating average ratings:", error);
    res.status(500).json({
      message: "An error occurred while calculating average ratings.",
      error: error.message,
    });
  }
};

module.exports = {
  createShowCase,
  findShowCase,
  findShowCaseById,
  updateShowCaseById,
  deleteShowCaseById,
  findShowCaseByfieldManagerId,
  getAverageRatingsByProductId,
  getAverageRatingsForAllProducts,
};
