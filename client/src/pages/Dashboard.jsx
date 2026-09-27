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
import { useCurrency } from "../hooks/useCurrency";
import { Link } from "react-router-dom";
import VerifyEmailBanner from "../components/VerifyEmailBanner";

export default function Dashboard() {
  const { fmtWithSymbol } = useCurrency();

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
            className="bg-gold text-ink text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors cursor-pointer"
          >
            + Add transaction
          </button>
        </div>
        <VerifyEmailBanner />
        {error && (
          <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {loading ? (
          <Loader label="Loading summary" fullScreen={false} size="sm" />
        ) : summary ? (
          <>
            {/* 4-card summary grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-5">
              <SummaryCard
                label="Balance"
                value={`${fmtWithSymbol(summary.balance)}`}
                sub="after everything sent out"
              />
              <SummaryCard
                label="Income"
                value={`+ ${fmtWithSymbol(summary.income)}`}
                valueColor="text-sage"
                sub="salary + freelance"
              />
              <SummaryCard
                label={
                  hasBreakdown ? (
                    <button
                      onClick={() => setExpanded((e) => !e)}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      Sent out{" "}
                      <span className="text-dim">{expanded ? "−" : "+"}</span>
                    </button>
                  ) : (
                    "Sent out"
                  )
                }
                value={`− ${fmtWithSymbol(summary.outgoing)}`}
                valueColor="text-rust"
                sub={hasBreakdown ? "tap to expand" : "your expenses"}
              />
              <SummaryCard
                label="Savings rate"
                value={`${savingsRate}%`}
                valueColor="text-gold"
                sub="of income saved"
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
                  fmtWithSymbol={fmtWithSymbol}
                />
                {showInvestmentRow && (
                  <BreakdownRow
                    label="Kameti + investment"
                    value={summary.investment}
                    color="bg-gold"
                    textColor="text-gold"
                    total={summary.outgoing}
                    fmtWithSymbol={fmtWithSymbol}
                  />
                )}
                {showLentRow && (
                  <BreakdownRow
                    label="Lent out"
                    value={summary.lent}
                    color="bg-slate"
                    textColor="text-slate"
                    total={summary.outgoing}
                    fmtWithSymbol={fmtWithSymbol}
                    last
                  />
                )}
              </div>
            )}
            <DashboardCharts period={period} customRange={customRange} />
            <div className="bg-surface border border-border rounded-lg p-4 sm:p-5 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-base sm:text-lg text-text">
                  Recent activity
                </h2>
                <Link
                  to="/transactions"
                  className="text-gold text-xs sm:text-sm hover:underline"
                >
                  View all
                </Link>
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
                      className="py-3 border-b border-border/60 last:border-0"
                    >
                      <div className="flex items-start gap-3 mb-1.5 sm:mb-0">
                        <div className="text-dim text-[11px] sm:text-xs w-12 sm:w-16 shrink-0 pt-0.5">
                          {new Date(t.date).toLocaleDateString("en-PK", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-text text-sm truncate">
                            {t.category}
                          </div>
                          {t.personName && (
                            <div className="text-dim text-xs truncate">
                              {t.personName}
                            </div>
                          )}
                        </div>

                        <span
                          className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full border shrink-0"
                          style={{
                            color: TYPE_COLORS[t.type],
                            borderColor: TYPE_COLORS[t.type],
                          }}
                        >
                          {TYPE_LABELS[t.type]}
                        </span>
                        <div
                          className={`hidden sm:block w-24 text-right font-mono text-sm shrink-0 ${t.type === "income" ? "text-sage" : "text-text"}`}
                        >
                          {t.type === "income" ? "+" : "−"}{" "}
                          {fmtWithSymbol(t.amount)}
                        </div>
                      </div>

                      <div className="flex sm:hidden items-center justify-between pl-15">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full border shrink-0"
                          style={{
                            color: TYPE_COLORS[t.type],
                            borderColor: TYPE_COLORS[t.type],
                          }}
                        >
                          {TYPE_LABELS[t.type]}
                        </span>
                        <div
                          className={`font-mono text-xs ${t.type === "income" ? "text-sage" : "text-text"}`}
                        >
                          {t.type === "income" ? "+" : "−"}{" "}
                          {fmtWithSymbol(t.amount)}
                        </div>
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

function BreakdownRow({
  label,
  value,
  color,
  textColor,
  total,
  fmtWithSymbol,
  last,
}) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className={last ? "" : "mb-3"}>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted">{label}</span>
        <span className={`font-mono ${textColor}`}>
          {fmtWithSymbol(value)} · {pct}%
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
