import * as sinon from "sinon";

import initMangleExpressionMock from "./mangle-expression";
import initWebManglerPluginMock from "./web-mangler-plugin";
import initWebManglerLanguagePluginMock from "./web-mangler-language-plugin";

/**
 * A simple mock for _WebMangler_'s {@link MangleExpression} interface.
 *
 * @since v0.1.1
 * @version v0.1.5
 */
const MangleExpressionMock = initMangleExpressionMock({
  createStub: sinon.stub,
});

/**
 * A simple mock for _WebMangler_'s {@link WebManglerPlugin} interface.
 *
 * @since v0.1.1
 * @version v0.1.5
 */
const WebManglerPluginMock = initWebManglerPluginMock({
  createStub: sinon.stub,
});

/**
 * A simple mock for _WebMangler_'s {@link WebManglerPluginLanguage} interface.
 *
 * @since v0.1.5
 */
const WebManglerLanguagePluginMock = initWebManglerLanguagePluginMock({
  createStub: sinon.stub,
});

export {
  MangleExpressionMock,
  WebManglerPluginMock,
  WebManglerLanguagePluginMock,
};
