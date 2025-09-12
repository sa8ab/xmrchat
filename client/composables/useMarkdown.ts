import markdownit from "markdown-it";
import mila from "markdown-it-link-attributes";

export const useMarkdown = () => {
    const ALLOWED_TAGS = ["a", "strong", "em"];
    const ALLOWED_ATTR = ["href", "target", "rel", "class"];
    const attributes = { 
        target: "_blank",
        rel: "nofollow noopener noreferrer",
        class: "text-primary hover:text-primary-400 hover:underline hover:underline-offset-4 hover:decoration-primary-400",
    };
    const markdownAndSanitize = (message: string | null) => {
        if (!message) return;
        const sanitizedMessage = useSanitize(message);
        if (!sanitizedMessage) return;

        const md = markdownit("zero", {
        linkify: true,
        typographer: true,
        }).enable(["linkify", "emphasis"]);

        md.linkify.tlds('onion', true).add('ftp:', null);
        md.use(mila, { attrs: attributes });
        const linkifiedMessage = md.render(sanitizedMessage);
        return linkifiedMessage;
    }
    return {
        markdownAndSanitize
    }
}