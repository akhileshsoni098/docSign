import { useApi } from "~/composables/useApi"
import type { Broker } from "~/types"

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const broker = ref<Broker | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, password: string) => {
    const api = useApi()
    const response = await api.post<{ success: boolean; token: string; broker: Broker }>(
      '/api/public/login',
      { email, password }
    )
    if (response.success) {
      token.value = response.token
      broker.value = response.broker
      if (process.client) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('broker', JSON.stringify(response.broker))
      }
    }
    return response
  }

  const register = async (name: string, email: string, password: string) => {
    const api = useApi()
    const response = await api.post<{ success: boolean; broker: Broker }>(
      '/api/public',
      { name, email, password }
    )
    return response
  }

  const logout = () => {
    token.value = null
    broker.value = null
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('broker')
    }
    navigateTo('/login')
  }

  const initialize = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('token')
      const storedBroker = localStorage.getItem('broker')
      if (storedToken && storedBroker) {
        token.value = storedToken
        broker.value = JSON.parse(storedBroker)
      }
    }
  }

  return { token, broker, isAuthenticated, login, register, logout, initialize }
})