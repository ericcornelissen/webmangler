const longDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at tellus non ante ultricies venenatis. Proin molestie arcu sed mauris dictum, id aliquam turpis iaculis. Donec pellentesque id nibh quis ultrices. Aliquam vel leo tincidunt, varius odio eget, blandit nulla. Ut imperdiet.";

/**
 * Embed some CSS content into a larger stylesheet.
 *
 * @param content The content to embed.
 * @returns A (larger) snippet of CSS.
 */
export function embedContentInContext(content: string): string {
  return `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #FFF;
      font: sans-serif;
    }

    .container > h2,
    .container > .h2 {
      text-decoration: underline;
    }

    ${content}

    p::before {
      content: "${longDescription}";
    }

    span::after {
      content      :          "let's have a lot of spacing in this declaration";
    }
  `;
}
