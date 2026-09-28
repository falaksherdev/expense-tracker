const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sendTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

function validatePassword(password) {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number";
  }
  if (!/[@$!%*?&#^()_\-+=]/.test(password)) {
    return "Password must include at least one special character";
  }
  return null;
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // send verfication email
    try {
      await sendVerificationEmail(user);
    } catch (emailError) {
      console.error("Verification email failed to send:", emailError.message);
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    sendTokenCookie(res, token);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const logoutUser = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getMe = async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    preferences: req.user.preferences,
    isVerified: req.user.isVerified,
  });
};
const updatePreferences = async (req, res) => {
  try {
    const { committee, lending, investments, currency } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        preferences: {
          committee: Boolean(committee),
          lending: Boolean(lending),
          investments: Boolean(investments),
          currency: currency || "PKR",
          onboarded: true,
        },
      },
      { new: true, runValidators: true },
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateCurrency = async (req, res) => {
  try {
    const { currency } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { "preferences.currency": currency },
      { new: true },
    ).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(resetToken);

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#12141C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#12141C; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#171A24; border:1px solid #242838; border-radius:16px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0 32px; text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 8px auto;">
                <tr>
                  <td style="vertical-align:middle; padding-right:6px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A94B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;">
                      <path d="M21 12V7H5a2 2 0 010-4h14v4" />
                      <path d="M3 5v14a2 2 0 002 2h16v-5" />
                      <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
                    </svg>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#75798A; font-size:12px; letter-spacing:0.05em; text-transform:uppercase;">
                     MoneyMov
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:16px 32px 32px 32px;">
              <h1 style="color:#EDEDED; font-size:22px; font-weight:600; margin:0 0 16px 0; text-align:center;">
                Reset your password
              </h1>
              <p style="color:#C6C9D4; font-size:14px; line-height:1.6; margin:0 0 8px 0;">
                Hi ${user.name},
              </p>
              <p style="color:#C6C9D4; font-size:14px; line-height:1.6; margin:0 0 28px 0;">
                We received a request to reset your password. Click the button below to choose a new one. This link will expire in <strong style="color:#EDEDED;">30 minutes</strong>.
              </p>

              <!-- Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px auto;">
                <tr>
                  <td style="border-radius:10px; background-color:#D4A94B;">
                    <a href="${resetUrl}" target="_blank" style="display:inline-block; padding:13px 32px; color:#12141C; font-size:14px; font-weight:600; text-decoration:none; border-radius:10px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#75798A; font-size:12px; line-height:1.6; margin:0 0 4px 0;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color:#7C9CBF; font-size:12px; line-height:1.6; word-break:break-all; margin:0 0 28px 0;">
                ${resetUrl}
              </p>

              <div style="border-top:1px solid #242838; padding-top:20px;">
                <p style="color:#565A6B; font-size:12px; line-height:1.6; margin:0;">
                  If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; background-color:#12141C; text-align:center;">
              <p style="color:#565A6B; font-size:11px; margin:0;">
                &copy; ${new Date().getFullYear()} MoneyMov
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: emailHtml,
    });

    res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    console.log(hashedToken);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful. Please log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide current and new password" });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    const userId = req.user._id;
    await Transaction.deleteMany({ userId });
    await Category.deleteMany({ userId });
    await Feedback.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.cookie("token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      expires: new Date(0),
    });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const sendVerificationEmail = async (user) => {
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours valid
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#12141C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#12141C; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#171A24; border:1px solid #242838; border-radius:16px; overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 0 32px; text-align:center;">
              <span style="font-size:14px;">💰</span>
              <span style="color:#75798A; font-size:12px; letter-spacing:0.05em; text-transform:uppercase; margin-left:6px;">MoneyMov</span>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 32px 32px;">
              <h1 style="color:#EDEDED; font-size:22px; font-weight:600; margin:0 0 16px 0; text-align:center;">Verify your email</h1>
              <p style="color:#C6C9D4; font-size:14px; line-height:1.6; margin:0 0 8px 0;">Hi ${user.name},</p>
              <p style="color:#C6C9D4; font-size:14px; line-height:1.6; margin:0 0 28px 0;">
                Welcome! Please confirm your email address to get the most out of your account. This link expires in <strong style="color:#EDEDED;">24 hours</strong>.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px auto;">
                <tr>
                  <td style="border-radius:10px; background-color:#D4A94B;">
                    <a href="${verifyUrl}" target="_blank" style="display:inline-block; padding:13px 32px; color:#12141C; font-size:14px; font-weight:600; text-decoration:none; border-radius:10px;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#75798A; font-size:12px; line-height:1.6; margin:0 0 4px 0;">Or copy and paste this link into your browser:</p>
              <p style="color:#7C9CBF; font-size:12px; line-height:1.6; word-break:break-all; margin:0;">${verifyUrl}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px; background-color:#12141C; text-align:center;">
              <p style="color:#565A6B; font-size:11px; margin:0;">&copy; ${new Date().getFullYear()} MoneyMov</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await sendEmail({
    to: user.email,
    subject: "Verify your email address",
    html: emailHtml,
  });
};

const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resendVerification = async (req, res) => {
  try {
    if (req.user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    await sendVerificationEmail(req.user);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {
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
};
