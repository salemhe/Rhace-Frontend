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
import { MailIcon, PhoneIcon } from "lucide-react";
import { BusinessLogo } from "../../settings/part/BusinessInfo";

const RestaurantSettings = () => {
  const vendor = useSelector((state) => state.auth.vendor);
  const [formData, setFormData] = useState(vendor);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(vendor?.logo || null);
  const dispatch = useDispatch();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (typeof formData.phone === "string" && !/^\+?[0-9\s\-()]{7,}$/.test(formData.phone)) {
        toast.error("Please enter a valid phone number.");
        setIsLoading(false);
        return;
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }
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
    <DashboardLayout type={vendor?.vendorType} section="settings" settings={true}>
      <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Main Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Business Info */}
            <div className="space-y-8">
              <Card className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">Business Information</h2>
                  <Edit3 className="w-5 h-5 text-slate-400 cursor-pointer" />
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wider">Business name</label>
                    <div className="relative">
                      <Input 
                        value={formData.businessName}
                        onChange={(e) => updateField("businessName", e.target.value)}
                        className="bg-[#F8FAFC] border-slate-200 h-12 focus:bg-white transition-all"
                      />
                      <span className="absolute right-3 top-3 text-[10px] text-slate-400">0/50</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Logo Upload Section */}
              <BusinessLogo value={value} onChange={e => {
                 setValue(e);
                  updateField("logo", e);
                }} />
            </div>

            {/* Right Column: Contact Info */}
            <div className="space-y-8">
              <Card className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm h-fit">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-slate-800">Contact Information</h2>
                  <Edit3 className="w-5 h-5 text-slate-400 cursor-pointer" />
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wider">Support Contact Email<span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Input 
                        value={formData.email}
                        className="bg-[#F8FAFC] border-slate-200 h-12 pl-4 pr-10"
                        onChange={(e) => updateField("email", e.target.value)}
                      />
                      <MailIcon className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block uppercase tracking-wider">Support Phone Number<span className="text-red-500">*</span></label>
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

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-10 border-t border-slate-200">
            <button 
              onClick={() => setFormData(vendor)}
              className="px-8 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold bg-white hover:bg-slate-50 transition-all"
            >
              Reset to Default
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0D635D] transition-all shadow-md active:scale-95 disabled:opacity-70"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantSettings;