import { Schema, model, models } from "mongoose";
import type CheckIn from "../types/Checkin";
import Club from "../types/Club";
import Landing from "../types/Landing";

const CheckInSchema = new Schema<CheckIn>({
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
    enum: Club,
  },
  landing: {
    type: String,
    required: false,
    enum: Landing,
  },
});
const CheckIn = models.CheckIn || model("CheckIn", CheckInSchema);

export default CheckIn;
