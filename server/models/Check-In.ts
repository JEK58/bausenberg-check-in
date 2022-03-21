import { Schema, model } from "mongoose";
import type CheckIn from "../../client/src/types/Checkin";
import Club from "../../client/src/types/Club";
import Landing from "../../client/src/types/Landing";

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

export default model("CheckIn", CheckInSchema);
