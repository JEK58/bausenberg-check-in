const express = require("express");
const logger = require("../../config/winston");

const router = express.Router();

const CheckInModel = require("../../models/Check-In");

// Add landing to checkIn
router.put("/:id", async (req, res) => {
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
module.exports = router;
