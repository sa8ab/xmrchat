export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  await useAsyncData(async () => {
    return authStore.checkSession();
  });
});
