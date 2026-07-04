import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlyUsage {
  hour: string;
  averageWatts: number;
  DrawingRoom: number;
  WorkRoom1: number;
  WorkRoom2: number;
}

export default function UsageGraph() {
  const { data, isLoading, isError } = useQuery<HourlyUsage[]>({
    queryKey: ["usage-hourly"],
    queryFn: async () => {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usage/hourly`,
      ).then((res) => res.json());
      return result?.data || [];
    },
  });

  return (
    <div className="p-5 pt-2 pb-1 overflow-y-auto">
      <h3 className="text-lg font-semibold flex items-center gap-3 mb-3">
        Usage graph
      </h3>

      {isLoading ? (
        <div className="text-sm text-zinc-400">Loading usage history...</div>
      ) : isError ? (
        <div className="text-sm text-red-500">Error loading usage history</div>
      ) : !data || data.length === 0 ? (
        <div className="text-sm text-zinc-400">No usage data yet</div>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="wattsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "#71717a" }}
                interval="preserveStartEnd"
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                }}
                formatter={(value) => [`${value}W`, "Avg Watts"]}
              />
              <Area
                type="monotone"
                dataKey="averageWatts"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#wattsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
