import express, { Request, Response } from "express";
import logger from "../../config/winston";
import CheckInModel from "../../models/Check-In";

// TODO: Check routes
const router = express.Router();

// Add landing to checkIn
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const query = { _id: req.params.id };
    const response = await CheckInModel.findOneAndUpdate(query, {
      landing: req.body.landing,
      checkOutDate: Date.now(),
    });
    logger.info(response);
    res.status(201).send(response);
  } catch (error) {
    logger.error(error);
    res.status(400).json("Error: " + error);
  }
});
export default router;
