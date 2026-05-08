import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "@/services/auth.service";
import { setVendor } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import { Edit3, Upload } from "@/public/icons/icons"; // Using requested icon path
import { Lock, MailIcon, PhoneIcon, Plus, Trash2 } from "lucide-react";
import { BusinessLogo } from "../../settings/part/BusinessInfo";
import { vendorSettingsConfig } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";

const RestaurantSettings = () => {
  const vendor = useSelector((state) => state.auth.vendor);
  const [formData, setFormData] = useState(vendor);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [value, setValue] = useState(vendor?.logo || null);
  const [images, setImages] = useState(vendor?.profileImages || []);
  const [policies, setPolicies] = useState(formData?.policies && formData.policies.length > 0 ? formData.policies : [""]); // Start with one empty input

  // Update a specific input field
  const handleInputChange = (index, value) => {
    const newPolicies = [...policies];
    newPolicies[index] = value;
    setPolicies(newPolicies);
    updateField("policies", newPolicies);
  };

  // Add a new empty input field
  const addInputField = () => {
    setPolicies([...policies, ""]);
  };

  // Remove a specific input field
  const removeInputField = (index) => {
    // Keep at least one input box
    if (policies.length > 1) {
      const newPolicies = policies.filter((_, i) => i !== index);
      setPolicies(newPolicies);
    }
  };
  const dispatch = useDispatch();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const currentVendor =
    vendorSettingsConfig.find((v) => v.vendorType === vendor?.vendorType) ||
    vendorSettingsConfig[3];

  console.log("Current Vendor Config:", currentVendor.categories);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (
        typeof formData.phone === "string" &&
        !/^\+?[0-9\s\-()]{7,}$/.test(formData.phone)
      ) {
        toast.error("Please enter a valid phone number.");
        setIsLoading(false);
        return;
      }
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        toast.error("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }
      setFormData({ email: vendor.email, ...formData });
      const user = await authService.vendorUpdate(formData, vendor._id);
      dispatch(setVendor(user?.vendor));
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      type={vendor?.vendorType}
      section="settings"
      settings={true}
    >
      <div className="bg-[#F9FAFB] p-2 md:p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Main Grid Content */}
          <div className="flex items-center gap-1 py-4 overflow-x-auto no-scrollbar">
            {currentVendor.categories.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() =>
                    !section.disabled && setActiveSection(section.id)
                  }
                  disabled={section.disabled}
                  className={`
                  group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
                  disabled:opacity-30 disabled:cursor-not-allowed
                `}
                >
                  <section.icon
                    className={`size-4 ${isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`}
                  />

                  {section.label}

                  {/* Subtle Lock indicator for disabled items instead of a red dot */}
                  {section.disabled && (
                    <div className="absolute -top-1 -right-1">
                      <Lock className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {activeSection === "general" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Business Info */}
              <div className="space-y-8">
                <Card className="p-4 shadow-none bg-white border border-slate-200 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Business Information
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wider">
                        Business name
                      </label>
                      <div className="relative">
                        <Input
                          value={formData.businessName}
                          onChange={(e) =>
                            updateField("businessName", e.target.value)
                          }
                          maxLength={50}
                          className="bg-[#F8FAFC] border-slate-200 h-12 focus:bg-white transition-all"
                        />
                        <span className="absolute right-3 top-3 text-[10px] text-slate-400">
                          {formData.businessName.length}/50
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wider">
                        Business description
                      </label>
                      <div className="relative">
                        <Textarea
                          value={formData.businessDescription}
                          onChange={(e) =>
                            updateField("businessDescription", e.target.value)
                          }
                          maxLength={1000}
                          className="bg-[#F8FAFC] h-48 border-slate-200 focus:bg-white transition-all"
                        ></Textarea>
                        <span className="absolute right-3 top-3 text-[10px] text-slate-400">
                          {formData.businessDescription.length}/1000
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Logo Upload Section */}
                <BusinessLogo
                  value={value}
                  onChange={(e) => {
                    setValue(e);
                    updateField("logo", e);
                  }}
                  images={images}
                  onImagesChange={(e) => {
                    setImages(e);
                    updateField("profileImages", e);
                  }}
                />
              </div>

              {/* Right Column: Contact Info */}
              <div className="space-y-8">
                <Card className="p-4 shadow-none bg-white border border-slate-200 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Contact Information
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wider">
                        Support Contact Email
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          value={formData.email}
                          className="bg-[#F8FAFC] border-slate-200 h-12 pl-4 pr-10"
                          onChange={(e) => updateField("email", e.target.value)}
                          disabled
                        />
                        <MailIcon className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wider">
                        Support Phone Number
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          value={formData.phone}
                          className="bg-[#F8FAFC] border-slate-200 h-12 pl-4 pr-10"
                          onChange={(e) => updateField("phone", e.target.value)}
                        />
                        <PhoneIcon className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "policies" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card className="p-4 shadow-none bg-white border border-slate-200 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Policies
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wider">
                        Room Policies
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        {policies.map((input, index) => (
                          <div key={index} className="flex items-center w-full gap-2">
                            <div className="relative w-full">
                            <Input
                              type="text"
                              value={input}
                              placeholder={`Item ${index + 1}`}
                              onChange={(e) =>
                                handleInputChange(index, e.target.value)
                              }
                              className="bg-[#F8FAFC] border-slate-200 h-12 w-full focus:bg-white transition-all"
                            />
                            </div>
                              <button
                                onClick={() => removeInputField(index)}
                                className="p-2 text-red-500 disabled:text-red-300 hover:bg-red-50 rounded-md transition"
                                title="Remove"
                                disabled={policies.length === 1}
                              >
                                <Trash2 size={18} />
                              </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={addInputField}
                        className="flex items-center justify-center w-full gap-2 p-2 mt-4 text-slate-600 rounded-xl border hover:border-gray-500 hover:text-gray-800 border-dashed transition font-medium"
                      >
                        <Plus size={18} /> Add Another
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-10 border-slate-200">
            <button
              onClick={() => setFormData(vendor)}
              className="px-8 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold bg-white hover:bg-slate-50 transition-all"
            >
              Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0D635D] transition-all shadow-md active:scale-95 disabled:opacity-70"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantSettings;
