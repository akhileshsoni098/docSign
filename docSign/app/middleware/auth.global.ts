export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  authStore.initialize()

  if (to.path.startsWith('/broker') && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    return navigateTo('/broker/dashboard')
  }
})