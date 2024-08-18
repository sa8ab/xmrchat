import type { StreamerPage, User } from "~/types";

interface State {
  isLoggedIn: boolean;
  user?: User;
  page?: StreamerPage;
}

export const useAuthStore = defineStore("auth", () => {
  const { toStreamerDisplay, toIndex } = useRouteLocation();

  const {
    checkSession: checkSessionApi,
    login: loginApi,
    signup: signupApi,
    logout: logoutApi,
  } = useServices();

  const state: State = reactive({
    isLoggedIn: false,
    user: undefined,
    page: undefined,
  });

  const checkSession = async () => {
    try {
      const res = await checkSessionApi();

      if (res.authenticated) {
        state.isLoggedIn = true;
        state.user = res.user;
        state.page = getFirstStreamerPage(res.pages);
      } else {
        state.isLoggedIn = false;
        state.user = undefined;
        state.page = undefined;
      }

      console.log(res);
      return res;
    } catch (error) {
      // @ts-ignore
      console.log("error checking session", error?.response);
    }
  };

  const afterAuth = async () => {
    await checkSession();
    return navigateTo(toStreamerDisplay()?.path);
  };

  const login = async (params: { username?: string; password?: string }) => {
    await loginApi(params);
    await afterAuth();
  };

  const signup = async (params: {
    username?: string;
    password?: string;
    email?: string;
  }) => {
    await signupApi(params);
    await afterAuth();
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
    } finally {
      await checkSession();
      return navigateTo(toIndex()?.path);
    }
  };

  const isLoggedIn = computed(() => state.isLoggedIn);
  const userEmail = computed(() => state.user?.email);

  return {
    state,
    checkSession,
    isLoggedIn,
    userEmail,
    login,
    signup,
    logout,
  };
});
