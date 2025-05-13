/**
 * Utility for replacing placeholders in templates with data from objects
 * Supports nested objects and arrays
 *
 */
export function replaceTemplatePlaceholders(
  template: string,
  data: any,
  placeholderMap: Record<string, string> = {},
  options: {
    listSeparator?: string;
    listFormatter?: (items: any[]) => string;
  } = {},
): string {
  const {
    listSeparator = ', ',
    listFormatter = (items) => items.join(listSeparator),
  } = options;

  return template.replace(/{{([^}]+)}}/g, (match, key) => {
    // Check if we have a mapping for this key
    const mappedPath = placeholderMap[key] || key;

    // Handle array access with [index] notation
    const pathParts = mappedPath.split(/\.|\[|\]/).filter(Boolean);

    // Check if this is a list request (no index specified)
    const isListRequest =
      !mappedPath.includes('[') &&
      pathParts.length > 0 &&
      Array.isArray(data[pathParts[0]]);

    if (isListRequest) {
      const array = data[pathParts[0]];
      if (!array || !Array.isArray(array)) {
        return match;
      }

      // If there's a property specified after the array name (e.g., options.title)
      if (pathParts.length > 1) {
        const property = pathParts[1];
        const items = array
          .map((item) => item[property])
          .filter((item) => item !== undefined && item !== null);
        return listFormatter(items);
      }

      // If it's just the array name, convert items to strings
      const items = array.map((item) => String(item)).filter(Boolean);
      return listFormatter(items);
    }

    // Regular path traversal for non-list requests
    let value = data;
    for (const part of pathParts) {
      if (value === undefined || value === null) {
        return match; // Return the original placeholder if data is missing
      }

      // Check if part is a number (array index)
      const index = parseInt(part, 10);
      if (!isNaN(index)) {
        value = value[index];
      } else {
        value = value[part];
      }
    }

    // Return the value if found, otherwise return the original placeholder
    return value !== undefined && value !== null ? value : match;
  });
}
