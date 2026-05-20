export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const broker = ref(null)

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(newToken: string, user: any) {
    token.value = newToken
    broker.value = user

    if (process.client) {
      localStorage.setItem('token', newToken)
      localStorage.setItem('broker', JSON.stringify(user))
    }
  }

  function setBroker(user: any) {
    broker.value = user

    if (process.client) {
      localStorage.setItem('broker', JSON.stringify(user))
    }
  }

  function init() {
    if (process.client) {
      token.value = localStorage.getItem('token') || ''

      const savedBroker = localStorage.getItem('broker')

      if (savedBroker) {
        broker.value = JSON.parse(savedBroker)
      }
    }
  }

  function logout() {
    token.value = ''
    broker.value = null

    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('broker')
    }
  }

  return {
    token,
    broker,
    isLoggedIn,
    setAuth,
    setBroker,
    init,
    logout
  }
})