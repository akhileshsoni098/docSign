<template>
  <div>
    <div class="page-header">
      <h1>Assign Policy</h1>
      <NuxtLink to="/assignments" class="btn btn-outline">← Back</NuxtLink>
    </div>

    <div class="card form-wrap">
      <div v-if="error"   class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <!-- Signing link result -->
      <div v-if="signToken" class="sign-result">
        <p style="font-weight:600;margin-bottom:.5rem">✅ Assignment created! Share this link with your customer:</p>
        <div class="sign-link-box">
          <span class="sign-link-text">{{ signLinkUrl }}</span>
          <button class="btn btn-gold btn-sm" @click="copyLink">📋 Copy</button>
        </div>
        <p style="font-size:.82rem;color:var(--text-muted);margin-top:.5rem">Customer will use this link to sign the document.</p>
        <div style="display:flex;gap:.75rem;margin-top:1rem">
          <NuxtLink to="/assignments" class="btn btn-outline btn-sm">View All Assignments</NuxtLink>
          <NuxtLink :to="`/sign/${signToken}`" target="_blank" class="btn btn-primary btn-sm">Open Sign Page ↗</NuxtLink>
        </div>
      </div>

      <form v-else @submit.prevent="handleCreate">
        <div class="form-group">
          <label for="customer">Select Customer *</label>
          <select id="customer" v-model="form.customerId" required :disabled="customersLoading">
            <option value="" disabled>{{ customersLoading ? 'Loading…' : 'Choose a customer' }}</option>
            <option v-for="c in customers" :key="c._id" :value="c._id">{{ c.name }} — {{ c.email }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="policy">Select Policy *</label>
          <select id="policy" v-model="form.policyId" required :disabled="policiesLoading">
            <option value="" disabled>{{ policiesLoading ? 'Loading…' : 'Choose a policy' }}</option>
            <option v-for="p in policies" :key="p._id" :value="p._id">
              {{ p.title }} — ₹{{ Number(p.premium).toLocaleString('en-IN') }}
            </option>
          </select>
        </div>

        <!-- Preview selected -->
        <div v-if="selectedCustomer || selectedPolicy" class="preview-box">
          <div v-if="selectedCustomer" class="preview-row">
            <span class="preview-label">Customer</span>
            <span>{{ selectedCustomer.name }} ({{ selectedCustomer.email }})</span>
          </div>
          <div v-if="selectedPolicy" class="preview-row">
            <span class="preview-label">Policy</span>
            <span>{{ selectedPolicy.title }} — ₹{{ Number(selectedPolicy.premium).toLocaleString('en-IN') }} / {{ selectedPolicy.duration }}</span>
          </div>
        </div>

        <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:1rem">
          <NuxtLink to="/assignments" class="btn btn-outline">Cancel</NuxtLink>
          <button type="submit" class="btn btn-primary" :disabled="loading || !form.customerId || !form.policyId">
            {{ loading ? 'Assigning…' : 'Assign Policy' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssignment } from '~/composables/useAssignment'
import { useCustomer } from '~/composables/useCustomer'
import { usePolicy } from '~/composables/usePolicy'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { createAssignment } = useAssignment()
const { getCustomers }     = useCustomer()
const { getPolicies }      = usePolicy()
const config               = useRuntimeConfig()

const form = reactive({ customerId: '', policyId: '' })

const customers       = ref<any[]>([])
const policies        = ref<any[]>([])
const customersLoading = ref(true)
const policiesLoading  = ref(true)
const loading          = ref(false)
const error            = ref('')
const success          = ref('')
const signToken        = ref('')

const signLinkUrl = computed(() => {
  const base = config.public.appUrl || (process.client ? window.location.origin : '')
  return `${base}/sign/${signToken.value}`
})

const selectedCustomer = computed(() => customers.value.find(c => c._id === form.customerId))
const selectedPolicy   = computed(() => policies.value.find(p => p._id === form.policyId))

// Load dropdowns
onMounted(async () => {
  try {
    const cd = await getCustomers(1, 100)
    customers.value = cd.customers || cd.data || []
  } finally { customersLoading.value = false }

  try {
    const pd = await getPolicies(1, 100)
    policies.value = pd.policies || pd.data || []
  } finally { policiesLoading.value = false }
})

async function handleCreate() {
  error.value = ''
  loading.value = true
  try {
    const data = await createAssignment({ customerId: form.customerId, policyId: form.policyId })
    // Backend returns signingToken or signLink
    signToken.value = data.assignment?.signingToken || data.signingToken || data.token || ''
    success.value = 'Policy assigned successfully!'
  } catch (e: any) {
    error.value = e.message || 'Failed to assign policy.'
  } finally {
    loading.value = false
  }
}

async function copyLink() {
  await navigator.clipboard.writeText(signLinkUrl.value)
}
</script>

<style scoped>
.form-wrap { max-width: 560px; }

.preview-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  margin-top: .5rem;
}
.preview-row { display: flex; gap: 1rem; padding: .4rem 0; font-size: .9rem; }
.preview-label { color: var(--text-muted); min-width: 80px; font-size: .78rem; text-transform: uppercase; letter-spacing: .04em; padding-top: .1rem; }

.sign-result {
  background: #ECFDF5;
  border: 1px solid #6EE7B7;
  border-radius: var(--radius);
  padding: 1.25rem;
  margin-bottom: 1rem;
}
.sign-link-box {
  display: flex; align-items: center; gap: .75rem;
  background: #fff; border: 1px solid #6EE7B7;
  border-radius: var(--radius); padding: .6rem .9rem;
}
.sign-link-text {
  flex: 1; font-size: .82rem; color: var(--text-muted);
  word-break: break-all;
}
</style>