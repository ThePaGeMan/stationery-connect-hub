import { ResponsiveContainer } from "recharts";
import { ReactElement } from "react";

interface SimpleChartProps {
  children: ReactElement;
  className?: string;
}

export function SimpleChart({ children, className }: SimpleChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}