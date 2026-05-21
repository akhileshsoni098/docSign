<template>
  <NuxtLayout name="auth">
    <h2 style="margin-bottom:.25rem">Welcome Back</h2>
    <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:1.5rem">Sign in to your broker account</p>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" placeholder="broker@example.com" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" placeholder="Enter your password" required />
      </div>

      <button type="submit" class="btn btn-primary btn-lg" :disabled="loading" style="width:100%;justify-content:center;margin-top:.5rem">
        <span v-if="loading">Signing in…</span>
        <span v-else>Sign In</span>
      </button>
    </form>

    <div class="divider" />
    <p style="text-align:center;font-size:.88rem;color:var(--text-muted)">
      Don't have an account?
      <NuxtLink to="/register" style="color:var(--navy);font-weight:600">Create Account</NuxtLink>
    </p>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const authStore = useAuthStore()
const { show } = useToast()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    show('Login successful!', 'success')
    await navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e.message
    show(e.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>
