export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  await useLazyAsyncData(
    async () => {
      return authStore.getMe();
    },
    { server: false }
  );
});
