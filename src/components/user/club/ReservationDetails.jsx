// import {
//   ArrowLeft,
//   Check,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Minus,
//   Plus,
//   Star,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useReservations } from "@/contexts/club/ReservationContext";
// import ReservationHeader from "./ReservationHeader";
// import { TimePicker } from "../ui/timepicker";
// import { toast } from "react-toastify";
// import { useEffect, useRef, useState } from "react";
// import DatePicker from "../ui/datepicker";
// import { GuestPicker } from "../ui/guestpicker";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useNavigate } from "react-router";
// import { useInView, motion } from "framer-motion";
// import UniversalLoader from "../ui/LogoLoader";
// import { TablePicker } from "../ui/tablepicker";
// import { cn } from "@/lib/utils";
// import { Input } from "@/components/ui/input";

// export default function ReservationDetails({
//   id,
//   searchQuery,
// }) {
//   const {
//     comboItems,
//     setComboItems,
//     bottleItems,
//     setBottleItems,
//     guestCount,
//     setSpecialRequest,
//     specialRequest,
//     setGuestCount,
//     setPage,
//     date,
//     setDate,
//     table,
//     setTable,
//     time,
//     setTime,
//     vendor,
//     setProposedPayment,
//     totalPrice,
//     tableSelected,
//     loading,
//     comboLoading,
//     bottlesLoading,
//     tableLoading,
//   } = useReservations();
//   const [itemsToShow, setItemsToShow] = useState(8);
//   const [activeTab, setActiveTab] = useState("All Bottles");
//   const navigate = useNavigate();
//   const ref = useRef(null);
//   const containerRef = useRef(null);
//   const cardRef = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: "-100px" });
//   const [maxTranslate, setMaxTranslate] = useState(0);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false });
//   const [tableAdded, setTableAdded] = useState(false)

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const containerWidth = containerRef.current.offsetWidth;
//     const contentWidth = containerRef.current.scrollWidth;

//     setMaxTranslate(contentWidth - containerWidth);
//   }, [comboItems]);

//   const handleTable = (v) => {
//     setTable(
//       table.map((item) => ({
//         ...item,
//         selected: item._id === v._id ? true : false,
//       }))
//     );
//   }

//   useEffect(() => {
//     if (table.length > 0 && !tableAdded) {
//       const theTable = table.find(t => t._id === searchQuery.table)
//       handleTable(theTable)
//       setTableAdded(true)
//     }
//   }, [table])

//   const filteredBottles =
//     activeTab === "All Bottles"
//       ? bottleItems
//       : bottleItems?.filter((item) => item.category === activeTab);

//   const displayedItems = filteredBottles?.slice(0, itemsToShow);


//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % comboItems.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + comboItems.length) % comboItems.length);
//   };

//   const slideWidth =
//     cardRef.current?.offsetWidth && containerRef.current
//       ? cardRef.current.offsetWidth + 24
//       : 0;

//   const translateX = Math.min(
//     currentIndex * slideWidth,
//     maxTranslate
//   );
//   const LOAD_MORE_STEP = 4;


//   const hasMore = (filteredBottles ? filteredBottles.length : 0) > itemsToShow;

//   const handleShowMore = () => {
//     setItemsToShow((prev) =>
//       Math.min(
//         prev + LOAD_MORE_STEP,
//         filteredBottles ? filteredBottles.length : 0
//       )
//     );
//   };


//   const handleContinue = () => {
//     if (!date || !guestCount || !time) {
//       toast.error("Fill the required field");
//       return;
//     }
//     setProposedPayment(totalPrice)
//     setPage(1);
//   };

//   if (loading) return <UniversalLoader fullscreen />

//   const handleQuantityChange = (id, change) => {
//     setBottleItems(
//       bottleItems.map((item) => {
//         if (item._id === id) {
//           const newQuantity = Math.max(0, item.quantity + change);
//           return { ...item, quantity: newQuantity, selected: newQuantity > 0 ? true : false };
//         }
//         return item;
//       })
//     );
//   };

//   const handleSelectionChange = (id, value) => {
//     if (value === 1) {
//       // Table selection: only one can be selected at a time
//       setTable(
//         table.map((item) => ({
//           ...item,
//           selected: item._id === id ? !item.selected : false,
//         }))
//       );
//     } else {
//       // Combo selection: multiple can be selected
//       setComboItems(
//         comboItems.map((item) => {
//           if (item._id === id) {
//             return { ...item, selected: !item.selected };
//           }
//           return item;
//         })
//       );
//     }
//   };


//   const onScroll = e => {
//     const el = e.target;
//     const atStart = el.scrollLeft <= 0;
//     const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
//     setScrollState({ atStart, atEnd });
//   };

