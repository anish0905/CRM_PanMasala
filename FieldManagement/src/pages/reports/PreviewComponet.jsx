import React from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Import a close icon from React Icons

export const PreviewComponent = ({ selectPreviewData, selectedProduct, onClose }) => {
  const URI = import.meta.env.VITE_API_URL;

  // Calculate the average of an array of ratings
  const calculateAverage = (ratings) => {
    if (!ratings || ratings.length === 0) return null;
    const total = ratings.reduce((sum, { rating }) => sum + rating, 0);
    return total / ratings.length; // Return raw average
  };

  // Calculate averages for each category
  const fragranceAvg = calculateAverage(
    selectPreviewData?.review?.data?.fragrance
  );
  const tasteAndFlavorAvg = calculateAverage(
    selectPreviewData?.review?.data?.tasteAndFlavor
  );
  const kickAndHighAvg = calculateAverage(
    selectPreviewData?.review?.data?.reviews
  );

  // Calculate the combined average of all three
  const combinedAverage =
    [fragranceAvg, tasteAndFlavorAvg, kickAndHighAvg]
      .filter((avg) => avg !== null) // Exclude null values
      .reduce((sum, avg) => sum + avg, 0) /
    [fragranceAvg, tasteAndFlavorAvg, kickAndHighAvg].filter(
      (avg) => avg !== null
    ).length;

  // Format the combined average for display
  const formattedCombinedAverage = combinedAverage
    ? combinedAverage.toFixed(1)
    : "N/A";

  // Render stars for ratings
  const renderStars = (rating) => {
    const maxRating = 10;
    const filledStarsCount = Math.floor(rating); // Full stars
    const fractionalPart = rating % 1; // Fractional part for partial fill
    const emptyStarsCount =
      maxRating - filledStarsCount - (fractionalPart > 0 ? 1 : 0); // Remaining empty stars

    // Create a function to apply styles dynamically for the fractional star
    const starStyle = (percentage) => ({
      display: "inline-block",
      position: "relative",
      width: "1em",
      height: "1em",
      background: `linear-gradient(90deg, #facc15 ${percentage}%, #e5e7eb ${percentage}%)`,
      WebkitBackgroundClip: "text",
      color: "transparent",
    });

    const filledStars = Array.from({ length: filledStarsCount }, (_, i) => (
      <span
        key={`filled-${i}`}
        className="text-yellow-500"
        title={`Rating: ${rating.toFixed(1)}`} // Tooltip for filled stars
      >
        ★
      </span>
    ));

    const halfStar = fractionalPart > 0 && (
      <span
        key="half"
        style={starStyle(fractionalPart * 100)}
        className="text-gray-400 text-2xl"
        title={`Rating: ${rating.toFixed(1)}`} // Tooltip for half star
      >
        ★
      </span>
    );

    const emptyStars = Array.from({ length: emptyStarsCount }, (_, i) => (
      <span
        key={`empty-${i}`}
        className="text-gray-400"
        title={`Rating: ${rating.toFixed(1)}`} // Tooltip for empty stars
      >
        ☆
      </span>
    ));

    return (
      <span className="text-2xl cursor-pointer">
        {filledStars}
        {halfStar}
        {emptyStars}
      </span>
    );
  };

  return (
    <div className="w-full relative">
      <img
        src={`${URI}/uploads/${selectedProduct?.image}`}
        alt={selectedProduct?.title}
        className="w-full h-60 object-contain pt-4"
      />
      <div className="p-3 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-semibold text-center">
            {selectedProduct?.title}
          </h2>
        </div>
      </div>
      <div className="text-lg text-gray-700 text-center mt-4">
        <p>
          {selectPreviewData?.review?.data?.productSimilarity || "N/A"}
        </p>
        <p>
          Fragrance Rating
          <br />
          {/* <span className="block font-semibold">
            Average: {fragranceAvg ? fragranceAvg.toFixed(1) : "N/A"}
          </span> */}
          {selectPreviewData?.review?.data?.fragrance?.map((f, index) => (
            <span key={index} className="inline-block mr-2">
              {renderStars(f.rating)}
            </span>
          )) || " N/A"}
        </p>
        <p>
          Taste and Flavor Rating
          <br />
          {/* <span className="block font-semibold">
            Average: {tasteAndFlavorAvg ? tasteAndFlavorAvg.toFixed(1) : "N/A"}
          </span> */}
          {selectPreviewData?.review?.data?.tasteAndFlavor?.map((t, index) => (
            <span key={index} className="inline-block mr-2">
              {renderStars(t.rating)}
            </span>
          )) || " N/A"}
        </p>
        <p>
          Kick and High
          <br />
          {/* <span className="block font-semibold">
            Average: {kickAndHighAvg ? kickAndHighAvg.toFixed(1) : "N/A"}
          </span> */}
          {selectPreviewData?.review?.data?.reviews?.map((r, index) => (
            <span key={index} className="inline-block mr-2 text-2xl">
              {renderStars(r.rating)}
            </span>
          )) || " N/A"}
        </p>
        <p>
          <span className="font-bold text-xl">
            Average Reating: {formattedCombinedAverage}
          </span>
        </p>
      </div>
    </div>
  );
};
