import { InputField, SectionCard, SelectField } from "./settingsComp";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/card";
import { Edit3, Upload } from "@/public/icons/icons";
import { Input } from "@/components/ui/input";

export const BusinessInformation = ({
  businessName,
  setBusinessName,
  businessType,
  setBusinessType,
}) => (
  <SectionCard title="Business Information">
    <div className="space-y-4">
      <InputField
        label="Business name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        maxLength={50}
      />

      <SelectField
        label="Business Type"
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        options={["Restaurant", "Club", "Hotel"]}
      />
    </div>
  </SectionCard>
);

export const BusinessLogo = ({ value, onChange }) => {
  const [uploadImageLoading, setUploadImageLoading] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleImageUpload = async (files) => {
    setUploadImageLoading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
      );
      const imageUrl = response.data.secure_url;
      onChange(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploadImageLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Business Logo</h2>
        <Edit3 className="w-5 h-5 text-slate-400 cursor-pointer" />
      </div>
      <div className="flex gap-6 items-start">
        {value ? (
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={value}
              alt="Business Logo"
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
            <Upload className="w-8 h-8 text-slate-400" />
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-4">
            Upload a logo on your profile and customer facing pages
          </p>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleImageUpload(e.target.files)
            }
            className="hidden"
            disabled={uploadImageLoading}
            id="image-upload"
          />
          <label htmlFor="image-upload" className="px-4 py-2 border cursor-pointer border-[#94A3B8] rounded-lg text-sm font-medium text-teal-700 bg-teal-50/50 hover:bg-teal-50 transition-colors">
            {uploadImageLoading ? "Uploading..." : "Browse Files"}
          </label>
          <p className="text-[11px] text-slate-400 mt-3">
            Recommended size: 400×400px. Max file size: 2MB.
          </p>
        </div>
      </div>
    </Card>
  );
};
