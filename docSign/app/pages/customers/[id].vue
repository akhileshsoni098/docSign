<template>
  <div>
    <div class="page-header">
      <h1>Edit Customer</h1>
      <NuxtLink to="/customers" class="btn btn-outline">← Back</NuxtLink>
    </div>

    <div v-if="fetchLoading"><div class="spinner" /></div>
    <div v-else class="card form-wrap">
      <div v-if="error"   class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="name">Full Name *</label>
          <input id="name" v-model="form.name" type="text" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" />
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input id="phone" v-model="form.phone" type="tel" />
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <textarea id="address" v-model="form.address" rows="3" />
        </div>

        <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:.5rem">
          <NuxtLink to="/customers" class="btn btn-outline">Cancel</NuxtLink>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save Changes' }}
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

const route = useRoute()
const id = route.params.id as string   // ← id from [id].vue params

const { getCustomer, updateCustomer } = useCustomer()

const form = reactive({ name: '', email: '', phone: '', address: '' })
const fetchLoading = ref(true)
const saving  = ref(false)
const error   = ref('')
const success = ref('')

// Load existing customer data
onMounted(async () => {
  try {
    const data = await getCustomer(id)
    const c = data.customer || data
    form.name    = c.name    || ''
    form.email   = c.email   || ''
    form.phone   = c.phone   || ''
    form.address = c.address || ''
  } catch (e: any) {
    error.value = e.message
  } finally {
    fetchLoading.value = false
  }
})

async function handleUpdate() {
  error.value = ''
  saving.value = true
  try {
    // PUT /api/broker/customer/:id  — id passed via params, backend uses it
    await updateCustomer(id, form)
    success.value = 'Customer updated successfully!'
  } catch (e: any) {
    error.value = e.message || 'Failed to update.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-wrap { max-width: 640px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }
</style>