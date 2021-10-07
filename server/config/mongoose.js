const mongoose = require("mongoose");
const logger = require("./winston");

// Initial connection
try {
  mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
} catch (error) {
  logger.error(error);
}
// Logs connection errors after initial connection
mongoose.connection.on("error", (err) => {
  logger.error(err);
});

const mongodb = mongoose.connection;
mongodb.on("error", () => logger.error("connection error:"));
mongodb.once("open", () => logger.info("Connected to DB"));

// module.exports = mongoose;
