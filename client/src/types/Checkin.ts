import type Landing from "./Landing";

export default interface CheckIn {
  _id: string;
  checkInDate: number;
  checkOutDate: number;
  name: string;
  club: string;
  landing: Landing;
  __v: number;
}
