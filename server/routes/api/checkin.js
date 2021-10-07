const express = require("express");
const logger = require("../../config/winston");

const router = express.Router();

const CheckinModel = require("../../models/Checkin");

// Get Checkins
router.get("/", async (req, res) => {
  try {
    const response = await CheckinModel.find({});
    res.send(response);
  } catch (error) {
    logger.error(error);
    res.status(400).json("Error: " + error);
  }
});

// Add Checkin
router.post("/", async (req, res) => {
  try {
    const checkin = new CheckinModel({
      name: req.body.name,
      checkinDate: Date.now(),
      club: req.body.club,
    });
    const response = await checkin.save();
    logger.info(response);
    res.status(201).send(response);
  } catch (error) {
    logger.error(error);
    res.status(400).json("Error: " + error);
  }
});

// Add landing to checkin
router.put("/:id", async (req, res) => {
  try {
    const query = { _id: req.params.id };
    const response = await CheckinModel.findOneAndUpdate(query, {
      landing: req.body.landing,
    });
    logger.info(response);
    res.status(201).send(response);
  } catch (error) {
    logger.error(error);
    res.status(400).json("Error: " + error);
  }
});

// Delete Checkin
router.delete("/:id", async (req, res) => {
  try {
    const response = await CheckinModel.findByIdAndDelete(req.params.id);
    logger.info(response);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

module.exports = router;
