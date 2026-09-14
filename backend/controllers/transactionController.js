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
module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
