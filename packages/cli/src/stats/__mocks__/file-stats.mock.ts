import type { FileStats } from "../types";

const getChangedPercentage = (before: number, after: number): number => {
  return ((after - before) / before) * 100;
};

export default class FileStatsMock implements FileStats {
  changed: boolean;
  changePercentage: number;
  sizeAfter: number;
  sizeBefore: number;

  constructor(
    sizeBefore: number,
    sizeAfter: number,
    changePercentage?: number,
  ) {
    this.changed = (sizeBefore !== sizeAfter);
    this.changePercentage = changePercentage === undefined ?
      getChangedPercentage(sizeBefore, sizeAfter) : changePercentage;
    this.sizeBefore = sizeBefore;
    this.sizeAfter = sizeAfter;
  }
}
