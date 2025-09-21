import React, { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import {
  // FiSearch,
  FiChevronLeft,
  FiChevronRight,
  // FiCalendar,
  // FiClock,
  // FiUsers,
  FiChevronDown,
} from "react-icons/fi";

 export const DateDropdown = ({ selectedDate, onChange }) => {
   const [show, setShow] = useState(false);
   const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
   const ref = useRef();
 
   // close on outside click
   useEffect(() => {
     const onClickOutside = (e) => {
       if (ref.current && !ref.current.contains(e.target )) {
         setShow(false);
       }
     };
     document.addEventListener("mousedown", onClickOutside);
     return () => document.removeEventListener("mousedown", onClickOutside);
   }, []);
 
   // build calendar grid
   const monthStart = startOfMonth(currentMonth);
   const monthEnd = endOfMonth(monthStart);
   const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
   const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
 
   const rows= [];
   let days= [];
   let day = startDate;
   const work = () => {
     while (day <= endDate) {
       for (let i = 0; i < 7; i++) {
         const cloneDay = day;
         days.push(
           <div
             key={cloneDay.toString()}
             className={`
             w-8 h-8 sm:w-12.5 sm:h-12 flex items-center justify-center text-black text-sm font-normal cursor-pointer  outline-1  outline-gray-300 
             ${
               !isSameMonth(cloneDay, monthStart)
                 ? "text-neutral-400 "
                 : isSameDay(cloneDay, selectedDate || new Date())
                 ? "bg-indigo-800 text-white"
                 : "text-gray-700 hover:bg-indigo-100 bg-gray-100"
             }
           `}
             onClick={() => {
               onChange(cloneDay);
               setShow(false);
             }}
           >
             {format(cloneDay, "d")}
           </div>
         );
         day = addDays(day, 1);
       }
       rows.push(
         <div key={day.toString()} className="grid grid-cols-7 ">
           {days}
         </div>
       );
       days = [];
     }
   };
 
     work()
 
   return (
     <div className="relative inline-block text-left w-full" ref={ref}>
       {/* trigger */}
       <div
         className="flex items-center  py-2  rounded cursor-pointer"
         onClick={() => setShow(!show)}
       >
         {/* <FiCalendar className="mr-2 text-gray-500" /> */}
         <span className="flex-1 text-sm text-gray-700">
           {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Pick date"}
         </span>
         <FiChevronDown className="text-gray-500 cursor-pointer " />
       </div>
 
       {/* calendar dropdown */}
       {show && (
         <div className="absolute  mt-4 w-64 sm:w-96 left-0 sm:right-1 bg-white rounded-lg shadow-lg z-50 p-4">
           {/* header */}
           <div className="flex items-center justify-between mb-2 px-2">
             <span className="text-base flex-1 font-medium text-gray-800">
               {format(currentMonth, "MMMM yyyy")}
             </span>
             <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
               <FiChevronLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
             </button>
             <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
               <FiChevronRight className="w-5 h-5 text-gray-600 cursor-pointer" />
             </button>
           </div>
 
           {/* weekday labels */}
           <div className="grid grid-cols-7  text-center text-xs font-semibold text-gray-900 mb-2">
             {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((wd) => (
               <div key={wd}>{wd}</div>
             ))}
           </div>
 
           {/* days grid */}
           <div>{rows}</div>
         </div>
       )}
     </div>
   );
 };
 