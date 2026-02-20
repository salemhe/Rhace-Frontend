"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const HotelOverview = ({ desc }) => {
  const [showMore, setShowMore] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 100);
    }
  }, []);

  return (
    <div className="space-y-6 text-sm md:text-base">
      <div>
        <h2 className="font-semibold sm:text-lg  text-sm">About Hotel</h2>
        <div
          ref={contentRef}
          className={cn(
            "transition-all overflow-hidden",
            showMore ? "max-h-[5000px]" : "max-h-[90px]",
          )}
        >
          <p className="text-gray-700 text-sm leading-relaxed">
            {desc.split("  ").map((part, idx) => (
              <span key={idx}>{part}</span>
            ))}
          </p>
        </div>
        {isOverflowing && (
          <button
            className="mt-2 flex items-center gap-1 text-sm text-[#0A6C6D] hover:underline cursor-pointer"
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore ? "Show less" : "Show more"}
            {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default HotelOverview;
