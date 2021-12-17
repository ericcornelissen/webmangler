import type {
  EmbedsGetter,
  ExpressionFactory,
} from "./simple-language-plugin.class";

import {
  NestedGroupMangleExpression,
  SingleGroupMangleExpression,
} from "./mangle-expressions";
import MultiLanguagePlugin from "./multi-language-plugin.class";
import SimpleLanguagePlugin from "./simple-language-plugin.class";

export {
  MultiLanguagePlugin,
  NestedGroupMangleExpression,
  SimpleLanguagePlugin,
  SingleGroupMangleExpression,
};

export type {
  EmbedsGetter,
  ExpressionFactory,
};
