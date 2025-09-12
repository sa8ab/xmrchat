import DOMPurify from "isomorphic-dompurify";
const ALLOWED_TAGS = ["a", "strong", "em"];
const ALLOWED_ATTR = ["href", "target", "rel", "class"];
export const useSanitize = (
    text: string,
    isAllowListEnabled: boolean
) => {
    if (!text) return;
    if (isAllowListEnabled) {
        const sanitizedText = DOMPurify.sanitize(text, {
            ALLOWED_TAGS: ALLOWED_TAGS,
            ALLOWED_ATTR: ALLOWED_ATTR
        });
        return sanitizedText;
    }
    const sanitizedText = DOMPurify.sanitize(text);
    return sanitizedText;
}