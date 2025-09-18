// components/TimePicker.tsx
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { FiMinus, FiPlus } from "react-icons/fi";

const GUEST_CONFIG = {
  adults:    { label: 'Adults',   subtitle: '18 years and above',    min: 1 },
  children:  { label: 'Children', subtitle: '18 years and under',    min: 0 },
  infants:   { label: 'Infant',   subtitle: 'Under the age of 2',     min: 0 },
};

export function GuestPicker({
  value,
  onChange,
  className,
}) {
  const [open, setOpen] = useState(false);
    const [counts, setCounts] = useState({
      adults: 1,
      children: 0,
      infants: 0,
    });

  const inc = (type) => {
    setCounts((c) => {
      const next = { ...c, [type]: c[type] + 1 };
      onChange?.((next.adults + next.children + next.infants).toLocaleString());
      return next;
    });
  };
  const dec = (type) => {
    setCounts((c) => {
      const min = GUEST_CONFIG[type].min;
      const nextVal = Math.max(c[type] - 1, min);
      const next = { ...c, [type]: nextVal };
      onChange?.((next.adults + next.children + next.infants).toLocaleString());
      return next;
    });
  };

  return (
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
            Guest
          </Label>
          {value ? `${value} ${Number(value) > 1 ? 'Guests' : 'Guest'}` : "Number of guests"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 mt-2 overflow-auto">
        {(Object.keys(GUEST_CONFIG)).map((type) => {
          const { label, subtitle, min } = GUEST_CONFIG[type];
          const val = counts[type];
          return (
            <div
              key={type}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex flex-col items-start">
                <div className="font-medium text-gray-800">{label}</div>
                <div className="text-xs text-gray-500">{subtitle}</div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => dec(type)}
                  disabled={val <= min}
                  className="p-1 border rounded-full disabled:opacity-40"
                >
                  <FiMinus className="w-4 h-4 text-gray-600" />
                </button>
                <div className="outline-1 h-8 px-3 outline-offset-[-1px] outline-neutral-200 inline-flex items-center justify-center">
                  <span className=" text-center font-medium text-sm text-gray-700 ">
                    {val}
                  </span>
                </div>
                <button
                  onClick={() => inc(type)}
                  className="p-1 border rounded-full"
                >
                  <FiPlus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
