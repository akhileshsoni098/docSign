<template>
    <NuxtLayout name="auth">
        <h2 style="margin-bottom:.25rem">Welcome back</h2>
        <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:1.5rem">Sign in to your broker account</p>

        <div v-if="error" class="alert alert-error">{{ error }}</div>

        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="form.email" type="email" placeholder="broker@example.com" required
                    :class="{ error: !!error }" />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input id="password" v-model="form.password" type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" class="btn btn-primary btn-lg" :disabled="loading"
                style="width:100%;justify-content:center;margin-top:.5rem">
                <span v-if="loading">Signing in…</span>
                <span v-else>Sign In</span>
            </button>
        </form>

        <div class="divider" />
        <p style="text-align:center;font-size:.88rem;color:var(--text-muted)">
            No account?
            <NuxtLink to="/register" style="color:var(--navy);font-weight:600">Register as Broker</NuxtLink>
        </p>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false
})

const { login } = useAuth()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleLogin() {
    error.value = ''
    loading.value = true
    try {
        await login(form)
        router.push('/dashboard')
    } catch (e: any) {
        error.value = e.message || 'Login failed. Check your credentials.'
    } finally {
        loading.value = false
    }
}
</script>