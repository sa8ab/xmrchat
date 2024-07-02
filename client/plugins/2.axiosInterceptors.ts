export default defineNuxtPlugin(() => {
  // const authStore = useAuthStore();
  const nuxtApp = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const headers = useRequestHeaders();
  const devLoggedIn = useCookie("xmrchat-dev-logged-in");

  nuxtApp.$axios.interceptors.request.use((config) => {
    // set base url to 'backend:3000' when on production and server side
    if (process.server && process.env.NODE_ENV === "production") {
      config.baseURL = runtimeConfig.public.apiServerSideBaseUrl;
    }

    // set token on header for development ( reads from Authorization header )
    // on production read from cookie

    if (process.env.NODE_ENV === "development") {
      config.headers.Authorization = devLoggedIn.value
        ? "Bearer 81w3b5wgftli23qhl3bqw5ik8djmbwza6sgvjrs3"
        : "";
    } else {
      // @ts-ignore
      if (headers) config.headers = headers;
    }

    return config;
  });

  nuxtApp.$axios.interceptors.response.use(
    (res) => {
      // API responds with error object when there is error but does not fail the request
      const data = res.data;
      if (!data || data.error) {
        return Promise.reject({
          message: data.error,
        });
      }
      return res;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
});
