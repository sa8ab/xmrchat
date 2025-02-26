// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NUXT_PUBLIC_DEVTOOLS_ENABLED === "true" },
  devServer: {
    port: 3002,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: "",
      apiServerSideBaseUrl: "",
      imageBaseUrl: "http://localhost:9000",
    },
  },

  css: ["@/assets/style/main.scss"],

  components: [{ path: "./components", pathPrefix: false }],

  modules: [
    "@nuxt/ui",
    "@nuxt/fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "dayjs-nuxt",
  ],

  piniaPluginPersistedstate: {
    cookieOptions: {
      maxAge: 3600 * 24 * 30,
    },
  },

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
    icons: ["heroicons", "mdi", "tabler", "simple-icons"],
  },

  icon: {
    customCollections: [{ prefix: "icon", dir: "./assets/icons" }],
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
