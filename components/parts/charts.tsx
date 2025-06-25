"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";

const COLORS = ["#FF7200", "#000000"];

export default function CircleChart({ label, value, max }: { label: string; value: number; max: number }) {
  const data = [
    { name: label, value },
    { name: "Remaining", value: Math.max(0, max - value) },
  ];

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-28 h-28">
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <Label
                value={value}
                position="center"
                fontSize={18}
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
