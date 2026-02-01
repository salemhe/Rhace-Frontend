import { useState } from 'react';
import { X, AlertCircle, Plus, Trash } from 'lucide-react';
import { clubService } from '@/services/club.service';

export function AddTablesModal({ onClose, onSuccess }) {
   const [formData, setFormData] = useState({
      name: '',
      price: '',
      addOns: [],
   });
   const [addOns, setAddOns] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [saveAndAddAnother, setSaveAndAddAnother] = useState(false);
   const [error, setError] = useState(null);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
         console.log('Submitting form data:', formData);
         const payload = {
            name: formData.name,
            price: parseFloat(formData.price) || 0,
            addOns: formData.addOns,
         };
         if (payload.addOns.length < 4) {
            setError('Please add at least 4 addons.');
            setIsSubmitting(false);
            return;
         }

         const response = await clubService.createTable(payload);

         console.log('Drink created successfully:', response);

         if (saveAndAddAnother) {
            // Reset form for next entry
            setFormData({
               name: '',
               price: '',
               addOns: [],
            });
            setError(null);
         } else {
            // Close modal and refresh
            onSuccess();
         }
      } catch (err) {
         console.error('Error creating drink type:', err);

         // Set user-friendly error message
         if (err.response?.status === 403) {
            setError('You do not have permission to add tables. Please contact your administrator.');
         } else if (err.response?.status === 401) {
            setError('Your session has expired. Please log in again.');
         } else if (err.response?.data?.message) {
            setError(err.response.data.message);
         } else {
            setError('Failed to create table. Please try again.');
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar ">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
               <h2 className="text-lg font-semibold">Add New Table</h2>
               <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
               {/* Error Alert */}
               {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                     <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                     <div className="flex-1">
                        <p className="text-sm text-red-800 font-medium">Error</p>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                     </div>
                     <button
                        type="button"
                        onClick={() => setError(null)}
                        className="text-red-400 hover:text-red-600"
                     >
                        <X size={16} />
                     </button>
                  </div>
               )}

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Table name<span className="text-red-500">*</span>
                  </label>
                  <input
                     type="text"
                     required
                     placeholder="e.g. Moet & Chandon Ice Imperial"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                     <input
                        type="number"
                        placeholder="100,000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Addons (Atleast 4)</label>
                  <div className="relative">
                     <input
                        placeholder="e.g Extra ice, Extra mixer"
                        value={addOns}
                        onChange={(e) => setAddOns(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                     />
                     <button type='button' onClick={() => {
                        if (addOns) {
                           setFormData({ ...formData, addOns: [...formData.addOns, addOns] })
                           console.log(formData.addOns)
                           setAddOns("")
                        }
                     }} className='absolute right-1 top-1/2 transform bg-[#0A6E7D] -translate-y-1/2 text-white p-1.5 rounded-full hover:bg-[#0A6E7D]/90 transition-colors'>
                        <Plus size={20} />
                     </button>
                  </div>
                  {formData.addOns.length > 0 && (
                     <ul className="mt-2 max-h-24 overflow-y-auto border border-gray-200 rounded-lg p-2 hide-scrollbar">
                        {formData.addOns.map((addon, index) => (
                           <li key={index} className="text-sm text-gray-700 py-1 border-b last:border-b-0 flex justify-between items-center">
                              {addon} <button type='button' onClick={() => {
                                 formData.addOns.splice(index, 1);
                                 setFormData({ ...formData, addOns: [...formData.addOns] });
                              }} ><Trash size={16} className='text-red-400' /></button>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>

               <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                     type="button"
                     onClick={onClose}
                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     onClick={() => setSaveAndAddAnother(false)}
                     disabled={isSubmitting}
                     className="flex-1 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50"
                  >
                     {isSubmitting ? 'Saving...' : 'Save Table'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}