import log from "../utilities/log.js";
import * as paths from "../paths.js";

const filters = [];
paths.getPackages().forEach((packageName) => {
  filters.push(`${packageName}: packages/${packageName}/src/**`);
});

const filtersRaw = filters.join("\n");
log.print(filtersRaw);
