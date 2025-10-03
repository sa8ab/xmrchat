import markdownit from "markdown-it";
import mila from "markdown-it-link-attributes";
export const useMarkdown = () => {
  const { sanitize } = useSanitize();

  const attributes = {
    target: "_blank",
    rel: "nofollow noopener noreferrer",
    class:
      "text-primary hover:text-primary-400 hover:underline hover:underline-offset-4 hover:decoration-primary-400",
  };

  const md = markdownit("zero", {
    linkify: true,
    typographer: true,
  }).enable(["linkify", "emphasis"]);

  md.linkify.tlds("onion", true).add("ftp:", null);
  md.use(mila, { attrs: attributes });

  const markdownAndSanitize = (message: string | null | undefined) => {
    if (!message) return;

    const sanitizedMessage = sanitize(message, {
      isAllowListEnabled: false,
    });

    if (!sanitizedMessage) return;

    const markdownMessage = md.renderInline(sanitizedMessage);

    const result = sanitize(markdownMessage, {
      isAllowListEnabled: true,
    });
    if (!result) return;

    return result;
  };

  return {
    markdownAndSanitize,
  };
};
