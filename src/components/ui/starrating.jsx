import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, onChange, size = 24, readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => {
        // Calculate how "filled" this star should be (1 = full, 0.5 = half, etc.)
        const fillLevel = Math.max(0, Math.min(1, rating - star + 1));

        return (
          <div
            key={star}
            className={`relative ${!readOnly ? "cursor-pointer" : ""}`}
            onClick={() => !readOnly && onChange && onChange(star)}
            style={{ width: size, height: size }}
          >
            {/* Empty star (gray outline) */}
            <Star
              size={size}
              className="text-gray-300 absolute top-0 left-0"
              strokeWidth={1.5}
            />

            {/* Filled star — masked according to decimal fill */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{
                width: `${fillLevel * 100}%`,
                height: "100%",
              }}
            >
              <Star
                size={size}
                className="fill-[#F0AE02] text-[#F0AE02]"
                strokeWidth={1.5}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
