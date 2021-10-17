require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

// Error handling
// TODO: is this doing what i want it to do?
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

const cors = require("cors");

const app = express();
const http = require("http");
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rate Limit
const rateLimit = require("express-rate-limit");
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 2, // limit each IP to 100 requests per windowMs
  message: "Zu viele Flüge in zu kurzer Zeit!",
});

app.use("/api/check-in", limiter);

// Routes
const checkIn = require("./routes/api/check-in");
const checkOut = require("./routes/api/check-out");

app.use("/api/check-in", checkIn);
app.use("/api/check-out", checkOut);

const admin = require("./routes/api/admin");

app.use("/api/admin", admin);

// Logging with Winston
const logger = require("./config/winston");

// DB Setup
require("./config/mongoose");
const CheckInModel = require("./models/Check-In");

// let BASE_URL = "http://localhost:8080";
// if (process.env.NODE_ENV === "production") {
//   BASE_URL = "https://bausenberg-check-in.stephanschoepe.de";
// }

// const options = {
//   cors: { origin: [BASE_URL] },
// };

const port = process.env.PORT || 3031;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
