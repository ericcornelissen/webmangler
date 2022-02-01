const longDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at tellus non ante ultricies venenatis. Proin molestie arcu sed mauris dictum, id aliquam turpis iaculis. Donec pellentesque id nibh quis ultrices. Aliquam vel leo tincidunt, varius odio eget, blandit nulla. Ut imperdiet.";

/**
 * Embed HTML content into the <body> of a HTML page.
 *
 * @param content The content to embed.
 * @returns A full HTML page.
 */
function embedContentInBody(content: string): string {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>Page title</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}

/**
 * Embed some HTML content into a larger piece of HTML.
 *
 * @param content The content to embed.
 * @returns A snippet of HTML.
 */
function embedContentInContext(content: string): string {
  return `
    <header>
      <img alt="${longDescription}" src="foobar.jpg"/>
      <h1>Page title</h1>
    </header>
    <div>
      ${content}
    </div>
    <footer>
      <p class="foobar"
         data-let="this element"
         data-have="a lot of whitespace">Hello world!</p>
    </footer>
  `;
}

export {
  embedContentInBody,
  embedContentInContext,
};
