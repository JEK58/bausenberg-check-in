import mongoose from "mongoose";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const connectDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (!process.env.DB_CONNECTION) throw "DB_CONNECTION not set in .env";

    if (mongoose.connections[0].readyState) {
      // Use current db connection
      return handler(req, res);
    }
    console.log("DB Url: ", process.env.DB_CONNECTION);

    // Use new db connection
    await mongoose.connect(process.env.DB_CONNECTION, {});

    // Logs connection errors after initial connection
    mongoose.connection.on("error", (err: Error) => {
      console.log(err);
    });

    mongoose.connection.on("error", () => console.log("connection error:"));
    mongoose.connection.once("open", () => console.log("Connected to DB"));
    return handler(req, res);
  };

export default connectDB;
