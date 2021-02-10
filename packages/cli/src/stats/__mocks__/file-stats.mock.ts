import type { FileStats } from "../types";

export default class FileStatsMock implements FileStats {
  changed: boolean;
  changePercentage: number;
  sizeAfter: number;
  sizeBefore: number;

  constructor(sizeBefore: number, sizeAfter: number) {
    this.changed = (sizeBefore !== sizeAfter);
    this.changePercentage = (sizeAfter - sizeBefore) / sizeAfter;
    this.sizeBefore = sizeBefore;
    this.sizeAfter = sizeAfter;
  }
}
