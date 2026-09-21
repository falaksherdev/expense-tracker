const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    preferences: {
      committee: { type: Boolean, default: false },
      lending: { type: Boolean, default: false },
      investments: { type: Boolean, default: false },
      onboarded: { type: Boolean, default: false },
      currency: { type: String, default: "PKR" },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
