export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  authStore.initialize()

  const protectedRoutes = ['/dashboard', '/customers', '/policies', '/assignments', '/profile']
  const isProtected = protectedRoutes.some(route => to.path.startsWith(route))

  if (isProtected && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
