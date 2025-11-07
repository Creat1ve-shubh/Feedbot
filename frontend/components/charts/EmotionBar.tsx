"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function EmotionBar({ data }: { data: any[] }) {
  const emotionMap: Record<string, number> = {};
  data.forEach((p: any) => {
    if (Array.isArray(p.emotion)) {
      p.emotion.forEach((e: string) => {
        emotionMap[e] = (emotionMap[e] || 0) + 1;
      });
    }
  });
  const chartData = Object.entries(emotionMap).map(([name, count]) => ({ name, count }));

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Emotions</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
