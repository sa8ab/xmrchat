// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NUXT_PUBLIC_DEVTOOLS_ENABLED === "true" },

  runtimeConfig: {
    public: {
      apiBaseUrl: "https://api.xmrchat.com/api",
      apiServerSideBaseUrl: "http://backend:3000/api",
    },
  },

  css: ["@/assets/style/main.scss"],

  components: [{ path: "./components", pathPrefix: false }],

  modules: ["@nuxt/ui", "@nuxt/fonts", "@nuxtjs/i18n", "@pinia/nuxt"],

  // tailwindcss: {
  //   configPath: "./tailwind.config.ts",
  // },

  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: "root",
    },
    locales: [{ code: "en", iso: "en", name: "English", dir: "auto" }],
    defaultLocale: "en",
    vueI18n: "./i18n.config.ts",
  },

  ui: {
    icons: ["heroicons", "mdi"],
  },

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
  },

  fonts: {
    families: [{ name: "Inter", provider: "google" }],
  },
});
