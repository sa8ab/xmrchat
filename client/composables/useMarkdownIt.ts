import DOMPurify from "isomorphic-dompurify";
import markdownit from "markdown-it";
import mila from "markdown-it-link-attributes";

export const useMarkdownIt = () => {
    const attrs = { 
        target: "_blank",
        rel: "nofollow noopener noreferrer",
        class: "text-primary hover:text-primary-400 hover:underline hover:underline-offset-4 hover:decoration-primary-400",
    };
    const linkifyAndSanitize = (message: string | null) => {
        if (!message) return;
        const md = markdownit({
            linkify: true,
            typographer: true
        })
        .disable(['image', 'table', 'code', 'fence', 'hr', 'list', 'reference', 'html_block', 'heading', 'lheading'])
        .enable(['link']);
        md.linkify.tlds('onion', true).add('ftp:', null);
        md.use(mila, { attrs: attrs });

        const linkifiedMessage = md.render(message);
        const sanitizedMessage = DOMPurify.sanitize(linkifiedMessage);
        return sanitizedMessage;
    }
    return {
        linkifyAndSanitize
    }
}