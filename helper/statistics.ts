import { CheckIn } from "@prisma/client";
import type Landing from "@/types/Landing";
export function calcStats(data: CheckIn[]) {
  const countOccurences = (array: CheckIn[], searchString?: Landing) => {
    let count = 0;
    array.forEach((x) => {
      if (x.landing == searchString) count += 1;
    });
    return count;
  };

  const stats = {
    didNotStart: 0,
    regularLanding: 0,
    alternateLanding: 0,
    xcLanding: 0,
    notReported: 0,
  };
  if (!data || data.length < 1) return stats;

  stats.didNotStart = countOccurences(data, "Doch nicht gestartet");
  stats.regularLanding = countOccurences(data, "Landewiese");
  stats.alternateLanding = countOccurences(data, "Notlandewiese");
  stats.xcLanding = countOccurences(data, "Streckenflug");
  stats.notReported = countOccurences(data);
  return stats;
}
