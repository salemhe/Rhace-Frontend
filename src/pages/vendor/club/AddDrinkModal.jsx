import { useCallback, useState } from 'react';
import { X, Upload, AlertCircle, DownloadCloud } from 'lucide-react';
import { clubService } from '@/services/club.service';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export function AddDrinkModal({ onClose, onSuccess }) {
   const [formData, setFormData] = useState({
      name: '',
      category: '',
      volume: '',
      price: '',
      images: [],
   });
   const [addOns, setAddOns] = useState({
      iceBucket: false,
      chaser: false,
      sprinklers: false,
      glassware: false,
   });
   const [visibility, setVisibility] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [saveAndAddAnother, setSaveAndAddAnother] = useState(false);
   const [error, setError] = useState(null);
   // const vendor = useSelector((state) => state.auth);

   const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
   const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET


   const handleImageUpload = useCallback(
      async (files, setImage) => {
         const file = files[0];
         if (file.size > 5242880) {
            alert("File size exceeds 5MB limit.");
            return;
         }

         const fileName = file.name

         const formData = new FormData()
         formData.append('file', file)
         formData.append('upload_preset', UPLOAD_PRESET)

         try {
            const response = await axios.post(
               `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
               formData,
            )

            const imageUrl = response.data.secure_url
            setImage((prev) => ({ ...prev, images: [imageUrl] }))
         } catch (error) {
            console.error('Upload failed for', fileName, error)
         }
      },
      []
   )



   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const selectedAddOns = Object.entries(addOns)
         .filter(([, value]) => value)
         .map(([key]) => key);

      try {
         const payload = {
            name: formData.name,
            category: formData.category,
            volume: formData.volume || null,
            price: parseFloat(formData.price) || 0,
            quantity: 0,
            status: 'Active',
            images: formData.images,
            visibility,
            addOns: selectedAddOns,
         };

         const response = await clubService.createDrinkType(payload);

         console.log('Drink created successfully:', response);

         if (saveAndAddAnother) {
            // Reset form for next entry
            setFormData({
               name: '',
               category: '',
               volume: '',
               price: '',
               images: [''],
            });
            setAddOns({
               iceBucket: false,
               chaser: false,
               sprinklers: false,
               glassware: false,
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
            setError('You do not have permission to add drinks. Please contact your administrator.');
         } else if (err.response?.status === 401) {
            setError('Your session has expired. Please log in again.');
         } else if (err.response?.data?.message) {
            setError(err.response.data.message);
         } else {
            setError('Failed to create drink. Please try again.');
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar ">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
               <h2 className="text-lg font-semibold">Add New Drink</h2>
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
                     Drink name<span className="text-red-500">*</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Drink Category<span className="text-red-500">*</span>
                  </label>
                  <select
                     required
                     value={formData.category}
                     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                     <option value="">Select Category</option>
                     <option value="Champagne">Champagne</option>
                     <option value="Cognac">Cognac</option>
                     <option value="Vodka">Vodka</option>
                     <option value="Whiskey">Whiskey</option>
                     <option value="Wine">Wine</option>
                     <option value="Beer">Beer</option>
                     <option value="Rum">Rum</option>
                     <option value="Tequila">Tequila</option>
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Volume <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                     type="text"
                     placeholder="e.g. 75cl"
                     value={formData.volume}
                     onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload</label>
                  <p className="text-xs text-gray-500 mb-3">You can add up to 3 images</p>
                  {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors"> */}
                     <label htmlFor='item-cover-image' className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
                        <DownloadCloud className="w-6 h-6 mb-2" />
                        <p>Drag and drop an image here, or</p>
                        <Button asChild variant="outline" size="sm" className="mt-2">
                           <label htmlFor="item-cover-image" className="cursor-pointer">Browse Files</label>
                        </Button>
                        <p className="text-xs mt-1">JPG, PNG, or GIF • Max 5MB</p>
                        <input
                           type='file'
                           id='item-cover-image'
                           accept='image/*'
                           max={5242880}
                           onChange={(e) => e.target.files && handleImageUpload(e.target.files, setFormData)}
                           className='sr-only'
                        />
                     </label>
                     {formData.images.length > 0 && (
                        <div className="w-32 h-32 rounded-md overflow-hidden">
                           <img
                              src={formData.images[0]}
                              alt="Cover"
                              className="object-cover w-full h-full"
                           />
                        </div>
                     )}
                  {/* </div> */}
               </div>

               <div>
                  <div className="flex items-center justify-between mb-3">
                     <div>
                        <h3 className="text-sm font-medium text-gray-700">Add Ons</h3>
                        <p className="text-xs text-gray-500">Include addons for your drinks</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input
                           type="checkbox"
                           className="sr-only peer"
                           checked={Object.values(addOns).some(v => v)}
                           onChange={(e) => {
                              const checked = e.target.checked;
                              setAddOns({
                                 iceBucket: checked,
                                 chaser: checked,
                                 sprinklers: checked,
                                 glassware: checked,
                              });
                           }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                     </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     {[
                        { key: 'iceBucket', label: 'Ice Bucket' },
                        { key: 'sprinklers', label: 'Sprinklers' },
                        { key: 'chaser', label: 'Chaser' },
                        { key: 'glassware', label: 'Glassware' },
                     ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                           <input
                              type="checkbox"
                              checked={addOns[key]}
                              onChange={(e) => setAddOns({ ...addOns, [key]: e.target.checked })}
                              className="rounded border-gray-300"
                           />
                           <span className="text-sm text-gray-700">{label}</span>
                        </label>
                     ))}
                  </div>
               </div>

               <div>
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-sm font-medium text-gray-700">Visibility</h3>
                        <p className="text-xs text-gray-500">Make this drink visible on booking screen</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input
                           type="checkbox"
                           className="sr-only peer"
                           checked={visibility}
                           onChange={(e) => setVisibility(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                     </label>
                  </div>
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
                     onClick={() => setSaveAndAddAnother(true)}
                     disabled={isSubmitting}
                     className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium text-[16px] leading-4.5 text-nowrap"
                  >
                     Save & Add another
                  </button>
                  <button
                     type="submit"
                     onClick={() => setSaveAndAddAnother(false)}
                     disabled={isSubmitting}
                     className="flex-1 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50"
                  >
                     {isSubmitting ? 'Saving...' : 'Save Drink'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}