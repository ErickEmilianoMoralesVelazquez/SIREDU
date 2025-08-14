import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function CategoryPie({ data = [] }) {
  const chartData = data.map(d => ({ name: d.category, value: Number(d.count || d.value || 0) }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" label />
          <Tooltip />
          {chartData.map((_, i) => <Cell key={i} />)}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
