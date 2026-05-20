<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <h2 class="text-3xl font-bold text-center">Broker Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Login
        </button>
      </form>
      <p class="text-center">Don't have an account? <NuxtLink to="/register" class="text-blue-600">Register</NuxtLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const { show } = useToast()

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
    show('Login successful!', 'success')
    await navigateTo('/broker/dashboard')
  } catch (error: any) {
    show(error.message, 'error')
  }
}
</script>