const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const dotenv = require("dotenv");
const connectDB = require("./configs/db");

dotenv.config();

connectDB();

const app = express();
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later" },
});
app.use(globalLimiter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
