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

// Routes
const checkIn = require("./routes/api/check-in");
app.use("/api/check-in", checkIn);

// Logging with Winston
const logger = require("./config/winston");

// DB Setup
require("./config/mongoose");
const CheckInModel = require("./models/Check-In");

let BASE_URL = "http://localhost:8080";
if (process.env.NODE_ENV === "production") {
  BASE_URL = "https://bausenberg-check-in.stephanschoepe.de";
}
const port = process.env.PORT || 3031;

const options = {
  cors: { origin: [BASE_URL] },
};

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
