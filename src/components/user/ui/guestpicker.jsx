// components/TimePicker.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Edit3 } from "@/public/icons/icons";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const GUEST_CONFIG = {
  adults: { label: "Adults", subtitle: "18 years and above", min: 1 },
  children: { label: "Children", subtitle: "18 years and under", min: 0 },
  infants: { label: "Infant", subtitle: "Under the age of 2", min: 0 },
};

export function GuestPicker({
  value,
  breakdown,  
  maxAdults,
  maxChildren,
  maxInfants,
  onChange,
  className,
  maxGuests,
  chevron,
  edit,
   hideChildren, // ← new
  hideInfants,
}) {
  const [open, setOpen] = useState(false);

  const [counts, setCounts] = useState(() => ({
    adults:   breakdown?.adults   ?? 1,   // ← seed from breakdown
    children: breakdown?.children ?? 0,
    infants:  breakdown?.infants  ?? 0,
  }));

   useEffect(() => {
    if (breakdown) {
      setCounts({
        adults:   breakdown.adults   ?? 1,
        children: breakdown.children ?? 0,
        infants:  breakdown.infants  ?? 0,
      });
    }
  }, [
    breakdown?.adults,
    breakdown?.children,
    breakdown?.infants,
  ]);
  const totalGuests = (c) => c.adults + c.children + c.infants;

  const isDisabled = (type, val, current = counts) => {
    if (type === "adults") {
      return maxAdults !== undefined && val >= maxAdults;
    }

    if (type === "children") {
      return maxChildren !== undefined && val >= maxChildren;
    }

    if (type === "infants") {
      if (maxInfants !== undefined) {
        return val >= maxInfants;
      }

      // fallback rule: infants share adults + children capacity
      const totalWithoutInfants = current.adults + current.children;
      const maxWithoutInfants =
        (maxAdults ?? Infinity) + (maxChildren ?? Infinity);

      return totalWithoutInfants + val >= maxWithoutInfants;
    }

    return false;
  };

const inc = (type) => {
    setCounts((c) => {
      const val = c[type];
      if (isDisabled(type, val, c)) return c;
      const next = { ...c, [type]: val + 1 };
      onChange?.(totalGuests(next), next);   // ← pass breakdown as 2nd arg
      return next;
    });
  };

  const dec = (type) => {
    setCounts((c) => {
      const min = GUEST_CONFIG[type].min;
      const next = { ...c, [type]: Math.max(c[type] - 1, min) };
      onChange?.(totalGuests(next), next);   // ← pass breakdown as 2nd arg
      return next;
    });
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal bg-[#F9FAFB] border border-[#E5E7EB] items-center rounded-xl !px-6 min-w-[150px] flex h-[60px]",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-black text-xs">
              Guest {maxGuests && `( max ${maxGuests})`}
            </Label>
            {value
              ? `${value} ${Number(value) > 1 ? "Guests" : "Guest"}`
              : "Number of guests"}
          </div>
          {chevron && <ChevronDown className="size-5" />}
          {edit && <Edit3 className="size-5" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 mt-2 overflow-auto">
        {Object.keys(GUEST_CONFIG)
  .filter((type) => {
    if (type === "children" && hideChildren) return false;
    if (type === "infants" && hideInfants) return false;
    return true;
  })
  .map((type) => {
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
                  onClick={() => {
                    inc(type);
                  }}
                  className={`p-1 border rounded-full disabled:opacity-40`}
                  disabled={isDisabled(type, val)}
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
