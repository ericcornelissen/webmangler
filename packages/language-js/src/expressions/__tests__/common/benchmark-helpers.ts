const longDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at tellus non ante ultricies venenatis. Proin molestie arcu sed mauris dictum, id aliquam turpis iaculis. Donec pellentesque id nibh quis ultrices. Aliquam vel leo tincidunt, varius odio eget, blandit nulla. Ut imperdiet.";

/**
 * Embed some JavaScript content into a larger JavaScript context.
 *
 * @param content The content to embed.
 * @returns A (larger) snippet of JavaScript.
 */
export function embedContentInContext(content: string): string {
  return `
    var fs = require("fs");

    const FOOBAR = "foobar";
    const DESCRIPTION = '${longDescription}';

    function helper(a, b) {
      return (a * 2) + b;
    }

    ${content}

    module.exports = {
      constant: FOOBAR,
      description: DESCRIPTION,
      number: helper(3, 14),
    };
  `;
}
