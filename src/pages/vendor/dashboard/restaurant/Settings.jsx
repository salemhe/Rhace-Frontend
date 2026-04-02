// RestaurantSettings.tsx
import DashboardLayout from "@/components/layout/DashboardLayout";
import TagInput from "@/components/TagInput";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Clock, DollarSign, Globe, Phone, Tag, Save, RotateCcw, UtensilsCrossed, MapPin, Briefcase, Sparkles } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BusinessLogo } from "../../settings/part/BusinessInfo";
import { authService } from "@/services/auth.service";
import { setVendor } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";

const RestaurantSettings = () => {
  const vendor = useSelector((state) => state.auth.vendor);
  const [formData, setFormData] = useState(vendor);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const user = await authService.vendorUpdate(formData);
      dispatch(setVendor(user?.vendor));
      toast.success("Successfully updated settings!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(vendor);
    toast.info("Changes have been reset");
  };

  return (
    <DashboardLayout type={vendor?.vendorType} section="settings" settings={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Restaurant Settings
              </h1>
            </div>
            <p className="text-slate-500 ml-12">
              Manage your restaurant profile, business hours, and pricing information
            </p>
          </div>

          {/* Logo Section */}
          <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Brand Identity</h3>
            </div>
            <BusinessLogo value={formData.logo} onChange={(value) => updateField("logo", value)} />
          </div>

          <div className="grid gap-6">
            {/* Business Information Card */}
            <Card className="group border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/30">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-emerald-700" />
                    </div>
                    Business Information
                  </h2>
                  <div className="text-xs text-slate-400 font-mono">Essential details</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Business Name"
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <Input
                    label="Phone Number"
                    icon={Phone}
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>

                <Input
                  label="Website"
                  icon={Globe}
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />

                <div className="space-y-6">
                  <Textarea
                    label="Business Description"
                    placeholder="Tell customers what makes your restaurant special..."
                    value={formData.businessDescription}
                    onChange={(e) => updateField("businessDescription", e.target.value)}
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all min-h-[100px]"
                  />
                  <Textarea
                    label="Address"
                    icon={MapPin}
                    placeholder="Enter your complete business address..."
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </Card>

            {/* Operating Hours Card */}
            <Card className="group border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/30">
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Clock className="w-5 h-5 text-emerald-700" />
                    </div>
                    Operating Hours
                  </h2>
                  <div className="text-xs text-slate-400 font-mono">Daily schedule</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="time"
                    label="Opening Time"
                    value={formData.openingTime}
                    onChange={(e) => updateField("openingTime", e.target.value)}
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <Input
                    type="time"
                    label="Closing Time"
                    value={formData.closingTime}
                    onChange={(e) => updateField("closingTime", e.target.value)}
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </Card>

            {/* Pricing & Offers Card */}
            <Card className="group border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/30">
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-700" />
                    </div>
                    Pricing & Offers
                  </h2>
                  <div className="text-xs text-slate-400 font-mono">Revenue settings</div>
                </div>
                <div className="space-y-6">
                  <Input
                    type="number"
                    label="Average Price Range (₦)"
                    value={formData.priceRange}
                    onChange={(e) => updateField("priceRange", Number(e.target.value))}
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <Input
                    label="Special Offers"
                    placeholder="e.g., 20% off first booking, Free dessert on weekends"
                    value={formData.offer}
                    onChange={(e) => updateField("offer", e.target.value)}
                    className="focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6 pb-8">
              <button
                onClick={handleReset}
                className="group px-6 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-medium bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-[-180deg] duration-300" />
                Reset
              </button>
              <button
                disabled={isLoading}
                onClick={handleSubmit}
                className="group px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 transition-transform group-hover:scale-110 duration-200" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantSettings;