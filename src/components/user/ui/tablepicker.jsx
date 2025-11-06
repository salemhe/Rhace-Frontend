// components/TimePicker.tsx
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "../../ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TablePicker({
    value,
    onChange,
    className,
}) {
    const [open, setOpen] = useState(false);
    const tables = [
        "VIP Lounge",
        "Cocktail tables",
        "Poseur tables",
        "LED tables",
        "Wooden tables",
        "Glass-top tables",
        "Barrel tables",
        "pedestal tables"
    ];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal bg-[#F9FAFB] border border-[#E5E7EB] flex-col items-start rounded-xl px-6 min-w-[150px] flex h-[60px]",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <Label htmlFor="date" className="text-black">
                        Table
                    </Label>
                    {value ? value : "Select time"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="overflow-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ">
            {tables.map((t) => (
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
    );
}
