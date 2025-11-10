// components/atoms/StatCard.tsx
import { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  className 
}: StatCardProps): JSX.Element {
  const isTrendPositive = trend === "up";
  const trendColor = isTrendPositive ? "text-green-600" : "text-red-600";
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && trendValue && (
          <p className={`text-xs ${trendColor} flex items-center mt-1`}>
            {isTrendPositive ? "↑" : "↓"} {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
}