import { getStyleAttributesAsEmbeds } from "./style-attribute";
import { getStyleTagsAsEmbeds } from "./style-tag";

const embeddedCssFinders = [
  getStyleAttributesAsEmbeds,
  getStyleTagsAsEmbeds,
];

export default embeddedCssFinders;
