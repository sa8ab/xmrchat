import DOMPurify from "isomorphic-dompurify";

export const useSanitize = (text: string | null) => {
    if (!text) return;
    const sanitizedText = DOMPurify.sanitize(text);
    return sanitizedText;
}