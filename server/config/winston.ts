//
// Logging with Winston
//
import winston from "winston";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "bausenberg-check-in-server" },
  transports: [
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    new winston.transports.File({
      filename: "bausenberg-check-in-server-error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "bausenberg-check-in-server-combined.log",
    }),
  ],
});

// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
