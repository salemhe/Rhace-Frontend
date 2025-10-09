"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Upload, X } from "lucide-react";
import { useState } from "react";


export function HotelSetupForm ({ formData, setFormData }) {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, hotelCategory: category });
  };

  // Drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...newFiles],
      });
      setPreviewUrls((prev) => [
        ...prev,
        ...newFiles.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...newFiles],
      });
      setPreviewUrls((prev) => [
        ...prev,
        ...newFiles.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  // Remove an image
  const handleRemoveImage = (index) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });

    setPreviewUrls((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6 rounded-lg border p-8 bg-white">
          {/* Hotel Name */}
          <div className="space-y-2">
            <Label htmlFor="hotelName">Hotel name<span className="text-red-500">*</span></Label>
            <Input
              id="hotelName"
              placeholder="Enter hotel name"
              value={formData.hotelName}
              onChange={(e) => handleInputChange("hotelName", e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number<span className="text-red-500">*</span></Label>
            <div className="flex gap-2">
              <Select
                value={formData.countryCode}
                onValueChange={(value) => handleInputChange("countryCode", value)}
              >
                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="+234">+234</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                  <SelectItem value="+91">+91</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address<span className="text-red-500">*</span></Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="Enter email address"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange("emailAddress", e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address<span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="Search for address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="pr-10"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Additional Address */}
          <Textarea
            placeholder="Additional address detail"
            value={formData.additionalAddressDetail}
            onChange={(e) => handleInputChange("additionalAddressDetail", e.target.value)}
            className="min-h-[80px] resize-none"
          />

          {/* Branch Code */}
          <div className="space-y-2">
            <Label htmlFor="branchCode">Branch Code<span className="text-red-500">*</span></Label>
            <div className="flex gap-2">
              <Input id="branchCode" value={formData.branchCode} readOnly className="flex-1" />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleInputChange("branchCode", `HTL-${Math.floor(Math.random() * 100000)}`)}
              >
                Edit
              </Button>
            </div>
          </div>


        </div>

        {/* Right Column */}
        <div className="space-y-6 rounded-lg border p-8 bg-white h-max">
          {/* Multiple Images Upload */}
          <div className="space-y-2">
            <Label>Logo/Cover Image <span className="text-gray-400">(Optional)</span></Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-gray-600 text-sm">
                  Drag and drop images here, or
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  Browse Files
                </Button>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-gray-500">
                  JPG, PNG OR GIF • Max 5MB each
                </p>
              </div>
            </div>

            {/* Thumbnails */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hotel Type */}
          <div className="space-y-2">
            <Label>Hotel Type<span className="text-red-500">*</span></Label>
            <Select
              value={formData.hotelType}
              onValueChange={(value) => handleInputChange("hotelType", value)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
                <SelectItem value="Resort">Resort</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hotel Category */}
          <div className="space-y-3">
            <Label>Hotel category</Label>
            <div className="flex gap-2">
              {(["Standard", "Luxury", "Business"]).map(
                (category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={
                      formData.hotelCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategorySelect(category)}
                    className={
                      formData.hotelCategory === category
                        ? "bg-teal-100 text-teal-700 border-teal-200"
                        : "text-gray-600"
                    }
                  >
                    {category}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}