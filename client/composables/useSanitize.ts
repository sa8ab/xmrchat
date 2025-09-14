import DOMPurify from "isomorphic-dompurify";

export const useSanitize = () => {
  const sanitize = (text: string, options: { isAllowListEnabled: boolean }) => {
    const ALLOWED_TAGS = ["a", "strong", "em"];
    const ALLOWED_ATTR = ["href", "target", "rel", "class"];
    const sanitizeOptions = options.isAllowListEnabled
      ? {
          ALLOWED_TAGS: ALLOWED_TAGS,
          ALLOWED_ATTR: ALLOWED_ATTR,
        }
      : {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
      };
    if (!text) return;
    const sanitizedText = DOMPurify.sanitize(text, sanitizeOptions);
    return sanitizedText;
  };
  return {
    sanitize,
  };
};
