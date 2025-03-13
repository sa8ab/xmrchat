export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  const { toLogin } = useRouteLocation();

  if (!authStore.isAdmin) {
    return navigateTo(toLogin()?.path);
  }
});
