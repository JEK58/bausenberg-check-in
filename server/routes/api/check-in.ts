import express, { Request, Response } from "express";
const logger = require("../../config/winston");

const router = express.Router();

const CheckInModel = require("../../models/Check-In");

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

module.exports = router;
