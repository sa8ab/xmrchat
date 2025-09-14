import DOMPurify from "isomorphic-dompurify";

export const useSanitize = () => {
    const sanitize = (
        text: string,
        options: { isAllowListEnabled: boolean }
    ) => {
        const ALLOWED_TAGS = ["a", "strong", "em"];
        const ALLOWED_ATTR = ["href", "target", "rel", "class"];
        if (!text) return;
        if (options.isAllowListEnabled) {
            const sanitizedText = DOMPurify.sanitize(text, {
            ALLOWED_TAGS: ALLOWED_TAGS,
            ALLOWED_ATTR: ALLOWED_ATTR
        });
        return sanitizedText;
    }
        const sanitizedText = DOMPurify.sanitize(text);
        return sanitizedText;    
    }
    return {
        sanitize
    }
}