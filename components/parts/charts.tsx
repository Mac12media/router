"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";

const COLORS = ["#FF7200", "var(--expo-divider, #D1D5DB)"];

export default function CircleChart({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
}) {
  const data = [
    { name: label, value },
    { name: "Remaining", value: Math.max(0, max - value) },
  ];
  const colors = [color || COLORS[0], COLORS[1]];

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-20 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="50%"
              outerRadius="100%"
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
              <Label
                value={value}
                position="center"
                fontSize={14}
                fontWeight="bold"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
