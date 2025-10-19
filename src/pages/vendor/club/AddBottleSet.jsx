import { cn } from '@/lib/utils';
import { ChevronDown, Coffee, Flame, GripVertical, Minus, Music, Plus, Search, Sparkles, Star, Upload, Users, X } from 'lucide-react';
import { useState } from 'react';
import Header from '../hotel/add-rooms/components/Header';

const BottleServiceManager = () => {
   const [currentStep, setCurrentStep] = useState(1);
   const [bottleSetName, setBottleSetName] = useState('');
   const [selectedTab, setSelectedTab] = useState('existing');
   const [searchQuery, setSearchQuery] = useState('');
   const [categoryFilter, setCategoryFilter] = useState('All Category');
   const [selectedDrinks, setSelectedDrinks] = useState([]);
   const [uploadedImages, setUploadedImages] = useState([]);

   // New drink form state
   const [newDrink, setNewDrink] = useState({
      name: '',
      category: '',
      volume: '',
      price: '100000'
   });

   // Add-ons state
   const [addOns, setAddOns] = useState({
      sparklerShow: true,
      iceBuckets: true,
      mixerChaser: true,
      cupsGlassware: true,
      showgirls: true,
      fireShooter: true,
      djShoutout: true,
      vipEntryPass: true
   });

   const [pricing, setPricing] = useState({
      price: '100000',
      discountPrice: '0.00',
      minQuantity: '1',
      priceVisibility: true
   });

   const [drinks, setDrinks] = useState([
      { id: 1, name: 'Johnny Walker Blue Label', category: 'Whiskey', volume: '750ml', price: 30000, image: '🥃' },
      { id: 2, name: 'Don Perignon Vintage', category: 'Champagne', volume: '750ml', price: 30000, image: '🍾' },
      { id: 3, name: 'Don Perignon Vintage', category: 'Champagne', volume: '750ml', price: 30000, image: '🍾' },
      { id: 4, name: 'Don Perignon Vintage', category: 'Champagne', volume: '750ml', price: 30000, image: '🍾' },
      { id: 5, name: 'Don Perignon Vintage', category: 'Champagne', volume: '750ml', price: 30000, image: '🍾' },
      { id: 6, name: 'Grey Goose', category: 'Vodka', volume: '750ml', price: 30000, image: '🍸' }
   ]);

   const addOnsList = [
      { id: 'sparklerShow', icon: <Sparkles className="w-5 h-5" />, name: 'Sparkler Show', description: 'Add note (e.g 3 sparklers per bottle)', color: 'bg-yellow-100 text-yellow-600' },
      { id: 'iceBuckets', icon: <Coffee className="w-5 h-5" />, name: 'Ice Buckets', description: 'Silver bucket with club logo', color: 'bg-blue-100 text-blue-600' },
      { id: 'mixerChaser', icon: <Coffee className="w-5 h-5" />, name: 'Mixer/Chaser', description: 'Orange, Cranberry, Soda', color: 'bg-orange-100 text-orange-600' },
      { id: 'cupsGlassware', icon: <Coffee className="w-5 h-5" />, name: 'Cups / Glassware', description: 'Premium glassware, 4 per bottle', color: 'bg-purple-100 text-purple-600' },
      { id: 'showgirls', icon: <Users className="w-5 h-5" />, name: 'Showgirls / Dancers', description: '15 minutes performance', color: 'bg-pink-100 text-pink-600' },
      { id: 'fireShooter', icon: <Flame className="w-5 h-5" />, name: 'Fire Shooter', description: 'Bartender performance', color: 'bg-red-100 text-red-600' },
      { id: 'djShoutout', icon: <Music className="w-5 h-5" />, name: 'DJ Shout-out', description: 'Song request', color: 'bg-indigo-100 text-indigo-600' },
      { id: 'vipEntryPass', icon: <Star className="w-5 h-5" />, name: 'VIP Entry Pass', description: 'Skip the line entry for all guests', color: 'bg-cyan-100 text-cyan-600' }
   ];

   const handleFileUpload = (e) => {
      const files = Array.from(e.target.files);
      const newImages = files.slice(0, 3 - uploadedImages.length);

      newImages.forEach(file => {
         const reader = new FileReader();
         reader.onloadend = () => {
            setUploadedImages(prev => [...prev, { url: reader.result, name: file.name }]);
         };
         reader.readAsDataURL(file);
      });
   };

   const removeImage = (index) => {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
   };

   const createNewDrink = () => {
      if (!newDrink.name || !newDrink.category) {
         alert('Please fill in required fields (name and category)');
         return;
      }

      const newDrinkItem = {
         id: Date.now(),
         name: newDrink.name,
         category: newDrink.category,
         volume: newDrink.volume || 'N/A',
         price: parseFloat(newDrink.price.replace(/,/g, '')) || 0,
         image: '🍷',
         quantity: 1
      };

      setSelectedDrinks([...selectedDrinks, newDrinkItem]);
      // Also add the created drink to the master drinks list so it appears in the "Existing" tab
      setDrinks(prev => [...prev, { ...newDrinkItem, quantity: undefined }]);

      // Reset form
      setNewDrink({
         name: '',
         category: '',
         volume: '',
         price: '100000'
      });
      setUploadedImages([]);

      // Switch to existing tab
      setSelectedTab('existing');

      alert('Drink created and added to your set!');
   };

   const addDrink = (drink) => {
      const existing = selectedDrinks.find(d => d.id === drink.id);
      if (existing) {
         setSelectedDrinks(selectedDrinks.map(d =>
            d.id === drink.id ? { ...d, quantity: d.quantity + 1 } : d
         ));
      } else {
         setSelectedDrinks([...selectedDrinks, { ...drink, quantity: 1 }]);
      }
   };

   const updateQuantity = (id, delta) => {
      setSelectedDrinks(selectedDrinks.map(d =>
         d.id === id ? { ...d, quantity: Math.max(1, d.quantity + delta) } : d
      ).filter(d => d.quantity > 0));
   };

   const _removeDrink = (id) => {
      setSelectedDrinks(selectedDrinks.filter(d => d.id !== id));
   };

   const filteredDrinks = drinks.filter(drink =>
      drink.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (categoryFilter === 'All Category' || drink.category === categoryFilter)
   );

   // Step 1: Club Identity & Add Drinks
   const renderStep1 = () => (
      <div className="lg:flex gap-6 ">
         <div className={cn(selectedDrinks.length > 0 && "lg:w-2/3 ", "lg:w-1/2 mx-auto mb-24 space-y-4 sm:space-y-6 px- py-4 sm:py-6")}>
            {/* Club Identity */}
            <div className="bg-white mt-24 rounded-lg shadow-sm p-4 sm:p-6">
               <h2 className="text-base  sm:text-lg font-semibold mb-3 sm:mb-4">Club Identity</h2>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Bottle Set Name<span className="text-red-500">*</span>
                  </label>
                  <input
                     type="text"
                     placeholder="e.g Ballers Combo, VIP Island"
                     value={bottleSetName}
                     onChange={(e) => setBottleSetName(e.target.value)}
                     className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">This name will be displayed to customers</p>
               </div>
            </div>

            {/* Add Drinks */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
               <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Add Drinks To Set</h2>

               {/* Tabs */}
               <div className="flex gap-2 mb-4 border-b overflow-x-auto">
                  <button
                     onClick={() => setSelectedTab('existing')}
                     className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${selectedTab === 'existing'
                           ? 'text-teal-600 border-b-2 border-teal-600'
                           : 'text-gray-500 hover:text-gray-700'
                        }`}
                  >
                     Select Existing Drink
                  </button>
                  <button
                     onClick={() => setSelectedTab('new')}
                     className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${selectedTab === 'new'
                           ? 'text-teal-600 border-b-2 border-teal-600'
                           : 'text-gray-500 hover:text-gray-700'
                        }`}
                  >
                     Create New Drink
                  </button>
               </div>

               {selectedTab === 'existing' ? (
                  <>
                     {/* Search and Filter */}
                     <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="flex-1 relative">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                           <input
                              type="text"
                              placeholder="Search drinks"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                           />
                        </div>
                        <div className="relative sm:w-48">
                           <select
                              value={categoryFilter}
                              onChange={(e) => setCategoryFilter(e.target.value)}
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                           >
                              <option>All Category</option>
                              <option>Whiskey</option>
                              <option>Champagne</option>
                              <option>Vodka</option>
                           </select>
                           <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                        </div>
                     </div>

                     {/* Drinks List */}
                     <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredDrinks.map(drink => (
                           <div key={drink.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-teal-500 transition-colors">
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                                    {drink.image}
                                 </div>
                                 <div className="min-w-0 flex-1">
                                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{drink.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500">{drink.category} • {drink.volume}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                 <span className="font-semibold text-gray-900 text-xs sm:text-base">₦{drink.price.toLocaleString()}</span>
                                 <button
                                    onClick={() => addDrink(drink)}
                                    className="bg-teal-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1 text-xs sm:text-base"
                                 >
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Add</span>
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </>
               ) : (
                  <div className="space-y-4">
                     <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Drink name<span className="text-red-500">*</span>
                           </label>
                           <input
                              type="text"
                              placeholder="e.g. Moet & Chandon Ice Imperial"
                              value={newDrink.name}
                              onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Drink Category<span className="text-red-500">*</span>
                           </label>
                           <div className="relative">
                              <select
                                 value={newDrink.category}
                                 onChange={(e) => setNewDrink({ ...newDrink, category: e.target.value })}
                                 className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                              >
                                 <option value="">Select Category</option>
                                 <option>Whiskey</option>
                                 <option>Champagne</option>
                                 <option>Vodka</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                           </div>
                        </div>
                     </div>

                     <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                              Volume (Optional)
                           </label>
                           <input
                              type="text"
                              placeholder="e.g. 75cl"
                              value={newDrink.volume}
                              onChange={(e) => setNewDrink({ ...newDrink, volume: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                           <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">₦</span>
                              <input
                                 type="text"
                                 value={newDrink.price}
                                 onChange={(e) => setNewDrink({ ...newDrink, price: e.target.value })}
                                 className="w-full pl-7 sm:pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                              />
                           </div>
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload</label>
                        <p className="text-xs text-gray-500 mb-2">You can add up to 3 images</p>

                        {/* Image previews */}
                        {uploadedImages.length > 0 && (
                           <div className="grid grid-cols-3 gap-2 mb-3">
                              {uploadedImages.map((img, index) => (
                                 <div key={index} className="relative group">
                                    <img
                                       src={img.url}
                                       alt={img.name}
                                       className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                       onClick={() => removeImage(index)}
                                       className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                       <X className="w-3 h-3" />
                                    </button>
                                 </div>
                              ))}
                           </div>
                        )}

                        {uploadedImages.length < 3 && (
                           <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-teal-500 transition-colors cursor-pointer block">
                              <input
                                 type="file"
                                 accept="image/jpeg,image/png,image/gif"
                                 multiple
                                 onChange={handleFileUpload}
                                 className="hidden"
                              />
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                                 <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600">
                                 Drag and drop an image here, or <span className="text-teal-600 font-medium">browse</span>
                              </p>
                              <p className="text-xs text-gray-400 mt-1">JPG, PNG OR GIF • Max 5MB</p>
                           </label>
                        )}
                     </div>

                     {/* Create Button */}
                     <button
                        onClick={createNewDrink}
                        className="w-full bg-teal-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm sm:text-base"
                     >
                        Create & Add Drink
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* Preview Panel - Hidden on mobile, shown on desktop */}
         {selectedDrinks.length > 0 && (
            <div className="hidden bg-[#F4F4F4]  lg:block lg:w-1/3 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
               <h2 className="text-base sm:text-lg font-semibold mb-4 pt-3 sticky top-24">Preview</h2>
               <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 bottom-0 sticky top-40">

                  <>
                     <div className="mb-4">
                        <h3 className="font-medium mb-2 text-sm sm:text-base">Ballers Set</h3>
                        <p className="text-xs text-gray-500 mb-4">Drag to reorder items in your menu</p>

                        <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                           {selectedDrinks.map(drink => (
                              <div key={drink.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                 <GripVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 cursor-move flex-shrink-0" />
                                 <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                                    {drink.image}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-xs sm:text-sm truncate">{drink.name}</h4>
                                    <p className="text-xs text-gray-500">{drink.category} • {drink.volume}</p>
                                 </div>
                                 <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                    <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">₦{drink.price.toLocaleString()}</span>
                                    <button
                                       onClick={() => updateQuantity(drink.id, -1)}
                                       className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                    >
                                       <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    </button>
                                    <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-medium">{drink.quantity}</span>
                                    <button
                                       onClick={() => updateQuantity(drink.id, 1)}
                                       className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                    >
                                       <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-xs sm:text-sm font-medium">Total Items:</span>
                           <span className="text-xs sm:text-sm font-semibold">{selectedDrinks.reduce((acc, d) => acc + d.quantity, 0)}</span>
                        </div>
                        <button
                           onClick={() => setSelectedDrinks([])}
                           className="w-full py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                           Clear All
                        </button>
                     </div>
                  </>
                  

               </div>
            </div>
         )}
         {/* Mobile Preview - Floating Button */}
         {selectedDrinks.length > 0 && (
            <div className="lg:hidden fixed bottom-20 right-4 z-20">
               <button className="bg-teal-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                  <div className="relative">
                     <span className="text-lg">🛒</span>
                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedDrinks.reduce((acc, d) => acc + d.quantity, 0)}
                     </span>
                  </div>
               </button>
            </div>
         )}
      </div>
   );

   // Step 2: Add-ons and Pricing
   const renderStep2 = () => (
      <div className="lg:w-1/2 mx-auto - space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
         {/* Available Add-Ons */}
         <div className="bg-white rounded-lg mt-26 shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Available Add-Ons</h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
               {addOnsList.map(addOn => (
                  <div key={addOn.id} className="flex items-start justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                     <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${addOn.color} flex-shrink-0`}>
                           {addOn.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                           <h3 className="font-medium text-gray-900 text-xs sm:text-base">{addOn.name}</h3>
                           <p className="text-xs text-gray-500 mt-1">{addOn.description}</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                        <input
                           type="checkbox"
                           checked={addOns[addOn.id]}
                           onChange={(e) => setAddOns({ ...addOns, [addOn.id]: e.target.checked })}
                           className="sr-only peer"
                        />
                        <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                     </label>
                  </div>
               ))}
            </div>
            <button className="mt-4 text-teal-600 font-medium text-xs sm:text-sm flex items-center gap-2 hover:text-teal-700">
               <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
               Add Custom Add Ons
            </button>
         </div>

         {/* Pricing Details */}
         <div className="bg-white rounded-lg mb-20 shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Pricing Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">₦</span>
                     <input
                        type="text"
                        value={pricing.price}
                        onChange={(e) => setPricing({ ...pricing, price: e.target.value })}
                        className="w-full pl-7 sm:pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Optional Discount Price</label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">₦</span>
                     <input
                        type="text"
                        value={pricing.discountPrice}
                        onChange={(e) => setPricing({ ...pricing, discountPrice: e.target.value })}
                        className="w-full pl-7 sm:pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                     />
                  </div>
               </div>
            </div>
            <div className="mt-4 sm:mt-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Quantity</label>
               <input
                  type="number"
                  value={pricing.minQuantity}
                  onChange={(e) => setPricing({ ...pricing, minQuantity: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
               />
               <p className="text-xs text-gray-500 mt-1">Leave empty for no minimum quantity</p>
            </div>
            <div className="mt-4 sm:mt-6 flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
               <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-xs sm:text-base">Enable Price Visibility To Customers</h3>
                  <p className="text-xs text-gray-500 mt-1">When disabled, customers will see "Contact for Price"</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                     type="checkbox"
                     checked={pricing.priceVisibility}
                     onChange={(e) => setPricing({ ...pricing, priceVisibility: e.target.checked })}
                     className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
               </label>
            </div>
         </div>
      </div>
   );

   return (
      <div className="min-h-screen bg-gray-50">
         <Header title="Create New Bottle Set" />

         {/* Step Indicator - Mobile */}
         <div className="bg-white border-b px-4 py-3 lg:hidden">
            <div className="flex items-center justify-between text-sm">
               <span className="text-gray-600">Step {currentStep} of 2</span>
               <div className="flex gap-2">
                  <div className={`w-16 h-1 rounded-full ${currentStep === 1 ? 'bg-teal-600' : 'bg-teal-300'}`}></div>
                  <div className={`w-16 h-1 rounded-full ${currentStep === 2 ? 'bg-teal-600' : 'bg-gray-300'}`}></div>
               </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="min-h-screen">
            {currentStep === 1 ? renderStep1() : renderStep2()}
         </div>

         {/* Bottom Navigation */}
         <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
               <div className="flex justify-between items-center gap-3 sm:gap-4">
                  <button
                     onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                     disabled={currentStep === 1}
                     className={`px-4 sm:px-6 py-2 font-medium rounded-lg transition-colors text-sm sm:text-base ${currentStep === 1
                           ? 'text-gray-400 cursor-not-allowed'
                           : 'text-gray-700 hover:bg-gray-100'
                        }`}
                  >
                     Back
                  </button>
                  <button
                     onClick={() => currentStep < 2 ? setCurrentStep(currentStep + 1) : alert('Setup complete!')}
                     className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors text-sm sm:text-base"
                  >
                     {currentStep === 2 ? 'Complete Setup' : 'Continue'}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default BottleServiceManager;