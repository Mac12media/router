"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";

const COLORS = ["#FF7200", "#e5e5e5"];

export default function MatchCircleChart({ label, value, max }: { label: string; value: number; max: number }) {
  const data = [
    { name: label, value },
    { name: "Remaining", value: Math.max(0, max - value) },
  ];

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-16 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="75%"
              outerRadius="100%"
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <Label
                value={label}
                position="center"
                fontSize={14}
                fontWeight="bold"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
