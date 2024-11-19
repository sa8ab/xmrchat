export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  const { toLogin } = useRouteLocation();

  if (!authStore.isLoggedIn) {
    return navigateTo(toLogin()?.path);
  }
});
