"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TopicBar({ data }: { data: any[] }) {
  const topicMap: Record<string, number> = {};
  data.forEach((p: any) => {
    if (Array.isArray(p.topics)) {
      p.topics.forEach((t: string) => {
        topicMap[t] = (topicMap[t] || 0) + 1;
      });
    }
  });
  const chartData = Object.entries(topicMap).map(([name, count]) => ({ name, count }));

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Topics</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
