import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
    month: string;
    posts: number;
}
const COLORS = [ "#00687A",
  "#00879C",
  "#2A9AAD",
  "#4AB0BF",
  "#7AC7D3",
  "#A7DDE4",
  "#15803D",
  "#22C55E",
  "#B45309",
  "#F59E0B",
  "#1D4ED8",
  "#7C3AED",];
export default function PostBarGraph({ data }: { data: DataPoint[] }) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray={"3,3"} />
          <XAxis dataKey={"month"} />
          <YAxis />
          <Tooltip />
          <Bar radius={[6,6,0,0]} dataKey={"posts"}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
