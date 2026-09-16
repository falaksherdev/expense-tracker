import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import PeriodToggle from "../components/PeriodToggle";
import SummaryCard from "../components/SummaryCard";
import { TYPE_LABELS, TYPE_COLORS } from "../constants/categories";
import TransactionForm from "../components/TransactionForm";
import Loader from "../components/Loader";
import AppLayout from "../components/AppLayout";
import DashboardCharts from "../components/DashboardCharts";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [period, setPeriod] = useState("monthly");
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const fetchSummary = useCallback(async () => {
    if (period === "custom" && (!customRange.startDate || !customRange.endDate))
      return;

    setLoading(true);
    setError("");
    try {
      const params = { period };
      if (period === "custom") {
        params.startDate = customRange.startDate;
        params.endDate = customRange.endDate;
      }
      const { data } = await axiosInstance.get("/transactions/summary", {
        params,
      });
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load summary");
    } finally {
      setLoading(false);
    }
  }, [period, customRange]);

  const fetchTransactions = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/transactions");
      setTransactions(data.slice(0, 8));
    } catch (err) {
      console.error("Could not load transactions");
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const fmt = (n) =>
    new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(
      Math.abs(n || 0),
    );
  const savingsRate = summary?.income
    ? Math.round(((summary.income - summary.outgoing) / summary.income) * 100)
    : 0;

  const handleTransactionAdded = () => {
    fetchSummary();
    fetchTransactions();
  };

  const prefs = user?.preferences || {};
  const showInvestmentRow =
    prefs.committee || prefs.investments || summary?.investment > 0;
  const showLentRow = prefs.lending || summary?.lent > 0;
  const hasBreakdown = showInvestmentRow || showLentRow;
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="font-serif text-2xl text-text">Overview</h1>
          <PeriodToggle
            period={period}
            onChange={setPeriod}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
          <button
            onClick={() => setShowForm(true)}
            className="bg-gold text-ink text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
          >
            + Add transaction
          </button>
        </div>

        {error && (
          <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {loading ? (
          <Loader label="Loading summary" fullScreen={false} size="sm" />
        ) : summary ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-5">
              <SummaryCard
                label="Balance"
                value={`Rs ${fmt(summary.balance)}`}
                sub="income minus everything sent out"
              />
              <SummaryCard
                label="Income"
                value={`+ Rs ${fmt(summary.income)}`}
                valueColor="text-sage"
                sub="salary + freelance"
              />
              <SummaryCard
                label={
                  hasBreakdown ? (
                    <button
                      onClick={() => setExpanded((e) => !e)}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      Sent out{" "}
                      <span className="text-dim">{expanded ? "−" : "+"}</span>
                    </button>
                  ) : (
                    "Sent out"
                  )
                }
                value={`− Rs ${fmt(summary.outgoing)}`}
                valueColor="text-rust"
                sub={
                  hasBreakdown
                    ? "tap to see breakdown"
                    : "your expenses this period"
                }
              />
              <SummaryCard
                label="Savings rate"
                value={`${savingsRate}%`}
                valueColor="text-gold"
                sub="of income not sent out"
              />
            </div>

            {hasBreakdown && expanded && (
              <div className="bg-surface border border-border rounded-b-lg px-5 py-4 mb-6 -mt-1">
                <BreakdownRow
                  label="Spent (won't come back)"
                  value={summary.expense}
                  color="bg-rust"
                  textColor="text-rust"
                  total={summary.outgoing}
                  fmt={fmt}
                />
                {showInvestmentRow && (
                  <BreakdownRow
                    label="Kameti + investment"
                    value={summary.investment}
                    color="bg-gold"
                    textColor="text-gold"
                    total={summary.outgoing}
                    fmt={fmt}
                  />
                )}
                {showLentRow && (
                  <BreakdownRow
                    label="Lent out"
                    value={summary.lent}
                    color="bg-slate"
                    textColor="text-slate"
                    total={summary.outgoing}
                    fmt={fmt}
                    last
                  />
                )}
              </div>
            )}
            <DashboardCharts period={period} customRange={customRange} />

            <div className="bg-surface border border-border rounded-lg p-5 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg text-text">
                  Recent activity
                </h2>
              </div>

              {transactions.length === 0 ? (
                <div className="text-dim text-sm text-center py-8">
                  No transactions yet — add your first one to get started.
                </div>
              ) : (
                <div>
                  {transactions.map((t) => (
                    <div
                      key={t._id}
                      className="flex items-center gap-4 py-2.5 border-b border-border/60 last:border-0"
                    >
                      <div className="text-dim text-xs w-16 shrink-0">
                        {new Date(t.date).toLocaleDateString("en-PK", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="text-text text-sm">{t.category}</div>
                        {t.personName && (
                          <div className="text-dim text-xs">{t.personName}</div>
                        )}
                      </div>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full border"
                        style={{
                          color: TYPE_COLORS[t.type],
                          borderColor: TYPE_COLORS[t.type],
                        }}
                      >
                        {TYPE_LABELS[t.type]}
                      </span>
                      <div
                        className={`w-24 text-right font-mono text-sm ${t.type === "income" ? "text-sage" : "text-text"}`}
                      >
                        {t.type === "income" ? "+" : "−"} Rs {fmt(t.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSuccess={handleTransactionAdded}
        />
      )}
    </AppLayout>
  );
}

function BreakdownRow({ label, value, color, textColor, total, fmt, last }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className={last ? "" : "mb-3"}>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted">{label}</span>
        <span className={`font-mono ${textColor}`}>
          Rs {fmt(value)} · {pct}%
        </span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
