import axios from "axios";
import { getBaseUrl } from "@/shared/base-url-helper";

const baseURL = getBaseUrl();

const apiClient = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
interface CheckIn {
  name: string;
  club: string;
}
interface authData {
  username: string;
  password: string;
}

export default {
  addCheckIn(data: CheckIn) {
    return apiClient.post("check-in", data);
  },
  addCheckOut(checkInId: string, landing: string) {
    return apiClient.put("check-out/" + checkInId, { landing });
  },

  fetchDB(auth: authData) {
    return apiClient.get("admin", {
      auth: auth,
    });
  },
  deleteEntry(checkInId: string, auth: authData) {
    return apiClient.delete("admin/" + checkInId, {
      auth: auth,
    });
  },
};
