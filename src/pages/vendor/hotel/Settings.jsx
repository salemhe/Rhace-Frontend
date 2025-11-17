import DashboardLayout from "@/components/layout/DashboardLayout";
import TagInput from "@/components/TagInput";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Clock, DollarSign, Globe, Phone, Tag } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BusinessLogo } from "../settings/part/BusinessInfo";


const HotelSettings = () => {
   const [formData, setFormData] = useState({
      businessName: 'Grand Hotel',
      description: '',
      phone: '+234 000 111 234',
      website: '',
      address: '',
      priceRange: 15000,
      offer: '',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      amenities: ['WiFi', 'Pool', 'Gym'],
      roomTypes: ['Standard', 'Deluxe', 'Suite'],
   });

   const vendor = useSelector((state) => state.auth.vendor);
   const updateField = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

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
               {/* <Building2 className="w-8 h-8 text-[#0A6C6D]" /> */}
               <h1 className="text-3xl font-bold text-gray-900">Hotel Settings</h1>
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
                     label="Hotel Name"
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
                  placeholder="https://yourhotel.com"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
               />
               <Textarea
                  label="Hotel Description"
                  placeholder="Describe your hotel's unique features..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
               />
               <Textarea
                  label="Address"
                  placeholder="Enter your hotel's complete address..."
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
               />
            </Card>

            {/* Check-in/Out Times */}
            <Card className="p-6 space-y-4">
               <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#0A6C6D]" />
                  Check-in & Check-out
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                     type="time"
                     label="Check-in Time"
                     value={formData.checkInTime}
                     onChange={(e) => updateField('checkInTime', e.target.value)}
                  />
                  <Input
                     type="time"
                     label="Check-out Time"
                     value={formData.checkOutTime}
                     onChange={(e) => updateField('checkOutTime', e.target.value)}
                  />
               </div>
            </Card>

            {/* Amenities & Rooms */}
            <Card className="p-6 space-y-4">
               <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#0A6C6D]" />
                  Amenities & Room Types
               </h2>
               <TagInput
                  label="Hotel Amenities"
                  placeholder="Add amenities (e.g., WiFi, Pool, Spa)"
                  tags={formData.amenities}
                  onAdd={(value) => addTag('amenities', value)}
                  onRemove={(value) => removeTag('amenities', value)}
               />
               <TagInput
                  label="Room Types"
                  placeholder="Add room types (e.g., Standard, Deluxe)"
                  tags={formData.roomTypes}
                  onAdd={(value) => addTag('roomTypes', value)}
                  onRemove={(value) => removeTag('roomTypes', value)}
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
                  label="Starting Price Per Night (₦)"
                  value={formData.priceRange}
                  onChange={(e) => updateField('priceRange', Number(e.target.value))}
               />
               <Input
                  label="Special Offers"
                  placeholder="e.g., Weekend discount, Free breakfast"
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

export default HotelSettings