import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Edit } from "@/public/icons/icons";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import { Edit3 } from "@/public/icons/icons";

const DatePicker = ({
  value,
  onChange,
  className,
  title = "Select date",
  chevron,
  edit,
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
                   ${
                     !isSameMonth(cloneDay, monthStart)
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
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 ">
          {days}
        </div>,
      );
      days = [];
    }
  };

  work();
  return (
    <div>
      {" "}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal bg-[#F9FAFB] border border-[#E5E7EB] items-center rounded-xl px-6! min-w-[150px] flex h-[60px]",
              !value && "text-muted-foreground", className
            )}
          >
            <div className="gap-2 flex flex-col">
              <Label htmlFor="date" className="text-black text-xs">
                {title}
              </Label>
              {value ? format(value, "do MMM, yyyy") : "Select date"}
            </div>
            {chevron && <ChevronDown className="size-5" />}
            {edit && <Edit3 className="size-5" />}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 sm:w-96" align="start">
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
