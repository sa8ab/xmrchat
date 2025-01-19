import type { Numberic } from "~/types";

export const ROUTES = {
  login: "/auth/login",
  signup: "/auth/signup",
  forgotPassword: "/auth/forgot_password",
};

export const useRouteLocation = () => {
  const localeRoute = useLocaleRoute();

  return {
    toIndex: () => localeRoute("/"),
    toLogin: () => localeRoute(ROUTES.login),
    toSignup: () => localeRoute(ROUTES.signup),
    toForgotPassword: () => localeRoute(ROUTES.forgotPassword),
    toStreamerDisplay: () => localeRoute("/streamer"),
    toStreamerEdit: () => localeRoute("/streamer/edit"),
    toStreamerCreate: () => localeRoute("/streamer/create"),
    toStreamerOBS: () => localeRoute("/streamer/obs"),
    toStreamerContentLinks: () => localeRoute("/streamer/content-links"),
    toStreamerAccount: () => localeRoute("/streamer/account"),
    toContact: () => localeRoute("/contact"),
    toStreamer: (id: Numberic) => localeRoute(`/${id}`),
    toCreators: () => localeRoute(`/creator`),
    toGuides: () => localeRoute("/guides/secret-and-primary-address"),
  };
};
