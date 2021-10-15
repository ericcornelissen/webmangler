/**
 * The default prefix used by a {@link HtmlAttributeMangler}.
 */
 const DEFAULT_PREFIX = "data-";

 /**
  * Get either the configured prefix or the default prefix.
  *
  * @param keepAttrPrefix The configured prefix.
  * @returns The prefix to be used.
  */
 function getPrefix(keepAttrPrefix?: string): string {
   if (keepAttrPrefix === undefined) {
     return DEFAULT_PREFIX;
   }

   return keepAttrPrefix;
 }

 export {
   getPrefix,
 };
