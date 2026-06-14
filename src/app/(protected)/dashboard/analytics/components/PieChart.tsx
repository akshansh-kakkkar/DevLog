import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
interface postChartProps {
  publishCount: number;
  scheduleCount: number;
  draftCount: number;
}

const COLORS = ["#00879C", "#7AC7D3",  "#A7DDE4",
 ];
export default function PostPieChart({
  publishCount,
  draftCount,
  scheduleCount,
}: postChartProps) {
  const data = [
    { name: "Published", value: publishCount },
    { name: "Draft", value: draftCount },
    { name: "Scheduled", value: scheduleCount },
  ];
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey={"value"} nameKey={"name"} outerRadius={100}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
