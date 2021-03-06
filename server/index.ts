import dotenv from "dotenv";
import express from "express";
import logger from "./config/winston";
import cors from "cors";
import http from "http";
import checkIn from "./routes/api/check-in";
import checkOut from "./routes/api/check-out";
import admin from "./routes/api/admin";
import "./config/mongoose";

dotenv.config();

// Error handling
process.on("uncaughtException", (err) => {
  logger.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors());

// Rate Limit
const rateLimit = require("express-rate-limit").default;
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const API_RATE_LIMIT = parseInt(process.env.API_RATE_LIMIT || "");

const limiter = rateLimit({
  windowMs: Number.isInteger(API_RATE_LIMIT)
    ? API_RATE_LIMIT * 60 * 1000 // x minutes
    : 10 * 60 * 1000,
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
app.use("/api/check-in", checkIn);
app.use("/api/check-out", checkOut);

app.use("/api/admin", admin);

const port = process.env.PORT || 3031;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
