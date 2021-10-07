const express = require("express");
const logger = require("../../config/winston");

const router = express.Router();

const CheckInModel = require("../../models/CheckIn");

// Get Check-ins
router.get("/", async (req, res) => {
  try {
    const response = await CheckInModel.find({});
    res.send(response);
  } catch (error) {
    logger.error(error);
    res.status(400).json("Error: " + error);
  }
});

// Add Check-in
router.post("/", async (req, res) => {
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

// Add landing to checkIn
router.put("/:id", async (req, res) => {
  try {
    const query = { _id: req.params.id };
    const response = await CheckInModel.findOneAndUpdate(query, {
      landing: req.body.landing,
    });
    logger.info(response);
    res.status(201).send(response);
  } catch (error) {
    logger.error(error);
    res.status(400).json("Error: " + error);
  }
});

// Delete Check-in
router.delete("/:id", async (req, res) => {
  try {
    const response = await CheckInModel.findByIdAndDelete(req.params.id);
    logger.info(response);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

module.exports = router;
