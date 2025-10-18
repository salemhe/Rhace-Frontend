import { Card } from "@/components/ui/card";

export function StatCard({ title, value, change, icon: Icon, iconBg, iconColor, trend = "up" }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-xl md:text-2xl font-bold mb-1">{value}</p>
          <p className="text-xs text-muted-foreground">
            <span className={trend === "up" ? "text-success" : "text-destructive"}>
              {trend === "up" ? "↑" : "↓"} {change}
            </span>
          </p>
        </div>
        <div className={`p-3 rounded-lg ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
