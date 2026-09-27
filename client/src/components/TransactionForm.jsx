import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_CATEGORIES, TYPE_LABELS } from "../constants/categories";
import Calendar from "./Calendar";
import CategoryDropdown from "./CategoryDropdown";
import { useCurrency } from "../hooks/useCurrency";

export default function TransactionForm({
  onClose,
  onSuccess,
  existingTransaction,
}) {
  const { symbol } = useCurrency();

  const { user } = useAuth();
  const isEditMode = Boolean(existingTransaction);

  const prefs = user?.preferences || {};
  const availableTypes = ["expense", "income"];
  if (prefs.committee || prefs.investments) availableTypes.push("investment");
  if (prefs.lending) availableTypes.push("lent");
  if (
    existingTransaction &&
    !availableTypes.includes(existingTransaction.type)
  ) {
    availableTypes.push(existingTransaction.type);
  }

  const [type, setType] = useState(existingTransaction?.type || "expense");
  const [category, setCategory] = useState(existingTransaction?.category || "");
  const [customCategories, setCustomCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [amount, setAmount] = useState(
    existingTransaction?.amount?.toString() || "",
  );
  const [description, setDescription] = useState(
    existingTransaction?.description || "",
  );
  const [personName, setPersonName] = useState(
    existingTransaction?.personName || "",
  );
  const [date, setDate] = useState(
    existingTransaction?.date
      ? new Date(existingTransaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/categories");
        setCustomCategories(data);
      } catch (err) {
        console.error("Could not load custom categories");
      }
    };
    fetchCategories();
  }, []);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    setCategory("");
    setShowAddCategory(false);
  }, [type]);

  let defaultOptionsForType = DEFAULT_CATEGORIES[type] || [];

  if (type === "investment") {
    if (prefs.committee && !prefs.investments) {
      defaultOptionsForType = defaultOptionsForType.filter(
        (c) => c === "Committee",
      );
    } else if (!prefs.committee && prefs.investments) {
      defaultOptionsForType = defaultOptionsForType.filter(
        (c) => c !== "Committee",
      );
    }

    if (
      existingTransaction?.category &&
      !defaultOptionsForType.includes(existingTransaction.category)
    ) {
      defaultOptionsForType = [
        ...defaultOptionsForType,
        existingTransaction.category,
      ];
    }
  }

  const customOptionsForType = customCategories
    .filter((c) => c.type === type)
    .map((c) => c.name);
  const allOptions = [...defaultOptionsForType, ...customOptionsForType];

  const handleAddCustomCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const { data } = await axiosInstance.post("/categories", {
        name: newCategoryName.trim(),
        type,
      });
      setCustomCategories((prev) => [...prev, data]);
      setCategory(data.name);
      setNewCategoryName("");
      setShowAddCategory(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!category) {
      setError("Please select a category");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (type === "lent" && !personName.trim()) {
      setError("Please enter who you lent the money to");
      return;
    }

    const payload = {
      type,
      category,
      amount: Number(amount),
      description,
      personName: type === "lent" ? personName.trim() : undefined,
      date,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await axiosInstance.put(
          `/transactions/${existingTransaction._id}`,
          payload,
        );
      } else {
        await axiosInstance.post("/transactions", payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/40 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl text-text">
            {isEditMode ? "Edit transaction" : "Add transaction"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-dim hover:text-text text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-muted text-xs mb-2 tracking-wide">
              Type
            </label>
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${availableTypes.length}, minmax(0, 1fr))`,
              }}
            >
              {availableTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`text-xs py-2 rounded-lg border transition-colors cursor-pointer ${
                    type === t
                      ? "bg-gold text-ink border-gold font-semibold"
                      : "bg-ink text-muted border-border hover:border-gold/40"
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-muted text-xs mb-2 tracking-wide">
              Category
            </label>
            {!showAddCategory ? (
              <CategoryDropdown
                options={allOptions}
                value={category}
                onChange={setCategory}
                onAddNew={() => setShowAddCategory(true)}
              />
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  maxLength={50}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Pet Expenses"
                  className="flex-1 bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                   placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="bg-gold text-ink text-sm font-semibold px-4 rounded-lg hover:bg-gold/90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName("");
                  }}
                  className="text-dim text-sm px-2"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-muted text-xs mb-2 tracking-wide">
              Amount ({symbol})
            </label>
            <input
              type="number"
              key="amount-field"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d+$/.test(val)) {
                  setAmount(val);
                }
              }}
              onWheel={(e) => e.target.blur()}
              placeholder="0"
              required
              className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm font-mono
               placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
            />
          </div>

          {type === "lent" && (
            <div className="mb-4">
              <label className="block text-muted text-xs mb-2 tracking-wide">
                Lent to
              </label>
              <input
                type="text"
                key="personName-field"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g. Ali"
                className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                 placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
              />
            </div>
          )}

          <div className="mb-4 relative">
            <label className="block text-muted text-xs mb-2 tracking-wide">
              Date
            </label>
            <button
              type="button"
              onClick={() => setShowCalendar((s) => !s)}
              className="w-full text-left bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                         focus:outline-none focus:border-gold/50"
            >
              {new Date(date).toLocaleDateString("en-PK", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </button>

            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-30 bg-surface border border-border rounded-xl shadow-2xl shadow-black/40 p-4 w-72">
                <Calendar
                  startDate={date}
                  endDate={date}
                  onSelect={(range) => {
                    setDate(range.startDate);
                    setShowCalendar(false);
                  }}
                  mode="single"
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-muted text-xs mb-2 tracking-wide">
              Description (optional)
            </label>
            <input
              type="text"
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Grocery run"
              className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                         placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold text-ink font-semibold text-sm rounded-lg py-2.5
                       hover:bg-gold/90 active:scale-[0.99] transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting
              ? isEditMode
                ? "Saving..."
                : "Adding..."
              : isEditMode
                ? "Save changes"
                : "Add transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}
