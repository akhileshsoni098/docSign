import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  auth.init()

  if (!auth.isLoggedIn) {
    return navigateTo('/login')
  }
})