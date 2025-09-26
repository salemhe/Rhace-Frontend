import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  icon,
  change,
  comparison = "vs last week",
  className,
}) {
  const isPositive = change >= 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md",
        "sm:flex-col sm:items-start sm:gap-2",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-xl font-semibold">{value}</h3>
        </div>
      </div>
      <p
        className={cn(
          "mt-2 text-sm font-medium",
          isPositive ? "text-green-600" : "text-red-600"
        )}
      >
        {isPositive ? "↑" : "↓"} {Math.abs(change)}%{" "}
        <span className="text-gray-400 font-normal">{comparison}</span>
      </p>
    </div>
  );
}
