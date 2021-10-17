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
  addCheckIn(data) {
    return apiClient.post("check-in", data);
  },
  addCheckOut(checkInId, landing) {
    return apiClient.put("check-in/" + checkInId, landing);
  },
  fetchDB(auth) {
    return apiClient.get("check-in", {
      auth: auth,
    });
  },
  deleteCheckIn(checkInId, auth) {
    return apiClient.delete("check-in/" + checkInId, {
      auth: auth,
    });
  },
};