//   return (
//     <div className="min-h-screen mb-[65px] md:mt-0 bg-gray-50">
//       <ReservationHeader title="Reservation Details" index={1} />
//       <div className="md:hidden flex items-center gap-3 px-4 py-3 ">
//         <button onClick={() => navigate(`/clubs/${id}`)}>
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 20 20"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <g clipPath="url(#clip0_2317_1082)">
//               <path
//                 d="M3.03 9.41084C2.87377 9.56711 2.78601 9.77903 2.78601 10C2.78601 10.221 2.87377 10.4329 3.03 10.5892L7.74417 15.3033C7.90133 15.4551 8.11184 15.5391 8.33033 15.5372C8.54883 15.5353 8.75784 15.4477 8.91235 15.2932C9.06685 15.1387 9.1545 14.9297 9.15639 14.7112C9.15829 14.4927 9.0743 14.2822 8.9225 14.125L5.63083 10.8333H16.6667C16.8877 10.8333 17.0996 10.7455 17.2559 10.5893C17.4122 10.433 17.5 10.221 17.5 10C17.5 9.77899 17.4122 9.56703 17.2559 9.41075C17.0996 9.25447 16.8877 9.16667 16.6667 9.16667H5.63083L8.9225 5.875C9.0743 5.71783 9.15829 5.50733 9.15639 5.28883C9.1545 5.07034 9.06685 4.86133 8.91235 4.70682C8.75784 4.55231 8.54883 4.46467 8.33033 4.46277C8.11184 4.46087 7.90133 4.54487 7.74417 4.69667L3.03 9.41084Z"
//                 fill="#111827"
//               />
//             </g>
//             <defs>
//               <clipPath id="clip0_2317_1082">
//                 <rect width="20" height="20" fill="white" />
//               </clipPath>
//             </defs>
//           </svg>
//         </button>
//         Reservation Details
//       </div>

//       <div className="max-w-5xl mx-auto  px-4 py-5 md:py-15 space-y-6">
//         <div className="max-w-[500px]">
//           <div className="flex gap-4">
//             <div className="relative size-[64px] md:w-32 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
//               <img
//                 src={vendor?.profileImages?.[0] || "/hero-bg.png"}
//                 alt="Restaurant interior"
//                 className="object-cover size-full"
//               />
//             </div>
//             <div className="flex-1">
//               <h2 className="text-sm md:text-xl font-semibold mb-2">
//                 {vendor?.businessName || "Restaurant Name"}
//               </h2>
//               <div className="flex items-start gap-1 text-gray-600 mb-2">
//                 <div>
//                   <MapPin className="h-4 w-4" />
//                 </div>
//                 <span className="text-[12px] md:text-sm truncate w-[210px] sm:w-full">
//                   {vendor?.address || "123 Main St, City, Country"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Star className="h-4 w-4 fill-[#F0AE02] text-[#F0AE02]" />
//                 <span className="text-[12px] md:text-sm font-medium">
//                   {vendor?.rating || "4.8"} (
//                   {vendor?.reviews.toLocaleString() || "1,000"} reviews)
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="rounded-2xl bg-white border">
//           <div className=" divide-y">
//             <div className="flex p-4">
//               <h3 className="text-lg font-medium md:font-semibold">Reservation Details</h3>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
//               <DatePicker 
//                 title="Date" 
//                 edit 
//                 value={date} 
//                 onChange={setDate} 
//               />
//               <TimePicker 
//                 title="Time" 
//                 edit 
//                 value={time} 
//                 onChange={setTime} 
//                 slot={['09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM']} 
//               />
//               <TablePicker 
//                 edit 
//                 loading={loading} 
//                 tables={table} 
//                 value={tableSelected && tableSelected.name} 
//                 onChange={(value) => handleTable(value)} 
//               />
//               <GuestPicker 
//                 edit 
//                 value={guestCount} 
//                 onChange={setGuestCount} 
//                 />
//             </div>
//           </div>
//         </div>
//         <div className="mb-6 space-y-6">
//           <div className="mb-6">
//             <h3 className="md:text-lg font-medium md:font-semibold mb-2">
//               Let&apos;s Plan For Your Arrival
//             </h3>
//             <p className="text-xs md:text-sm text-gray-600">
//               Would you like to add any extras to enhance your night?
//             </p>
//           </div>

//           <div className="space-y-6">
//             <div className="flex items-center justify-between w-full">
//               <h3 className="text-xs md:text-sm text-[#111827]">
//                 Tables
//               </h3>
//             </div>
//             <div onScroll={onScroll} className={cn(
//               "flex overflow-x-auto scroll-smooth hide-scrollbar transition-all w-full",
//               !scrollState.atStart && !scrollState.atEnd && "mask-x-from-95% mask-x-to-100%",
//               scrollState.atStart && !scrollState.atEnd && "[mask-image:linear-gradient(to_right,black_95%,transparent)]",
//               scrollState.atEnd && !scrollState.atStart && "[mask-image:linear-gradient(to_left,black_95%,transparent)]",
//             )} ref={containerRef} >
//               <motion.div
//                 className="flex gap-6"
//                 transition={{ duration: 0.6, ease: "easeInOut" }}
//               >
//                 {tableLoading ? (
//                   <div className="flex w-full justify-center items-center">

//                     <UniversalLoader />
//                   </div>
//                 ) : table.length === 0 ? (
//                   <div>No available Tables</div>
//                 ) : (
//                   <div className="flex w-full gap-4 sm:gap-6">
//                     {table?.map((item) => (
//                       <div key={item._id} className={`p-1 rounded-xl border w-[230px] flex ${item.selected ? "bg-[#E7F0F0] border-[#B3D1D2]" : "bg-white"}`}>
//                         <div className={`p-2 flex flex-col justify-between duration-200 w-full space-y-4 bg-white transition-all border rounded-lg ${item.selected ? "border-[#E5E7EB]" : "border-transparent"}`}>
//                           <div>
//                             <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
//                           </div>
//                           <div className="space-y-2 flex-1">
//                             {item.addOns && item.addOns.slice(0, 4).map((offer, i) => (
//                               <div key={i} className="flex items-center gap-2 ">
//                                 <Check className="text-[#0A6C6D] shrink-0 size-4" />
//                                 <span className="text-sm text-[#111827]">
//                                   {offer}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                           <div className="flex justify-between w-full items-center">
//                             <p className="font-semibold text-gray-900">
//                               ₦{item.price.toLocaleString()}
//                             </p>
//                             <div
//                               className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer ${item.selected
//                                 ? "bg-[#0A6C6D] border-[#0A6C6D] text-white"
//                                 : "border-gray-300"
//                                 }`}
//                               onClick={() => handleSelectionChange(item._id, 1)}
//                             >
//                               {item.selected && (
//                                 <svg
//                                   width="16"
//                                   height="16"
//                                   viewBox="0 0 16 16"
//                                   fill="none"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                   <path
//                                     d="M3.33301 9.33301C3.33301 9.33301 4.66634 9.66634 5.66634 11.6663C5.66634 11.6663 9.37221 5.55523 12.6663 4.33301"
//                                     stroke="white"
//                                     strokeWidth="1.5"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   />
//                                 </svg>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )
//                 }
//               </motion.div>
//             </div>
//           </div>
//           <div className="space-y-6">
//             <div className="flex items-center justify-between w-full">
//               <h3 className="text-xs md:text-sm text-[#111827]">
//                 Premium Combos
//               </h3>
//               <div className="flex gap-6">
//                 <button
//                   disabled={currentIndex === 0}
//                   onClick={prevSlide}
//                   className="text-white rounded-full disabled:text-[#606368] bg-[#0A6C6D] disabled:bg-[#E5E7EB] flex items-center justify-center size-[32px]"
//                 >
//                   <ChevronLeft />
//                 </button>
//                 <button onClick={nextSlide} disabled={currentIndex * slideWidth >= maxTranslate} className="text-white rounded-full disabled:text-[#606368] bg-[#0A6C6D] disabled:bg-[#E5E7EB] flex items-center justify-center size-[32px]">
//                   <ChevronRight />
//                 </button>
//               </div>
//             </div>
//             <div className="flex overflow-hidden w-full" ref={containerRef} >
//               <motion.div
//                 className="flex gap-6 w-full"
//                 animate={{ x: -translateX }}
//                 transition={{ duration: 0.6, ease: "easeInOut" }}
//               >
//                 {comboLoading ? (
//                   <UniversalLoader />
//                 ) : comboItems.length === 0 ? (
//                   <div>No available Combos</div>
//                 ) : (
//                   comboItems.map((item, index) => {
//                     return (
//                       <motion.div
//                         key={index}
//                         ref={index === 0 ? cardRef : null}
//                         animate={isInView ? { opacity: 1, scale: 1 } : {}}
//                         transition={{ duration: 0.5, delay: index * 0.1 }}
//                         className={`${item.selected
//                           && "bg-[#E7F0F0] border rounded-2xl border-[#B3D1D2]"
//                           } p-1 h-[400px] w-[254px] sm:w-[calc(28%-12px)] lg:w-[calc(23.333%-16px)] flex-shrink-0`}
//                       >
//                         <div className="p-2 w-full h-full space-y-3 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col">
//                           <div className="relative w-full h-[150px] overflow-hidden rounded-2xl flex-shrink-0">
//                             {item.image ? (
//                               <img
//                                 src={item.image}
//                                 alt={item.name}
//                                 className="object-cover size-full"
//                               />
//                             ) : (
//                               <div className="bg-gray-200 size-full flex items-center justify-center">
//                                 No Image
//                               </div>
//                             )}
//                             {item.specials && (
//                               <div className="absolute bg-[#E5E7EB] rounded-full top-2 left-2 px-3 text-xs font-medium text-[#111827] py-1">
//                                 {item.specials}
//                               </div>
//                             )}
//                           </div>
//                           <div className="px-3 space-y-3 flex-1 flex flex-col">
//                             <p className="text-[#111827] text-sm">{item.name}</p>
//                             <div className="space-y-2 flex-1">
//                               {item.addOns.slice(0, 4).map((offer, i) => (
//                                 <div key={i} className="flex items-center gap-2 ">
//                                   <Check size={16} className="text-[#0A6C6D] flex-shrink-0" />
//                                   <span className="text-sm text-[#111827]">
//                                     {offer}
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                             <div className="flex items-center justify-between w-full flex-shrink-0">
//                               <p className="text-sm text-[#111827]">
//                                 ₦{item.setPrice.toLocaleString()}
//                               </p>
//                               <div className="flex items-center gap-2">
//                                 <div
//                                   className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer ${item.selected
//                                     ? "bg-teal-600 border-teal-600 text-white"
//                                     : "border-gray-300"
//                                     }`}
//                                   onClick={() => handleSelectionChange(item._id)}
//                                 >
//                                   {item.selected && (
//                                     <svg
//                                       width="16"
//                                       height="16"
//                                       viewBox="0 0 16 16"
//                                       fill="none"
//                                       xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                       <path
//                                         d="M3.33301 9.33301C3.33301 9.33301 4.66634 9.66634 5.66634 11.6663C5.66634 11.6663 9.37221 5.55523 12.6663 4.33301"
//                                         stroke="white"
//                                         strokeWidth="1.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                       />
//                                     </svg>
//                                   )}
//                                 </div>
//                                 <span className="text-xs text-[#111827]">Add</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   }))}
//               </motion.div>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div className="space-y-4">
//               <h3 className="text-sm text-[#111827]">Premium Bottles</h3>
//               <div className="w-full overflow-auto">
//                 <div className="flex items-center">
//                   {[
//                     "All Bottles",
//                     "Champagne",
//                     "Vodka",
//                     "Whiskey",
//                     "Cognac",
//                     "Tequilla",
//                     "Drink Mixers",
//                   ].map((item, i) => (
//                     <div
//                       onClick={() => setActiveTab(item)}
//                       className={`${activeTab === item
//                         ? "text-white bg-[#0A6C6D] flex rounded-full "
//                         : "text-[#606368]"
//                         } text-sm px-4 py-2 min-w-max cursor-pointer`}
//                       key={i}
//                     >{item}</div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             {bottlesLoading ? (
//               <UniversalLoader />
//             ) : bottleItems.length === 0 ? (
//               <div>No available Bottles</div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
//                   {displayedItems.map((item, i) => (
//                     <div
//                       key={i}
//                       className="p-2 space-y-3 bg-white rounded-2xl border border-[#E5E7EB]"
//                     >
//                       <div className="relative w-full h-24 md:h-48 overflow-hidden rounded-2xl">
//                         <img
//                           src={item.images[0]}
//                           alt={item.name}
//                           className="object-cover size-full"
//                         />
//                         {item.specials && (
//                           <div className="absolute top-2 left-2 rounded-full px-3 text-xs bg-[#E5E7EB] text-[#111827] py-1">
//                             {item.specials}
//                           </div>
//                         )}
//                       </div>
//                       <div className="space-y-3 md:px-3">
//                         <div className="border text-[#606368] bg-[#FDEFDC] w-max border-[#FFE0B5] text-xs py-1.5 px-2 rounded-md">
//                           {item.category}
//                         </div>
//                         <div className="space-y-1">
//                           <h4 className="text-sm font-medium text-[#111827]">
//                             {item.name}
//                           </h4>
//                           <p className="text-sm text-[#606368]">
//                             {item.description}
//                           </p>
//                         </div>
//                         <div className="flex items-center text-xs md:text-sm justify-between">
//                           <p>₦{item.price.toLocaleString()}</p>
//                           <div className="flex items-center gap-1">
//                             <Button
//                               variant="outline"
//                               size="icon"
//                               className="size-4 md:size-6 rounded-full border-[#1E3A8A] border-2 text-[#1E3A8A]"
//                               onClick={() =>
//                                 handleQuantityChange(item._id, -1)
//                               }
//                             >
//                               <Minus className="size-2" />
//                             </Button>
//                             <span className="w-8 text-center">
//                               <Input
//                                 type="number"
//                                 value={item.quantity}
//                                 min={0}
//                                 max={20}
//                                 inputMode="numeric"
//                                 pattern="[0-9]*"
//                                 className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center px-1 md:px-2 h-6 md:h-8 text-sm md:text-base"
//                                 onWheel={(e) =>
//                                   (e.target).blur()
//                                 }
//                                 onChange={(e) => {
//                                   let value = Number(e.target.value);
//                                   if (value < 1) value = 1;
//                                   handleQuantityChange(
//                                     item._id,
//                                     value,
//                                     "input"
//                                   );
//                                 }}
//                               />
//                             </span>
//                             <Button
//                               variant="outline"
//                               size="icon"
//                               className="size-4 md:size-6 rounded-full border-[#1E3A8A] border-2 text-[#1E3A8A]"
//                               onClick={() =>
//                                 handleQuantityChange(item._id, 1)
//                               }
//                             >
//                               <Plus className="size-2" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {hasMore && (
//                   <div className="mt-8 w-full text-center">
//                     <button
//                       onClick={handleShowMore}
//                       className="text-[#0A6C6D] hover:underline text-sm cursor-pointer flex items-center gap-2"
//                     >
//                       Show more{" "}
//                       <ChevronDown
//                         className="
//                             h-4 w-4"
//                       />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           <div className="relative">
//             <Label
//               htmlFor="special-request"
//               className="text-sm font-medium mb-2 block"
//             >
//               Special Request (Optional)
//             </Label>
//             <Textarea
//               id="special-request"
//               placeholder="Let us know if you have any special request"
//               value={specialRequest}
//               maxLength={500}
//               onChange={(e) => setSpecialRequest(e.target.value)}
//               className="min-h-[100px] bg-white border text-sm border-[#E5E7EB] resize-none rounded-xl"
//             />
//             <p className="absolute bottom-2 right-2 text-xs text-gray-400">
//               {specialRequest.length}/500
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="w-full fixed bottom-0 left-0 bg-white border-t border-[#E5E7EB]">
//         <div className="flex flex-col sm:flex-row justify-between gap-2 items-center max-w-4xl mx-auto p-4">
//           <Button
//             onClick={() => navigate(-1)}
//             variant="ghost"
//             className="md:flex items-center hover:bg-transparent text-[#0A6C6D] hover:text-[#0A6C6D] cursor-pointer gap-2 hidden"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Club Page
//           </Button>
//           <Button
//             className="bg-[#0A6C6D] hover:bg-[#0A6C6D]/90 px-8 py-6 w-full max-w-xs rounded-xl h-10 cursor-pointer"
//             onClick={handleContinue}
//             disabled={!date || !guestCount || !time}
//           >
//             Complete Reservations
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  Star,
  Users,
  Clock,
  AlertCircle,
  Crown,
  Sparkles,
  Wine,
  Music,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/contexts/club/ReservationContext";
import ReservationHeader from "./ReservationHeader";
import { TimePicker } from "../ui/timepicker";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import DatePicker from "../ui/datepicker";
import { GuestPicker } from "../ui/guestpicker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router";
import { useInView, motion } from "framer-motion";
import UniversalLoader from "../ui/LogoLoader";
import { TablePicker } from "../ui/tablepicker";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Category color mapping for bottles
const categoryColors = {
  "Champagne": "bg-[#FEF3E2] border-[#FFE0B5] text-[#B45F2B]",
  "Vodka": "bg-[#E6F3F5] border-[#B3D9E0] text-[#1A6B7A]",
  "Whiskey": "bg-[#F0E6D2] border-[#D4B68A] text-[#8B4513]",
  "Cognac": "bg-[#F5E6E6] border-[#D9B3B3] text-[#8B3A3A]",
  "Tequilla": "bg-[#E6F0E6] border-[#B3D9B3] text-[#2E7D32]",
  "Drink Mixers": "bg-[#F0E0F5] border-[#D9B3E0] text-[#6A1B9A]",
};

// Table category icons
const tableCategoryIcons = {
  "VIP": Crown,
  "VVIP": Sparkles,
  "Regular": Users,
  "Super Regular": Users,
  "Private": Wine,
  "Booth": Music,
  "Bar": Coffee,
};

export default function ReservationDetails({
  id,
  searchQuery,
}) {
  const {
    comboItems,
    setComboItems,
    bottleItems,
    setBottleItems,
    guestCount,
    setSpecialRequest,
    specialRequest,
    setGuestCount,
    setPage,
    date,
    setDate,
    table,
    setTable,
    time,
    setTime,
    vendor,
    setProposedPayment,
    totalPrice,
    loading,
    comboLoading,
    bottlesLoading,
    tableLoading,
  } = useReservations();
  const [itemsToShow, setItemsToShow] = useState(8);
  const [activeTab, setActiveTab] = useState("All Bottles");
  const [tableFilter, setTableFilter] = useState("all"); // all, available, limited
  const navigate = useNavigate();
  const ref = useRef(null);
  const containerRef = useRef(null);
  const comboContainerRef = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false });
  const [tableAdded, setTableAdded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock availability data - in real app, this would come from the backend
  const getTableAvailability = (table) => {
    // This is mock data - replace with actual backend data
    const mockAvailability = {
      "table-1": { total: 5, available: 5, status: "available" },
      "table-2": { total: 3, available: 1, status: "limited" },
      "table-3": { total: 4, available: 0, status: "unavailable" },
      "table-4": { total: 6, available: 3, status: "limited" },
      "table-5": { total: 2, available: 2, status: "available" },
    };
    
    // Return mock data based on table id or generate random for demo
    const defaultAvailability = {
      total: Math.floor(Math.random() * 8) + 2,
      available: Math.floor(Math.random() * 8) + 1,
    };
    defaultAvailability.status = defaultAvailability.available === 0 
      ? "unavailable" 
      : defaultAvailability.available <= 2 
        ? "limited" 
        : "available";
    
    return mockAvailability[table._id] || defaultAvailability;
  };

  useEffect(() => {
    if (!comboContainerRef.current) return;

    const containerWidth = comboContainerRef.current.offsetWidth;
    const contentWidth = comboContainerRef.current.scrollWidth;

    setMaxTranslate(contentWidth - containerWidth);
  }, [comboItems]);

  // Handle table quantity change
  const handleTableQuantityChange = (id, change, type = "button") => {
    setTable(
      table.map((item) => {
        if (item._id === id) {
          let newQuantity;
          if (type === "input") {
            newQuantity = change;
          } else {
            newQuantity = Math.max(0, (item.quantity || 0) + change);
          }
          
          // Check availability
          const availability = getTableAvailability(item);
          if (newQuantity > availability.available) {
            toast.error(`Only ${availability.available} ${item.name} tables available`);
            return item;
          }
          
          return { 
            ...item, 
            quantity: newQuantity, 
            selected: newQuantity > 0 ? true : false 
          };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    if (table.length > 0 && !tableAdded && searchQuery?.table) {
      const theTable = table.find(t => t._id === searchQuery.table)
      if (theTable) {
        handleTableQuantityChange(theTable._id, 1, "input");
      }
      setTableAdded(true)
    }
  }, [table, searchQuery])

  const filteredBottles =
    activeTab === "All Bottles"
      ? bottleItems
      : bottleItems?.filter((item) => item.category === activeTab);

  const displayedItems = filteredBottles?.slice(0, itemsToShow);

  const nextSlide = () => {
    if (isMobile) {
      // On mobile, scroll the container
      if (comboContainerRef.current) {
        const container = comboContainerRef.current;
        const cardWidth = cardRef.current?.offsetWidth || 280;
        const newScrollLeft = container.scrollLeft + cardWidth + 24;
        container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      }
    } else {
      // On desktop, use motion animation
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= comboItems.length) return prev;
        return nextIndex;
      });
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      // On mobile, scroll the container
      if (comboContainerRef.current) {
        const container = comboContainerRef.current;
        const cardWidth = cardRef.current?.offsetWidth || 280;
        const newScrollLeft = Math.max(0, container.scrollLeft - cardWidth - 24);
        container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      }
    } else {
      // On desktop, use motion animation
      setCurrentIndex((prev) => {
        const prevIndex = prev - 1;
        if (prevIndex < 0) return 0;
        return prevIndex;
      });
    }
  };

  const slideWidth =
    cardRef.current?.offsetWidth && comboContainerRef.current
      ? cardRef.current.offsetWidth + 24
      : 0;

  const translateX = Math.min(
    currentIndex * slideWidth,
    maxTranslate
  );
  const LOAD_MORE_STEP = 4;

  const hasMore = (filteredBottles ? filteredBottles.length : 0) > itemsToShow;

  const handleShowMore = () => {
    setItemsToShow((prev) =>
      Math.min(
        prev + LOAD_MORE_STEP,
        filteredBottles ? filteredBottles.length : 0
      )
    );
  };

  const handleContinue = () => {
    if (!date || !guestCount || !time) {
      toast.error("Fill the required field");
      return;
    }
    setProposedPayment(totalPrice)
    setPage(1);
  };

  if (loading) return <UniversalLoader fullscreen />

  const handleBottleQuantityChange = (id, change, type = "button") => {
    setBottleItems(
      bottleItems.map((item) => {
        if (item._id === id) {
          let newQuantity;
          if (type === "input") {
            newQuantity = change;
          } else {
            newQuantity = Math.max(0, item.quantity + change);
          }
          return { ...item, quantity: newQuantity, selected: newQuantity > 0 ? true : false };
        }
        return item;
      })
    );
  };

  const handleComboSelectionChange = (id) => {
    setComboItems(
      comboItems.map((item) => {
        if (item._id === id) {
          return { ...item, selected: !item.selected };
        }
        return item;
      })
    );
  };

  const onScroll = e => {
    const el = e.target;
    const atStart = el.scrollLeft <= 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    setScrollState({ atStart, atEnd });
  };

  const getCategoryColor = (category) => {
    return categoryColors[category] || "bg-[#FDEFDC] border-[#FFE0B5] text-[#606368]";
  };

  // Format selected tables for display
  const getSelectedTablesText = () => {
    const selectedTables = table.filter(t => t.selected);
    if (selectedTables.length === 0) return "";
    if (selectedTables.length === 1) {
      const table = selectedTables[0];
      return table.quantity > 1 ? `${table.name} (${table.quantity})` : table.name;
    }
    const totalCount = selectedTables.reduce((sum, t) => sum + (t.quantity || 1), 0);
    return `${selectedTables.length} table types (${totalCount} total)`;
  };

  // Filter tables based on availability
  const filteredTables = table.filter(item => {
    if (tableFilter === "all") return true;
    const availability = getTableAvailability(item);
    if (tableFilter === "available") return availability.available > 0;
    if (tableFilter === "limited") return availability.available > 0 && availability.available <= 2;
    return true;
  });

  // Get table category icon
  const getTableIcon = (category) => {
    const IconComponent = tableCategoryIcons[category] || Users;
    return <IconComponent className="size-3.5" />;
  };

  // Generate dummy descriptions for tables
  const getTableDescription = (table) => {
    const descriptions = {
      "VIP": "Premium seating with exclusive bottle service and dedicated waitstaff",
      "VVIP": "Ultimate luxury experience with private area and personalized service",
      "Regular": "Comfortable seating with great views of the main stage",
      "Super Regular": "Spacious seating ideal for groups, close to the dance floor",
      "Private": "Enclosed area for maximum privacy and intimate gatherings",
      "Booth": "Semi-private booth with premium sound and lighting",
      "Bar": "High-top seating at the bar counter with direct bartender access",
    };
    
    return descriptions[table.category] || "Comfortable seating arrangement with great ambiance";
  };

  return (
    <div className="min-h-screen mb-[65px] md:mt-0 bg-gray-50">
      <ReservationHeader title="Reservation Details" index={1} />
      <div className="md:hidden flex items-center gap-3 px-4 py-3 ">
        <button onClick={() => navigate(`/clubs/${id}`)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2317_1082)">
              <path
                d="M3.03 9.41084C2.87377 9.56711 2.78601 9.77903 2.78601 10C2.78601 10.221 2.87377 10.4329 3.03 10.5892L7.74417 15.3033C7.90133 15.4551 8.11184 15.5391 8.33033 15.5372C8.54883 15.5353 8.75784 15.4477 8.91235 15.2932C9.06685 15.1387 9.1545 14.9297 9.15639 14.7112C9.15829 14.4927 9.0743 14.2822 8.9225 14.125L5.63083 10.8333H16.6667C16.8877 10.8333 17.0996 10.7455 17.2559 10.5893C17.4122 10.433 17.5 10.221 17.5 10C17.5 9.77899 17.4122 9.56703 17.2559 9.41075C17.0996 9.25447 16.8877 9.16667 16.6667 9.16667H5.63083L8.9225 5.875C9.0743 5.71783 9.15829 5.50733 9.15639 5.28883C9.1545 5.07034 9.06685 4.86133 8.91235 4.70682C8.75784 4.55231 8.54883 4.46467 8.33033 4.46277C8.11184 4.46087 7.90133 4.54487 7.74417 4.69667L3.03 9.41084Z"
                fill="#111827"
              />
            </g>
            <defs>
              <clipPath id="clip0_2317_1082">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
        Reservation Details
      </div>

      <div className="max-w-5xl mx-auto  px-4 py-5 md:py-15 space-y-6">
        <div className="max-w-[500px]">
          <div className="flex gap-4">
            <div className="relative size-[64px] md:w-32 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={vendor?.profileImages?.[0] || "/hero-bg.png"}
                alt="Restaurant interior"
                className="object-cover size-full"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-sm md:text-xl font-semibold mb-2">
                {vendor?.businessName || "Restaurant Name"}
              </h2>
              <div className="flex items-start gap-1 text-gray-600 mb-2">
                <div>
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-[12px] md:text-sm truncate w-[210px] sm:w-full">
                  {vendor?.address || "123 Main St, City, Country"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#F0AE02] text-[#F0AE02]" />
                <span className="text-[12px] md:text-sm font-medium">
                  {vendor?.rating || "4.8"} (
                  {vendor?.reviews.toLocaleString() || "1,000"} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border">
          <div className=" divide-y">
            <div className="flex p-4">
              <h3 className="text-lg font-medium md:font-semibold">Reservation Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              <DatePicker 
                title="Date" 
                edit 
                value={date} 
                onChange={setDate} 
              />
              <TimePicker 
                title="Time" 
                edit 
                value={time} 
                onChange={setTime} 
                slot={['09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM']} 
              />
              <TablePicker 
                edit 
                loading={loading} 
                tables={table} 
                value={getSelectedTablesText()} 
                onChange={(value) => handleTableQuantityChange(value._id, 1)} 
              />
              <GuestPicker 
                edit 
                value={guestCount} 
                onChange={setGuestCount} 
                />
            </div>
          </div>
        </div>
        <div className="mb-6 space-y-6">
          <div className="mb-6">
            <h3 className="md:text-lg font-medium md:font-semibold mb-2">
              Let&apos;s Plan For Your Arrival
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Would you like to add any extras to enhance your night?
            </p>
          </div>

          {/* Tables Section - KEPT THE SAME */}
          <div className="space-y-6">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-xs md:text-sm text-[#111827]">Tables</h3>
              <div className="flex items-center gap-3">
                {/* Table Filter */}
                <select
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1 bg-white"
                >
                  <option value="all">All Tables</option>
                  <option value="available">Available Only</option>
                  <option value="limited">Limited Stock</option>
                </select>
                
                {table.filter(t => t.selected).length > 0 && (
                  <span className="text-xs text-[#0A6C6D] bg-[#E7F0F0] px-2 py-1 rounded-full">
                    {table.filter(t => t.selected).reduce((sum, t) => sum + (t.quantity || 1), 0)} selected
                  </span>
                )}
              </div>
            </div>
            
            <div onScroll={onScroll} className={cn(
              "flex overflow-x-auto scroll-smooth hide-scrollbar transition-all w-full",
              !scrollState.atStart && !scrollState.atEnd && "mask-x-from-95% mask-x-to-100%",
              scrollState.atStart && !scrollState.atEnd && "[mask-image:linear-gradient(to_right,black_95%,transparent)]",
              scrollState.atEnd && !scrollState.atStart && "[mask-image:linear-gradient(to_left,black_95%,transparent)]",
            )} ref={containerRef} >
              <motion.div
                className="flex gap-6"
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {tableLoading ? (
                  <div className="flex w-full justify-center items-center">
                    <UniversalLoader />
                  </div>
                ) : filteredTables.length === 0 ? (
                  <div>No tables match your filter</div>
                ) : (
                  <div className="flex w-full gap-4 sm:gap-6">
                    {filteredTables?.map((item) => {
                      const availability = getTableAvailability(item);
                      const TableIcon = getTableIcon(item.category);
                      const isUnavailable = availability.available === 0;
                      const isLimited = availability.available <= 2 && availability.available > 0;
                      
                      return (
                        <div 
                          key={item._id} 
                          className={cn(
                            "p-1 rounded-xl border w-[300px] flex transition-all duration-200",
                            item.selected ? "bg-[#E7F0F0] border-[#B3D1D2]" : "bg-white",
                            isUnavailable && "opacity-60"
                          )}
                        >
                          <div className={cn(
                            "p-3 flex flex-col justify-between duration-200 w-full space-y-3 bg-white transition-all border rounded-lg",
                            item.selected ? "border-[#E5E7EB]" : "border-transparent",
                            isUnavailable && "bg-gray-50"
                          )}>
                            {/* Header with Name, Category Icon and Availability Badge */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "p-1.5 rounded-full",
                                  item.category === "VIP" && "bg-yellow-100",
                                  item.category === "VVIP" && "bg-purple-100",
                                  item.category === "Regular" && "bg-blue-100",
                                  item.category === "Super Regular" && "bg-green-100",
                                )}>
                                  {TableIcon}
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                                  {item.category && (
                                    <span className="text-xs text-gray-500">{item.category}</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Availability Badge */}
                              {isUnavailable ? (
                                <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                                  <AlertCircle className="size-3 mr-1" /> Unavailable
                                </Badge>
                              ) : isLimited ? (
                                <Badge variant="warning" className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] px-2 py-0.5">
                                  <Clock className="size-3 mr-1" /> Only {availability.available} left
                                </Badge>
                              ) : (
                                <Badge variant="success" className="bg-green-100 text-green-700 border-green-200 text-[10px] px-2 py-0.5">
                                  <Check className="size-3 mr-1" /> Available
                                </Badge>
                              )}
                            </div>
                            
                            {/* Enhanced Description */}
                            <p className="text-xs text-gray-600 line-clamp-2 min-h-[32px]">
                              {item.description || getTableDescription(item)}
                            </p>
                            
                            {/* Capacity Info */}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Users className="size-3.5" />
                              <span>Up to {item.capacity || 6} guests</span>
                              {item.minimum && (
                                <span className="ml-auto">Min. {item.minimum} guests</span>
                              )}
                            </div>
                            
                            {/* Table Features/AddOns */}
                            <div className="space-y-1.5">
                              {item.addOns && item.addOns.slice(0, 3).map((offer, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <Check className="text-[#0A6C6D] shrink-0 size-3.5" />
                                  <span className="text-xs text-[#111827]">{offer}</span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Price and Quantity Controls */}
                            <div className="flex flex-col gap-3 pt-2 border-t border-dashed">
                              <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-900">
                                  ₦{item.price.toLocaleString()} 
                                  <span className="text-xs font-normal text-gray-500 ml-1">per table</span>
                                </p>
                                {availability.available > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {availability.available} available
                                  </span>
                                )}
                              </div>
                              
                              {/* Quantity Controls - Disabled if unavailable */}
                              {!isUnavailable && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">Quantity:</span>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="size-7 rounded-full border-[#0A6C6D] border text-[#0A6C6D] hover:bg-[#0A6C6D] hover:text-white"
                                      onClick={() => handleTableQuantityChange(item._id, -1)}
                                      disabled={!item.quantity || item.quantity === 0}
                                    >
                                      <Minus className="size-3" />
                                    </Button>
                                    <span className="w-8 text-center">
                                      <Input
                                        type="number"
                                        value={item.quantity || 0}
                                        min={0}
                                        max={availability.available}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center px-1 h-7 text-sm"
                                        onWheel={(e) => (e.target).blur()}
                                        onChange={(e) => {
                                          let value = Number(e.target.value);
                                          if (value < 0) value = 0;
                                          if (value > availability.available) {
                                            toast.error(`Maximum ${availability.available} tables available`);
                                            value = availability.available;
                                          }
                                          handleTableQuantityChange(item._id, value, "input");
                                        }}
                                      />
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="size-7 rounded-full border-[#0A6C6D] border text-[#0A6C6D] hover:bg-[#0A6C6D] hover:text-white"
                                      onClick={() => handleTableQuantityChange(item._id, 1)}
                                      disabled={item.quantity >= availability.available}
                                    >
                                      <Plus className="size-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {/* Total for this table type */}
                              {(item.quantity > 0) && (
                                <div className="flex justify-between items-center pt-1 border-t border-dashed">
                                  <span className="text-xs text-gray-500">Total:</span>
                                  <span className="text-sm font-semibold text-[#0A6C6D]">
                                    ₦{(item.price * (item.quantity || 1)).toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Premium Combos Section - FIXED with proper mobile/desktop behavior */}
          <div className="space-y-6">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-xs md:text-sm text-[#111827]">
                Premium Combos
              </h3>
              <div className="flex gap-6">
                <button
                  disabled={currentIndex === 0}
                  onClick={prevSlide}
                  className="text-white rounded-full disabled:text-[#606368] bg-[#0A6C6D] disabled:bg-[#E5E7EB] flex items-center justify-center size-[32px]"
                >
                  <ChevronLeft />
                </button>
                <button 
                  onClick={nextSlide} 
                  disabled={!isMobile && currentIndex >= comboItems.length - 1} 
                  className="text-white rounded-full disabled:text-[#606368] bg-[#0A6C6D] disabled:bg-[#E5E7EB] flex items-center justify-center size-[32px]"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
            
            <div 
              ref={comboContainerRef}
              className={cn(
                "flex overflow-x-auto scroll-smooth hide-scrollbar transition-all w-full",
                !isMobile && "overflow-hidden"
              )}
              style={isMobile ? { scrollBehavior: 'smooth' } : {}}
            >
              {!isMobile ? (
                // Desktop: Motion animation controlled by buttons
                <motion.div
                  className="flex gap-6"
                  animate={{ x: -translateX }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {comboLoading ? (
                    <UniversalLoader />
                  ) : comboItems.length === 0 ? (
                    <div>No available Combos</div>
                  ) : (
                    comboItems.map((item, index) => (
                      <div
                        key={item._id}
                        ref={index === 0 ? cardRef : null}
                        className={`${item.selected && "bg-[#E7F0F0] border rounded-2xl border-[#B3D1D2]"} p-1 h-[420px] w-[280px] sm:w-[300px] lg:w-[320px] flex-shrink-0`}
                      >
                        <div className="p-2 w-full h-full space-y-3 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col">
                          <div className="relative w-full h-[180px] overflow-hidden rounded-2xl flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover size-full"
                              />
                            ) : (
                              <div className="bg-gray-200 size-full flex items-center justify-center">
                                No Image
                              </div>
                            )}
                            {item.specials && (
                              <div className="absolute bg-[#E5E7EB] rounded-full top-2 left-2 px-3 text-xs font-medium text-[#111827] py-1">
                                {item.specials}
                              </div>
                            )}
                          </div>
                          <div className="px-3 space-y-3 flex-1 flex flex-col">
                            <p className="text-[#111827] text-sm font-medium">{item.name}</p>
                            <div className="space-y-2 flex-1">
                              {item.addOns.slice(0, 4).map((offer, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <Check size={16} className="text-[#0A6C6D] flex-shrink-0" />
                                  <span className="text-sm text-[#111827]">{offer}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between w-full flex-shrink-0">
                              <p className="text-sm font-semibold text-[#111827]">
                                ₦{item.setPrice.toLocaleString()}
                              </p>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer ${
                                    item.selected
                                      ? "bg-teal-600 border-teal-600 text-white"
                                      : "border-gray-300"
                                  }`}
                                  onClick={() => handleComboSelectionChange(item._id)}
                                >
                                  {item.selected && (
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M3.33301 9.33301C3.33301 9.33301 4.66634 9.66634 5.66634 11.6663C5.66634 11.6663 9.37221 5.55523 12.6663 4.33301"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-xs text-[#111827]">Add</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              ) : (
                // Mobile: Normal scroll
                <div className="flex gap-6">
                  {comboLoading ? (
                    <UniversalLoader />
                  ) : comboItems.length === 0 ? (
                    <div>No available Combos</div>
                  ) : (
                    comboItems.map((item, index) => (
                      <div
                        key={item._id}
                        ref={index === 0 ? cardRef : null}
                        className={`${item.selected && "bg-[#E7F0F0] border rounded-2xl border-[#B3D1D2]"} p-1 h-[420px] w-[280px] flex-shrink-0`}
                      >
                        <div className="p-2 w-full h-full space-y-3 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col">
                          <div className="relative w-full h-[180px] overflow-hidden rounded-2xl flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover size-full"
                              />
                            ) : (
                              <div className="bg-gray-200 size-full flex items-center justify-center">
                                No Image
                              </div>
                            )}
                            {item.specials && (
                              <div className="absolute bg-[#E5E7EB] rounded-full top-2 left-2 px-3 text-xs font-medium text-[#111827] py-1">
                                {item.specials}
                              </div>
                            )}
                          </div>
                          <div className="px-3 space-y-3 flex-1 flex flex-col">
                            <p className="text-[#111827] text-sm font-medium">{item.name}</p>
                            <div className="space-y-2 flex-1">
                              {item.addOns.slice(0, 4).map((offer, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <Check size={16} className="text-[#0A6C6D] flex-shrink-0" />
                                  <span className="text-sm text-[#111827]">{offer}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between w-full flex-shrink-0">
                              <p className="text-sm font-semibold text-[#111827]">
                                ₦{item.setPrice.toLocaleString()}
                              </p>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer ${
                                    item.selected
                                      ? "bg-teal-600 border-teal-600 text-white"
                                      : "border-gray-300"
                                  }`}
                                  onClick={() => handleComboSelectionChange(item._id)}
                                >
                                  {item.selected && (
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M3.33301 9.33301C3.33301 9.33301 4.66634 9.66634 5.66634 11.6663C5.66634 11.6663 9.37221 5.55523 12.6663 4.33301"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-xs text-[#111827]">Add</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Premium Bottles Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm text-[#111827]">Premium Bottles</h3>
              <div className="w-full overflow-auto">
                <div className="flex items-center">
                  {[
                    "All Bottles",
                    "Champagne",
                    "Vodka",
                    "Whiskey",
                    "Cognac",
                    "Tequilla",
                    "Drink Mixers",
                  ].map((item, i) => (
                    <div
                      onClick={() => setActiveTab(item)}
                      className={`${activeTab === item
                        ? "text-white bg-[#0A6C6D] flex rounded-full "
                        : "text-[#606368]"
                        } text-sm px-4 py-2 min-w-max cursor-pointer`}
                      key={i}
                    >{item}</div>
                  ))}
                </div>
              </div>
            </div>
            {bottlesLoading ? (
              <UniversalLoader />
            ) : bottleItems.length === 0 ? (
              <div>No available Bottles</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {displayedItems.map((item, i) => (
                    <div
                      key={item._id}
                      className="p-2 space-y-3 bg-white rounded-2xl border border-[#E5E7EB]"
                    >
                      <div className="relative w-full h-24 md:h-48 overflow-hidden rounded-2xl">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="object-cover size-full"
                        />
                        {item.specials && (
                          <div className="absolute top-2 left-2 rounded-full px-3 text-xs bg-[#E5E7EB] text-[#111827] py-1">
                            {item.specials}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 md:px-3">
                        <div className={cn(
                          "border w-max text-xs py-1.5 px-2 rounded-md",
                          getCategoryColor(item.category)
                        )}>
                          {item.category}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-[#111827]">
                            {item.name}
                          </h4>
                          <p className="text-sm text-[#606368]">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center text-xs md:text-sm justify-between">
                          <p>₦{item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-4 md:size-6 rounded-full border-[#1E3A8A] border-2 text-[#1E3A8A]"
                              onClick={() =>
                                handleBottleQuantityChange(item._id, -1)
                              }
                            >
                              <Minus className="size-2" />
                            </Button>
                            <span className="w-8 text-center">
                              <Input
                                type="number"
                                value={item.quantity}
                                min={0}
                                max={20}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center px-1 md:px-2 h-6 md:h-8 text-sm md:text-base"
                                onWheel={(e) =>
                                  (e.target).blur()
                                }
                                onChange={(e) => {
                                  let value = Number(e.target.value);
                                  if (value < 0) value = 0;
                                  if (value > 20) value = 20;
                                  handleBottleQuantityChange(
                                    item._id,
                                    value,
                                    "input"
                                  );
                                }}
                              />
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-4 md:size-6 rounded-full border-[#1E3A8A] border-2 text-[#1E3A8A]"
                              onClick={() =>
                                handleBottleQuantityChange(item._id, 1)
                              }
                            >
                              <Plus className="size-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-8 w-full text-center">
                    <button
                      onClick={handleShowMore}
                      className="text-[#0A6C6D] hover:underline text-sm cursor-pointer flex items-center gap-2"
                    >
                      Show more{" "}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="relative">
            <Label
              htmlFor="special-request"
              className="text-sm font-medium mb-2 block"
            >
              Special Request (Optional)
            </Label>
            <Textarea
              id="special-request"
              placeholder="Let us know if you have any special request"
              value={specialRequest}
              maxLength={500}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="min-h-[100px] bg-white border text-sm border-[#E5E7EB] resize-none rounded-xl"
            />
            <p className="absolute bottom-2 right-2 text-xs text-gray-400">
              {specialRequest.length}/500
            </p>
          </div>
        </div>
      </div>
      <div className="w-full fixed bottom-0 left-0 bg-white border-t border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row justify-between gap-2 items-center max-w-4xl mx-auto p-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="md:flex items-center hover:bg-transparent text-[#0A6C6D] hover:text-[#0A6C6D] cursor-pointer gap-2 hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Club Page
          </Button>
          <Button
            className="bg-[#0A6C6D] hover:bg-[#0A6C6D]/90 px-8 py-6 w-full max-w-xs rounded-xl h-10 cursor-pointer"
            onClick={handleContinue}
            disabled={!date || !guestCount || !time}
          >
            Complete Reservations
          </Button>
        </div>
      </div>
    </div>
  );
}

//WISDOM KINDLY FIX UP THE PAYMENT TOTAL FOR THIS..
// It currently selects tables, and table quanitiy 
// The payment logic doesnt add the extra price for each quanitity.. so FIX IT.