import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const baseAxios = axios.create({
    baseURL: config.public.apiBaseUrl,
    withCredentials: true,
  });

  return {
    provide: {
      axios: baseAxios,
    },
  };
});
