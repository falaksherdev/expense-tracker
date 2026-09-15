const Transaction = require("../models/Transaction");

const addTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, personName, date } = req.body;

    if (!type || !category || !amount) {
      return res
        .status(400)
        .json({ message: "Type, category, and amount are required" });
    }

    if (type === "lent" && !personName) {
      return res
        .status(400)
        .json({ message: "Person name is required for lending" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      category,
      amount,
      description,
      personName: type === "lent" ? personName : null,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      date: -1,
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this transaction" });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this transaction" });
    }

    await transaction.deleteOne();

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;

    const { start, end } = getDateRange(period, startDate, endDate);

    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    });

    let income = 0,
      expense = 0,
      investment = 0,
      lent = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      if (t.type === "expense") expense += t.amount;
      if (t.type === "investment") investment += t.amount;
      if (t.type === "lent") lent += t.amount;
    });

    const outgoing = expense + investment + lent;
    const balance = income - outgoing;
    const saved = investment + lent;

    res.status(200).json({
      period: period || "monthly",
      dateRange: { start, end },
      income,
      expense,
      investment,
      lent,
      outgoing,
      balance,
      saved,
      transactionCount: transactions.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

function getDateRange(period, customStart, customEnd) {
  const now = new Date();
  let start,
    end = new Date();

  switch (period) {
    case "weekly": {
      const day = now.getDay();

      const diff = day === 0 ? 6 : day - 1;

      start = new Date(now);
      start.setDate(now.getDate() - diff);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "yearly": {
      start = new Date(now.getFullYear(), 0, 1);
      break;
    }
    case "custom": {
      start = new Date(customStart);
      end = new Date(customEnd);
      break;
    }
    case "monthly":
    default: {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
  }

  return { start, end };
}
const getChartData = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    const { start, end } = getDateRange(period, startDate, endDate);

    const transactions = await Transaction.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end },
    });

    const categoryMap = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });
    const categoryBreakdown = Object.entries(categoryMap).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    const trend = await getTrendData(req.user._id, period);

    res.status(200).json({ categoryBreakdown, trend });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
async function getTrendData(userId, period) {
  const now = new Date();
  const buckets = [];

  if (period === "weekly") {
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));
      buckets.push({
        label: dayStart.toLocaleDateString("en-PK", { weekday: "short" }),
        start: dayStart,
        end: dayEnd,
      });
    }
  } else if (period === "yearly") {
    for (let m = 0; m <= now.getMonth(); m++) {
      const monthStart = new Date(now.getFullYear(), m, 1);
      const monthEnd = new Date(now.getFullYear(), m + 1, 0, 23, 59, 59);
      buckets.push({
        label: monthStart.toLocaleDateString("en-PK", { month: "short" }),
        start: monthStart,
        end: monthEnd,
      });
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1,
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0,
        23,
        59,
        59,
      );
      buckets.push({
        label: monthStart.toLocaleDateString("en-PK", { month: "short" }),
        start: monthStart,
        end: monthEnd,
      });
    }
  }

  const results = [];
  for (const bucket of buckets) {
    const txns = await Transaction.find({
      userId,
      date: { $gte: bucket.start, $lte: bucket.end },
    });

    let income = 0,
      outgoing = 0;
    txns.forEach((t) => {
      if (t.type === "income") income += t.amount;
      if (["expense", "investment", "lent"].includes(t.type))
        outgoing += t.amount;
    });

    results.push({ label: bucket.label, income, outgoing });
  }

  return results;
}
module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getChartData,
};
