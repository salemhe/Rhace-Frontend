import { InputField, SectionCard, SelectField } from "./settingsComp";
import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/card";
import { Edit3, Upload } from "@/public/icons/icons";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2, ImageIcon } from "lucide-react";

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

export const BusinessLogo = ({ value, onChange, images = [], onImagesChange }) => {
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleLogoUpload = async (files) => {
    if (!files[0]) return;
    setUploadImageLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("upload_preset", UPLOAD_PRESET);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      onChange(response.data.secure_url);
    } catch (error) {
      console.error("Logo upload failed:", error);
    } finally {
      setUploadImageLoading(false);
    }
  };

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );
        return res.data.secure_url;
      });

      const newUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newUrls]);
    } catch (error) {
      console.error("Gallery upload failed:", error);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const removeImage = (urlToRemove) => {
    onImagesChange(images.filter((url) => url !== urlToRemove));
  };

  return (
    <Card className="p-6 space-y-10 bg-white border border-slate-200 rounded-xl shadow-none">
      {/* SECTION: HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Business Assets
        </h2>
        <Edit3 className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
      </div>

      {/* SECTION: LOGO UPLOAD */}
      <div className="space-y-4">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
          Business Logo
        </label>
        <div className="flex gap-8 items-center">
          <div className="relative group">
            {value ? (
              <div className="w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
                <img src={value} alt="Logo" className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-teal-400 transition-colors">
                <Upload className="w-8 h-8 text-slate-300" />
              </div>
            )}
          </div>

          <div className="flex-1 max-w-sm">
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Your logo will appear on your profile, search results, and customer-facing booking pages.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleLogoUpload(e.target.files)}
              className="hidden"
              disabled={uploadImageLoading}
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-teal-600 rounded-xl text-sm font-semibold text-teal-700 bg-white hover:bg-teal-50 transition-all cursor-pointer disabled:opacity-50"
            >
              {uploadImageLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {value ? "Change Logo" : "Upload Logo"}
            </label>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION: PROPERTY PHOTOS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em]">
            Property Photos
          </label>
          <div className={`text-xs font-bold px-3 py-1 rounded-full ${images.length >= 5 ? 'bg-teal-50 text-teal-700' : 'bg-orange-50 text-orange-600'}`}>
            {images.length} / 24
          </div>
        </div>

          <div className="flex-1">
             <p className="text-sm text-slate-500 leading-relaxed mb-4">
              {images.length < 5
                ? `Upload at least 5 photos of your property. You need ${5 - images.length} more to go live.`
                : "Photos uploaded successfully. These will be displayed in your property gallery."}
            </p>
          </div>
        <div className="grid grid-cols-1 gap-6 items-start">

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {images.map((url, index) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm group"
                >
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/90 hover:bg-white rounded-full shadow-md text-rose-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {images.length < 24 && (
              <label className="relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-teal-400 hover:bg-teal-50/30 cursor-pointer transition-all">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagesUpload}
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Plus className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Add</span>
                  </div>
                )}
              </label>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};