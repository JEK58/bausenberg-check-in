const mongoose = require("mongoose");

const CheckInSchema = mongoose.Schema({
  checkInDate: {
    type: Number,
    required: false,
  },
  checkOutDate: {
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

const CheckIn = mongoose.model("CheckIn", CheckInSchema);
module.exports = CheckIn;
