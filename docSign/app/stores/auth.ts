import { useApiFetch } from "~/utils/api"
import type { Broker } from "~/types"

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const broker = ref<Broker | null>(null)
  const isAuthenticated = computed(() => !!token.value)
  const brokerName = computed(() => broker.value?.name || '')

  const login = async (email: string, password: string) => {
    const { apiFetch } = useApiFetch()
    const response = await apiFetch<{ success: boolean; token: string; broker: Broker }>(
      '/api/public/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
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
    const { apiFetch } = useApiFetch()
    const response = await apiFetch<{ success: boolean; message: string; token?: string; broker?: Broker }>(
      '/api/public',
      { method: 'POST', body: JSON.stringify({ name, email, password }) }
    )
    return response
  }

  const setAuth = (newToken: string, newBroker: Broker) => {
    token.value = newToken
    broker.value = newBroker
    if (process.client) {
      localStorage.setItem('token', newToken)
      localStorage.setItem('broker', JSON.stringify(newBroker))
    }
  }

  const logout = () => {
    token.value = null
    broker.value = null
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('broker')
    }
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

  return { token, broker, isAuthenticated, brokerName, login, register, setAuth, logout, initialize }
})
