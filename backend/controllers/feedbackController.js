const Feedback = require("../models/Feedback");
const sendEmail = require("../utils/sendEmail");

const submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length < 5) {
      return res
        .status(400)
        .json({ message: "Please write a bit more detail" });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      userEmail: req.user.email,
      message: message.trim(),
    });

    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New feedback received",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2>New Feedback</h2>

        <p>
          <strong>From:</strong> ${req.user.name}
        </p>

        <p>
          <strong>Email:</strong> ${req.user.email}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <div style="
          background:#f5f5f5;
          padding:12px 16px;
          border-radius:8px;
          white-space:pre-wrap;
        ">
          ${message.trim()}
        </div>

        <p style="color:#888; font-size:12px; margin-top:20px;">
          Sent on ${new Date().toLocaleString()}
        </p>
      </div>
    `,
      });
    } catch (emailError) {
      console.error("Feedback email notification failed:", emailError.message);
    }

    res.status(201).json({ message: "Thank you for your feedback!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { submitFeedback };
