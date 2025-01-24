import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faStar as faStarOutline,
} from "@fortawesome/free-solid-svg-icons";

const StarRating = ({ rating }) => {
  const clampedRating = Math.min(Math.max(rating, 0), 10); // Clamp the rating between 0 and 5
  const fullStars = Math.floor(clampedRating); // Number of full stars
  const hasHalfStar = clampedRating % 1 >= 0.5; // Check if half star is needed
  const emptyStars = 5 - Math.ceil(clampedRating); // Remaining empty stars

  return (
    <div className="flex items-center">
      {/* Full Stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <FontAwesomeIcon
            key={`full-${index}`}
            icon={faStar}
            className="text-yellow-400"
          />
        ))}
      {/* Half Star */}
      {hasHalfStar && (
        <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-400" />
      )}
      {/* Empty Stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <FontAwesomeIcon
            key={`empty-${index}`}
            icon={faStarOutline}
            className="text-gray-300"
          />
        ))}
    </div>
  );
};

export default StarRating;
