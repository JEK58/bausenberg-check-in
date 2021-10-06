import axios from "axios";
import { getBaseUrl } from "@/shared/base-url-helper";

let baseURL = getBaseUrl();

const apiClient = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  addCheckin(data) {
    return apiClient.post("checkin", data);
  },
  addCheckout(checkinId, landing) {
    return apiClient.put("checkin/" + checkinId, landing);
  },
};
