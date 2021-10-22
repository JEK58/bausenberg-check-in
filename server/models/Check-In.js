const mongoose = require("mongoose");

const CheckInSchema = mongoose.Schema({
  checkInDate: {
    type: Number,
    required: true,
  },
  checkOutDate: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: true,
    match: /(\w|[üäöÄÜÖß-]){3,} (\w|[üäöÄÜÖß-]){3,}/,
  },
  club: {
    type: String,
    required: true,
    enum: ["RML", "DGC"],
  },
  landing: {
    type: String,
    required: false,
    enum: ["Landewiese", "Notlandewiese", "Streckenflug"],
  },
});

const CheckIn = mongoose.model("CheckIn", CheckInSchema);
module.exports = CheckIn;
