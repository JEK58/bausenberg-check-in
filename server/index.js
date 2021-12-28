require("dotenv").config();

const express = require("express");

// Logging with Winston
const logger = require("./config/winston");

// Error handling
process.on("uncaughtException", (err) => {
  logger.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

const cors = require("cors");

const app = express();
const http = require("http");
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(cors());

// Rate Limit
const rateLimit = require("express-rate-limit").default;
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const API_RATE_LIMIT = process.env.API_RATE_LIMIT;
const limiter = rateLimit({
  windowMs: API_RATE_LIMIT * 60 * 1000, // x minutes
  max: 1, // limit each IP to 100 requests per windowMs
  message: "Zu viele Flüge in zu kurzer Zeit!",
});
app.use("/api/check-in", limiter);

const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // x minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message: "Zu viele Anfragen",
});

app.use("/api/admin", adminLimiter);

// Routes
const checkIn = require("./routes/api/check-in");
const checkOut = require("./routes/api/check-out");

app.use("/api/check-in", checkIn);
app.use("/api/check-out", checkOut);

const admin = require("./routes/api/admin");

app.use("/api/admin", admin);

// DB Setup
require("./config/mongoose");
const CheckInModel = require("./models/Check-In");

const port = process.env.PORT || 3031;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
