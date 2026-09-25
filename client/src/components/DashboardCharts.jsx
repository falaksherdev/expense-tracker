import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import axiosInstance from "../api/axiosInstance";
import Loader from "./Loader";
import { useCurrency } from "../hooks/useCurrency";

const PIE_COLORS = [
  "#D4A94B",
  "#6FA787",
  "#7C9CBF",
  "#9C88C4",
  "#C4644B",
  "#75798A",
];

export default function DashboardCharts({ period, customRange }) {
  const { fmtWithSymbol } = useCurrency();

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (period === "custom" && (!customRange.startDate || !customRange.endDate))
      return;

    const fetchChartData = async () => {
      setLoading(true);
      setError("");
      try {
        const params = { period };
        if (period === "custom") {
          params.startDate = customRange.startDate;
          params.endDate = customRange.endDate;
        }
        const { data } = await axiosInstance.get("/transactions/chart-data", {
          params,
        });
        setChartData(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [period, customRange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface border border-border rounded-lg p-5">
          <Loader label="Loading chart" fullScreen={false} size="sm" />
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <Loader label="Loading chart" fullScreen={false} size="sm" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-6">
        {error}
      </div>
    );
  }

  if (!chartData) return null;

  const { categoryBreakdown, trend } = chartData;
  const hasExpenseData = categoryBreakdown && categoryBreakdown.length > 0;
  const hasTrendData =
    trend && trend.some((t) => t.income > 0 || t.outgoing > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-surface border border-border rounded-lg p-5">
        <div className="font-serif text-base text-text mb-4">
          Where the spent portion went
        </div>

        {!hasExpenseData ? (
          <div className="text-dim text-sm text-center py-12">
            No expenses in this period yet.
          </div>
        ) : (
          <div className="flex sm:flex-row flex-col items-center gap-5">
            <div className="w-36 h-36 shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    innerRadius={44}
                    outerRadius={66}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryBreakdown.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#171A24",
                      border: "1px solid #242838",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    itemStyle={{ color: "#EDEDED" }}
                    formatter={(v) => [fmtWithSymbol(v), ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              {categoryBreakdown.map((entry, i) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-muted flex-1 truncate">
                    {entry.name}
                  </span>
                  <span className="text-dim font-mono shrink-0">
                    {fmtWithSymbol(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface border border-border rounded-lg p-5">
        <div className="font-serif text-base text-text mb-4">
          Income vs sent out
        </div>

        {!hasTrendData ? (
          <div className="text-dim text-sm text-center py-12">
            Not enough data yet to show a trend.
          </div>
        ) : (
          <>
            <div className="w-full h-44">
              <ResponsiveContainer>
                <LineChart
                  data={trend}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid stroke="#242838" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#75798A"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#75798A"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#171A24",
                      border: "1px solid #242838",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    itemStyle={{ color: "#EDEDED" }}
                    formatter={(v) => fmtWithSymbol(v)}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#6FA787"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="outgoing"
                    stroke="#C4644B"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-xs text-muted mt-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage" /> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rust" /> Sent out
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
