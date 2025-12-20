import { Building2 } from "lucide-react";
import { InputField, SectionCard, SelectField } from "./settingsComp";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export const BusinessInformation = ({ businessName, setBusinessName, businessType, setBusinessType }) => (

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
        options={['Restaurant', 'Club', 'Hotel']}
      />
    </div>
  </SectionCard>
);

export const BusinessLogo = ({ value, onChange }) => {
  const [uploadImageLoading, setUploadImageLoading] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const handleImageUpload = async (files) => {
    setUploadImageLoading(true)
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData)
      const imageUrl = response.data.secure_url;
      onChange(imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadImageLoading(false)
    }
  };

  return (
    <SectionCard title="Business Logo">
      <div className="flex items-start gap-6">
        {value ? (
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img src={value} alt="Business Logo" className="object-cover w-full h-full" />
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-3">
            Upload a logo on your profile and customer facing pages
          </p>
          {/* <button onChange={onChange} className="px-4 py-2 text-sm text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
          Browse Files
        </button> */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            className="hidden"
            disabled={uploadImageLoading}
            id="image-upload"
          />
          <Button variant="outline" asChild>
            <label htmlFor="image-upload" className="cursor-pointer">
              {uploadImageLoading ? "Uploading..." : "Browse Files"}
            </label>
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Recommended size: 400×400px. Max file size: 2MB.
          </p>
        </div>
      </div>
    </SectionCard>



  )
};