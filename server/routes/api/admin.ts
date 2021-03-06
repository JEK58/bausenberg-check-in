import express from "express";
import { Request, Response } from "express";
import logger from "../../config/winston";
import crypto from "crypto";
import CheckInModel from "../../models/Check-In";

const router = express.Router();

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

// Get Check-ins
router.get("/", async (req: Request, res: Response) => {
  try {
    if (!checkAuth(req, res)) return;

    const checkIns = await CheckInModel.find({}).sort({ checkInDate: -1 });

    res.send(checkIns);
    logger.info("Admin connected");
  } catch (error) {
    logger.error(error);
    res.status(400).json("Error: " + error);
  }
});

// Delete Check-in
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!checkAuth(req, res)) return;
    const response = await CheckInModel.findByIdAndDelete(req.params.id);
    logger.info(response);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

function checkAuth(req: Request, res: Response) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    logger.error("No login data");
    res.status(401).json("No login data");
    return false;
  }
  const [username, password] = Buffer.from(
    authorization.replace("Basic ", ""),
    "base64"
  )
    .toString()
    .split(":");
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");

  if (!(username === ADMIN_USERNAME && ADMIN_PASSWORD_HASH === hash)) {
    logger.error("Bad Login");
    res.status(401).json("Bad login");
    return false;
  }
  return true;
}

export default router;
