const Feedback = require("../models/Feedback");
const sendEmail = require("../utils/sendEmail");

// @route   POST /api/feedback
const submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length < 5) {
      return res
        .status(400)
        .json({ message: "Please write a bit more detail" });
    }

    // Pehle database mein save karo — ye hamesha ho, chahe email fail ho jaye
    const feedback = await Feedback.create({
      userId: req.user._id,
      userEmail: req.user.email,
      message: message.trim(),
    });

    // Phir email notification bhejne ki koshish karo — fail ho to bhi feedback save rahega
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL, // aapki personal email
        subject: "New feedback received",
        html: `
          <p><strong>From:</strong> ${req.user.name} (${req.user.email})</p>
          <p><strong>Message:</strong></p>
          <p>${message.trim()}</p>
          <p style="color:#999; font-size:12px;">Sent on ${new Date().toLocaleString()}</p>
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
