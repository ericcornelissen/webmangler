import type {
  HtmlAttributeValues,
  HtmlAttributeValuesSets,
  HtmlAttributeValuesPresets,
  HtmlElementValues,
  HtmlElementValuesSets,
  HtmlElementValuesPresets,
} from "./types";

import {
  embedContentInBody,
  embedContentInContext,
} from "../../../__tests__/benchmark-helpers";
import {
  buildHtmlAttributes,
  buildHtmlComments,
  buildHtmlElement,
  buildHtmlElements,
} from "./builders";
import {
  getAllMatches,
} from "./test-helpers";
import {
  sampleValues,
  valuePresets,
} from "./values";

export {
  buildHtmlAttributes,
  buildHtmlComments,
  buildHtmlElement,
  buildHtmlElements,
  embedContentInBody,
  embedContentInContext,
  getAllMatches,
  sampleValues,
  valuePresets,
};

export type {
  HtmlAttributeValues,
  HtmlAttributeValuesSets,
  HtmlAttributeValuesPresets,
  HtmlElementValues,
  HtmlElementValuesSets,
  HtmlElementValuesPresets,
};
