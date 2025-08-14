import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ActivityBar({ data = [] }) {
  // data esperado: [{ date: '2025-08-01', count: 5 }, ...]
  const chartData = data.map(d => ({ name: (d.date||d.day||"").slice(5), value: Number(d.count||0) }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
