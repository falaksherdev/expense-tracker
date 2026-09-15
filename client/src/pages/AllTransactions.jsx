import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";
import CategoryDropdown from "../components/CategoryDropdown";
import {
  TYPE_LABELS,
  TYPE_COLORS,
  DEFAULT_CATEGORIES,
} from "../constants/categories";
import AppLayout from "../components/AppLayout";
import TransactionForm from "../components/TransactionForm";

const TYPE_FILTERS = ["all", "income", "expense", "investment", "lent"];

export default function AllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/transactions");
      setTransactions(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError("Could not delete transaction");
    } finally {
      setDeletingId(null);
    }
  };

  const fmt = (n) =>
    new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(
      Math.abs(n),
    );

  const allCategoryOptions = [
    ...new Set(Object.values(DEFAULT_CATEGORIES).flat()),
  ];

  const filtered = transactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    return true;
  });

  const grouped = filtered.reduce((acc, t) => {
    const key = new Date(t.date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const handleUpdated = () => {
    fetchTransactions();
    setEditingTransaction(null);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-serif text-2xl text-text mb-6">All transactions</h1>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1.5">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  typeFilter === t
                    ? "bg-gold text-ink border-gold font-semibold"
                    : "bg-surface text-muted border-border hover:border-gold/40"
                }`}
              >
                {t === "all" ? "All" : TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="w-48">
            <CategoryDropdown
              options={["All categories", ...allCategoryOptions]}
              value={categoryFilter || "All categories"}
              onChange={(val) =>
                setCategoryFilter(val === "All categories" ? "" : val)
              }
              onAddNew={() => {}}
            />
          </div>
        </div>

        {error && (
          <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {loading ? (
          <Loader label="Loading transactions" fullScreen={false} />
        ) : filtered.length === 0 ? (
          <div className="text-dim text-sm text-center py-16">
            No transactions match these filters.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <div className="text-dim text-xs tracking-wide mb-2">
                  {dateLabel}
                </div>
                <div className="bg-surface border border-border rounded-lg divide-y divide-border/60">
                  {items.map((t) => (
                    <div
                      key={t._id}
                      className="flex items-center gap-4 px-4 py-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-text text-sm truncate">
                          {t.category}
                        </div>
                        <div className="text-dim text-xs truncate">
                          {t.personName ? t.personName : t.description || "—"}
                        </div>
                      </div>

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
                        className={`w-24 text-right font-mono text-sm shrink-0 ${t.type === "income" ? "text-sage" : "text-text"}`}
                      >
                        {t.type === "income" ? "+" : "−"} Rs {fmt(t.amount)}
                      </div>
                      <button
                        onClick={() => setEditingTransaction(t)}
                        className="text-dim hover:text-gold text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        disabled={deletingId === t._id}
                        className="text-dim hover:text-rust text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0 disabled:opacity-50"
                      >
                        {deletingId === t._id ? "..." : "Delete"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingTransaction && (
        <TransactionForm
          existingTransaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSuccess={handleUpdated}
        />
      )}
    </AppLayout>
  );
}
