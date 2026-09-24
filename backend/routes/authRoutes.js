const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updatePreferences,
  updateCurrency,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAccount,
  verifyEmail,
  resendVerification,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 10 : 50,
  message: { message: "Too many attempts, please try again in 15 minutes" },
  skipSuccessfulRequests: true,
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/forgot-password", authLimiter, forgotPassword);

router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.put("/preferences", protect, updatePreferences);
router.put("/currency", protect, updateCurrency);
router.put("/reset-password/:token", resetPassword);
router.put("/change-password", protect, changePassword);
router.delete("/account", protect, deleteAccount);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", protect, resendVerification);

module.exports = router;
