<template>
  <NuxtLayout name="auth">
    <h2 style="margin-bottom:.25rem">Create Account</h2>
    <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:1.5rem">Register as a new broker</p>

    <div v-if="error"   class="alert alert-error">{{ error }}</div>
    <div v-if="success" class="alert alert-success">{{ success }}</div>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input id="name" v-model="form.name" type="text" placeholder="Akhilesh Broker" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" placeholder="broker@example.com" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" placeholder="Min 6 characters" required minlength="6" />
      </div>

      <button type="submit" class="btn btn-primary btn-lg" :disabled="loading" style="width:100%;justify-content:center;margin-top:.5rem">
        <span v-if="loading">Creating account…</span>
        <span v-else>Create Account</span>
      </button>
    </form>

    <div class="divider" />
    <p style="text-align:center;font-size:.88rem;color:var(--text-muted)">
      Already have an account?
      <NuxtLink to="/login" style="color:var(--navy);font-weight:600">Sign In</NuxtLink>
    </p>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: false })

const { register } = useAuth()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '' })
const error   = ref('')
const success = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await register(form)
    success.value = 'Account created! Redirecting to login…'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e: any) {
    error.value = e.message || 'Registration failed. Try again.'
  } finally {
    loading.value = false
  }
}
</script>