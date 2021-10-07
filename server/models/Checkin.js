const mongoose = require("mongoose");

const CheckinSchema = mongoose.Schema({
  checkinDate: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  club: {
    type: String,
    required: false,
  },
  landing: {
    type: String,
    required: false,
  },
});

const Checkin = mongoose.model("Checkin", CheckinSchema);
module.exports = Checkin;
