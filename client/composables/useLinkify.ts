import linkifyStr from 'linkify-string';
import DOMPurify from "isomorphic-dompurify";

export const useLinkify = () => {
    const linkifyAndSanitize = (message: string | null) => {
        if (!message) return;
        const options = { 
            defaultProtocol: 'https',
            target: { url: '_blank'},
            attributes: { rel: 'nofollow noopener noreferrer'},
            className: "text-primary hover:text-primary-400 hover:underline hover:underline-offset-4 hover:decoration-primary-400"
         };
        const linkifiedMessage = linkifyStr(message, options);
        const sanitizedMessage = DOMPurify.sanitize(linkifiedMessage);
        return sanitizedMessage;
    }
    return {
        linkifyAndSanitize
    }
}