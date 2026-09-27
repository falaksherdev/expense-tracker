const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
      maxlength: [1000, "Feedback cannot exceed 1000 characters"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Feedback", feedbackSchema);
