import { formatInTimeZone } from "date-fns-tz";

export const formatDate = (timestamp: number | string | Date | undefined) => {
  if (!timestamp) return "-";
  return formatInTimeZone(
    new Date(timestamp),
    "Europe/Berlin",
    "dd.MM.yy - HH:mm"
  );
};
