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
    toContact: () => localeRoute("/contact"),
    toStreamer: (id: Numberic) => localeRoute(`/${id}`),
    toGuides: () => localeRoute("/guides/secret-and-primary-address"),
  };
};
