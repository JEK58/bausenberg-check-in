import express, { Request, Response } from "express";
import logger from "../../config/winston";

const router = express.Router();

import CheckInModel from "../../models/Check-In";

// Add Check-in
router.post("/", async (req: Request, res: Response) => {
  try {
    const checkIn = new CheckInModel({
      name: req.body.name,
      checkInDate: Date.now(),
      club: req.body.club,
    });
    const response = await checkIn.save();
    logger.info(response);
    res.status(201).send(response);
  } catch (error) {
    logger.error(error);
    res.status(400).json("Error: " + error);
  }
});

export default router;
