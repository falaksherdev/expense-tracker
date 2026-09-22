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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.put("/preferences", protect, updatePreferences);
router.put("/currency", protect, updateCurrency);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/change-password", protect, changePassword);
router.delete("/account", protect, deleteAccount);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", protect, resendVerification);

module.exports = router;
