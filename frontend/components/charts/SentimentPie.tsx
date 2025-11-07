"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function SentimentPie({ data }: { data: any[] }) {
  const result = [
    { name: "Positive", value: data.filter((p: any) => p.sentiment === "Positive").length },
    { name: "Negative", value: data.filter((p: any) => p.sentiment === "Negative").length },
    { name: "Mixed", value: data.filter((p: any) => p.sentiment === "Mixed").length },
  ];

  const COLORS = ["#16a34a", "#dc2626", "#f59e0b"];

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Sentiment</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={result} cx="50%" cy="50%" outerRadius={120} dataKey="value" label>
              {result.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
