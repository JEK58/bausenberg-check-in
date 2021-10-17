const express = require("express");
const logger = require("../../config/winston");
const crypto = require("crypto");

const router = express.Router();

const CheckInModel = require("../../models/Check-In");

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

// Get Check-ins
router.get("/", async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;

    const response = await CheckInModel.find({});
    res.send(response);
    logger.info("Admin connected");
  } catch (error) {
    logger.error(error);
    res.status(400).json("Error: " + error);
  }
});

// Delete Check-in
router.delete("/:id", async (req, res) => {
  try {
    if (!checkAuth(req, res)) return;
    const response = await CheckInModel.findByIdAndDelete(req.params.id);
    logger.info(response);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

function checkAuth(req, res) {
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

module.exports = router;
