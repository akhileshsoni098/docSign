<template>
  <div>
    <div class="page-header">
      <h1>Add Customer</h1>
      <NuxtLink to="/customers" class="btn btn-outline">← Back</NuxtLink>
    </div>

    <div class="card form-wrap">
      <div v-if="error"   class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label for="name">Full Name *</label>
          <input id="name" v-model="form.name" type="text" placeholder="Rahul Sharma" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="email">Email *</label>
            <input id="email" v-model="form.email" type="email" placeholder="rahul@example.com" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input id="phone" v-model="form.phone" type="tel" placeholder="9876543210" />
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <textarea id="address" v-model="form.address" placeholder="Delhi, India" rows="3" />
        </div>

        <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:.5rem">
          <NuxtLink to="/customers" class="btn btn-outline">Cancel</NuxtLink>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Creating…' : 'Create Customer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomer } from '~/composables/useCustomer'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { createCustomer } = useCustomer()
const router = useRouter()

const form    = reactive({ name: '', email: '', phone: '', address: '' })
const error   = ref('')
const success = ref('')
const loading = ref(false)

async function handleCreate() {
  error.value = ''
  loading.value = true
  try {
    await createCustomer(form)
    success.value = 'Customer created successfully!'
    setTimeout(() => router.push('/customers'), 1200)
  } catch (e: any) {
    error.value = e.message || 'Failed to create customer.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-wrap { max-width: 640px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }
</style>