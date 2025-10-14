import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
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
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const DatePicker = ({
  value,
  onChange,
  className,
  title = "Select date"
}) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows = [];
  let days = [];
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
                   ${!isSameMonth(cloneDay, monthStart)
                ? "text-neutral-400 "
                : isSameDay(cloneDay, value || new Date())
                  ? "bg-indigo-800 text-white"
                  : "text-gray-700 hover:bg-indigo-100 bg-gray-100"
              }
                 `}
            onClick={() => {
              onChange?.(cloneDay);
              setOpen(false);
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
    <div>
      {" "}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-[#F9FAFB] border border-[#E5E7EB] flex-col items-start rounded-xl px-6 min-w-[150px] flex h-[60px]",
              !value && "text-muted-foreground", className
            )}
          >
            <Label htmlFor="date" className="text-black">
              {title}
            </Label>
            {value ? format(value, "do MMM, yyyy") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 sm:w-96" align="start">
          {/* <Calendar
            initialFocus
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => date < new Date()}
          /> */}
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
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
