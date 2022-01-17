import type { WebManglerCliFile } from "../../types";

class WebManglerCliFileMock implements WebManglerCliFile {
  content: string;
  originalSize: number;
  path: string;
  size: number;
  type: string;

  constructor(values: {
    content?: string;
    originalSize?: number;
    path?: string;
    size?: number;
    type?: string;
  }) {
    this.content = values.content || "";
    this.originalSize = values.originalSize || 0;
    this.path = values.path || "";
    this.size = values.size || 0;
    this.type = values.type || "";
  }
}

export default WebManglerCliFileMock;
