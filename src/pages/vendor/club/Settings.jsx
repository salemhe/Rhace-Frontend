import DashboardLayout from "@/components/layout/DashboardLayout";
import TagInput from "@/components/TagInput";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Clock, DollarSign, Globe, Phone, Tag } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BusinessLogo } from "../settings/part/BusinessInfo";

const ClubSettings = () => {
   const [formData, setFormData] = useState({
      businessName: 'Elite Club',
      description: '',
      phone: '+234 000 111 234',
      website: '',
      address: '',
      priceRange: 5000,
      offer: '',
      openingTime: '20:00',
      closingTime: '04:00',
      slots: 100,
      categories: ['Nightclub', 'Lounge'],
      dressCode: ['Smart Casual', 'No Sneakers'],
      ageLimit: '18',
   });

   const updateField = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const vendor = useSelector((state) => state.auth.vendor);
   const addTag = (field, value) => {
      setFormData((prev) => ({
         ...prev,
         [field]: [...prev[field], value],
      }));
   };

   const removeTag = (field, value) => {
      setFormData((prev) => ({
         ...prev,
         [field]: prev[field].filter((item) => item !== value),
      }));
   };

   return (
      <DashboardLayout type={vendor?.vendorType} section="settings" settings={true}>
         <div className="min-h-screen ">
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="flex items-center gap-3 mb-6">
                  {/* <Music className="w-8 h-8 text-[#0A6C6D]" /> */}
                  <h1 className="text-xl font-bold text-gray-900">Club Settings</h1>
               </div>
               <div className="md:w-[49%]">
                        <BusinessLogo />
                     </div>

               {/* Business Information */}
               <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                     <Building2 className="w-5 h-5 text-[#0A6C6D]" />
                     Business Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input
                        label="Club Name"
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
                     placeholder="https://yourclub.com"
                     value={formData.website}
                     onChange={(e) => updateField('website', e.target.value)}
                  />
                  <Textarea
                     label="Club Description"
                     placeholder="Describe your club's atmosphere and entertainment..."
                     value={formData.description}
                     onChange={(e) => updateField('description', e.target.value)}
                  />
                  <Textarea
                     label="Address"
                     placeholder="Enter your club's complete address..."
                     value={formData.address}
                     onChange={(e) => updateField('address', e.target.value)}
                  />
               </Card>

               {/* Operating Hours & Capacity */}
               <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                     <Clock className="w-5 h-5 text-[#0A6C6D]" />
                     Operating Hours & Capacity
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                     <Input
                        type="number"
                        label="Available Slots"
                        value={formData.slots}
                        onChange={(e) => updateField('slots', Number(e.target.value))}
                     />
                  </div>
               </Card>

               {/* Club Details */}
               <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                     <Tag className="w-5 h-5 text-[#0A6C6D]" />
                     Club Details
                  </h2>
                  <TagInput
                     label="Categories"
                     placeholder="Add categories (e.g., Nightclub, Lounge)"
                     tags={formData.categories}
                     onAdd={(value) => addTag('categories', value)}
                     onRemove={(value) => removeTag('categories', value)}
                  />
                  <TagInput
                     label="Dress Code"
                     placeholder="Add dress code (e.g., Smart Casual)"
                     tags={formData.dressCode}
                     onAdd={(value) => addTag('dressCode', value)}
                     onRemove={(value) => removeTag('dressCode', value)}
                  />
                  <Select
                     label="Age Limit"
                     value={formData.ageLimit}
                     onChange={(e) => updateField('ageLimit', e.target.value)}
                     options={[
                        { value: '16', label: '16 years and above' },
                        { value: '18', label: '18 years and above' },
                        { value: '21', label: '21 years and above' },
                     ]}
                  />
               </Card>

               {/* Pricing */}
               <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                     <DollarSign className="w-5 h-5 text-[#0A6C6D]" />
                     Pricing & Offers
                  </h2>
                  <Input
                     type="number"
                     label="Entry Fee (₦)"
                     value={formData.priceRange}
                     onChange={(e) => updateField('priceRange', Number(e.target.value))}
                  />
                  <Input
                     label="Special Offers"
                     placeholder="e.g., Ladies night free entry, VIP packages"
                     value={formData.offer}
                     onChange={(e) => updateField('offer', e.target.value)}
                  />
               </Card>

               {/* Action Buttons */}
               <div className="flex justify-end gap-3">
                  <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                     Reset
                  </button>
                  <button className="px-6 py-2 bg-[#0A6C6D] text-white rounded-md hover:bg-[#085555] transition-colors">
                     Save Changes
                  </button>
               </div>
            </div>
         </div>
      </DashboardLayout>
   );
};
export default ClubSettings