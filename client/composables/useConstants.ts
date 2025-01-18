import { ContentLinkPlatformEnum } from "~/types/enums";

export const useConstants = () => {
  const getContentLink = (v: ContentLinkPlatformEnum) => {
    return CONTENT_LINKS[v];
  };
  return {
    getContentLink,
  };
};
