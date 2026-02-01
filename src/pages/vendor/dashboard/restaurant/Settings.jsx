import DashboardLayout from "@/components/layout/DashboardLayout";
import TagInput from "@/components/TagInput";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Clock, DollarSign, Globe, Phone, Tag } from "lucide-react";
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
         const user = await authService.vendorUpdate(formData)
         dispatch(setVendor(user?.vendor)); 
         toast.success("Succesfully updated settings!");
      } catch (error) {
         console.error("Error updating settings:", error);
         toast.error("Failed to update settings. Please try again.");
      } finally {
         setIsLoading(false);
      }
   }

   return (

      <DashboardLayout type={vendor?.vendorType} section="settings" settings={true}>
         <div className="min-h-screen ">
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="flex items-center gap-3 mb-6">
                  {/* <Utensils className="w-8 h-8 text-[#0A6C6D]" /> */}
                  <h1 className="text-xl font-bold text-gray-900">Restaurant Settings</h1>
               </div>
               <div className="md:w-[49%]">
                  <BusinessLogo value={formData.logo} onChange={(value) => updateField('logo', value)} />
               </div>

               {/* Business Information */}
               <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                     <Building2 className="w-5 h-5 text-[#0A6C6D]" />
                     Business Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input
                        label="Business Name"
                        value={formData.businessName}
                        onChange={(e) => updateField('businessName', e.target.value)}
                     />
                     <Input
                        label="Phone"
                        icon={Phone}
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                     />
                  </div>
                  <Input
                     label="Website"
                     icon={Globe}
                     placeholder="https://yourwebsite.com"
                     value={formData.website}
                     onChange={(e) => updateField('website', e.target.value)}
                  />
                  <Textarea
                     label="Business Description"
                     placeholder="Tell customers what makes your restaurant special..."
                     value={formData.businessDescription}
                     onChange={(e) => updateField('businessDescription', e.target.value)}
                  />
                  <Textarea
                     label="Address"
                     placeholder="Enter your complete business address..."
                     value={formData.address}
                     onChange={(e) => updateField('address', e.target.value)}
                  />
               </Card>

               {/* Operating Hours */}
               <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                     <Clock className="w-5 h-5 text-[#0A6C6D]" />
                     Operating Hours
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input
                        type="time"
                        label="Opening Time"
                        value={formData.openingTime}
                        onChange={(e) => updateField('openingTime', e.target.value)}
                     />
                     <Input
                        type="time"
                        label="Closing Time"
                        value={formData.closingTime}
                        onChange={(e) => updateField('closingTime', e.target.value)}
                     />
                  </div>
               </Card>

               {/* Pricing */}
               <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                     <DollarSign className="w-5 h-5 text-[#0A6C6D]" />
                     Pricing & Offers
                  </h2>
                  <Input
                     type="number"
                     label="Average Price Range (₦)"
                     value={formData.priceRange}
                     onChange={(e) => updateField('priceRange', Number(e.target.value))}
                  />
                  <Input
                     label="Special Offers"
                     placeholder="e.g., 20% off first booking"
                     value={formData.offer}
                     onChange={(e) => updateField('offer', e.target.value)}
                  />
               </Card>

               {/* Action Buttons */}
               <div className="flex justify-end gap-3">
                  <button onClick={() => setFormData(vendor)} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                     Reset
                  </button>
                  <button disabled={isLoading} onClick={handleSubmit} className="px-6 py-2 bg-[#0A6C6D] text-white rounded-md hover:bg-[#085555] transition-colors">
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};

export default RestaurantSettings