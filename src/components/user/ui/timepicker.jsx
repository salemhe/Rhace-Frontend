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

export function TimePicker({
  value,
  onChange,
  className,
  slot,
}) {
  const [open, setOpen] = useState(false);
  const [slots] = useState(slot || [
    '09:00 AM', '09:30 AM', '10:00 AM', '11:30 AM',
    '01:00 PM', '02:00 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '06:00 PM', '06:30 PM', '07:30 PM',
    '08:00 PM', '09:00 PM',
  ]);

  return (
    <div>

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
              Available Time
            </Label>
            {value ? value : "Select time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-98 overflow-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ">
            {slots.map((t) => (
              <button
                key={t}
                onClick={() => { onChange?.(t); setOpen(false); }}
                className={`px-1 cursor-pointer py-2 text-sm rounded-lg border self-stretch 
                  ${t === value
                    ? 'bg-teal-700 border-teal-700 text-white'
                    : 'border-teal-700 text-teal-700 hover:bg-teal-50'
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
