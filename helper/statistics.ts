import { CheckIn } from "@prisma/client";
import { Landing } from "@prisma/client";
export function calcStats(data: CheckIn[]) {
  const countOccurences = (array: CheckIn[], searchString?: Landing) => {
    let count = 0;
    array.forEach((x) => {
      if (x.landing == searchString) count += 1;
    });
    return count;
  };

  const stats = {
    didNotFly: 0,
    regularLanding: 0,
    alternateLanding: 0,
    xcFlight: 0,
    notReported: 0,
  };
  if (!data || data.length < 1) return stats;

  stats.didNotFly = countOccurences(data, Landing.DNF);
  stats.regularLanding = countOccurences(data, Landing.REGULAR);
  stats.alternateLanding = countOccurences(data, Landing.XC);
  stats.xcFlight = countOccurences(data, Landing.ALT);
  stats.notReported = countOccurences(data);
  return stats;
}
