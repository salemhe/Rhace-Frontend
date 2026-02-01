import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "../ui/svg";

export function StatCard({
  title,
  value,
  icon,
  change,
  comparison = "vs last week",
  color,
  className,
}) {
  const isPositive = change >= 0;

  return (
    <div
      className={cn(
        "flex justify-between w-full rounded-xl bg-white p-4",
        "flex-col items-start sm:gap-2",
        className
      )}
    >
      <div className="flex items-center gap-3 w-full justify-between">
        <div>
          <div className="flex justify-between gap-2">
            <p className="text-sm text-gray-500">{title}</p>
            <div className={`flex md:hidden h-10 w-10 items-center border justify-center shrink-0 rounded-lg ${color === "blue" ? "border-[#4C98F1] bg-[#E3F0FF]" : color === "green" ? "border-[#7DFB79] bg-[#ECF9EC]" : color === "orange" ? "bg-[#FFF8DE] border-[#FFEDA9]" : "bg-[#FFD3FC] border-[#FFACF9]"}`}>
          {icon}
        </div>
          </div>
          <h3 className="text-xl font-semibold">{value}</h3>
        </div>
        <div className={`hidden md:flex h-10 w-10 items-center border justify-center shrink-0 rounded-lg ${color === "blue" ? "border-[#4C98F1] bg-[#E3F0FF]" : color === "green" ? "border-[#7DFB79] bg-[#ECF9EC]" : color === "orange" ? "bg-[#FFF8DE] border-[#FFEDA9]" : "bg-[#FFD3FC] border-[#FFACF9]"}`}>
          {icon}
        </div>
      </div>
      <p
        className={cn(
          "mt-2 text-[10px] md:text-sm font-medium flex items-center gap-1",
          isPositive ? "text-[#37703F]" : "text-[#EF4444]"
        )}
      >
        <span className="flex items-center">
          {isPositive ? <ArrowUp /> : <ArrowDown />} {Math.abs(change)}%{" "}
        </span>
        <span className="text-gray-400 font-normal">{comparison}</span>
      </p>
    </div>
  );
}
