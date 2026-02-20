import React from "react";
import { Heart, Share2Icon } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { FavoriteButton3 } from "./favoriteButton";

const SaveCopy = ({ id, type, vendor }) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(
        `https://rhace-frontend.vercel.app/${type}/${id}`
      )
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => {
        toast.error("Failed to copy.");
      });
  };
  return (
    <div className="gap-4 hidden md:flex">
      <Button onClick={handleCopy} variant="outline" className="rounded-xl cursor-pointer">
        <Share2Icon />
        Share
      </Button>
      <FavoriteButton3 vendor={vendor} />
    </div>
  );
};

export default SaveCopy;
