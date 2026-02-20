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
import { ChevronDown } from "lucide-react";
import { Edit3 } from "@/public/icons/icons";

export function TablePicker({
    value,
    onChange,
    className,
    tables,
    loading,
    chevron,
    edit,
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger disabled={!tables} asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full text-left font-normal bg-[#F9FAFB] border border-[#E5E7EB] items-center justify-between rounded-xl !px-6 min-w-[150px] flex h-[60px]",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <div className="gap-2 flex flex-col">
                        <Label htmlFor="date" className="text-black text-xs">
                            Table
                        </Label>
                        {loading ? "Loading Tables..." : value ? value : "Select table"}
                    </div>
                    {chevron && <ChevronDown className="size-5" />}
                    {edit && <Edit3 className="size-5" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="overflow-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ">
                    {tables && tables.map((t) => (
                        <button
                            key={t._id}
                            onClick={() => { onChange?.(t); setOpen(false); }}
                            className={`px-1 cursor-pointer py-2 text-sm rounded-lg border self-stretch 
                  ${t.name === value
                                    ? 'bg-teal-700 border-teal-700 text-white'
                                    : 'border-teal-700 text-teal-700 hover:bg-teal-50'
                                }
                `}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
