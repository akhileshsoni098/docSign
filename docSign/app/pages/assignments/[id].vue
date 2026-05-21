<template>
  <div>
    <div class="page-header">
      <h1>Assignment Detail</h1>
      <NuxtLink to="/assignments" class="btn btn-outline">← Back</NuxtLink>
    </div>

    <div v-if="loading"><div class="spinner" /></div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>
    <div v-else class="detail-grid">
      <!-- Main info -->
      <div class="card">
        <h3 style="margin-bottom:1rem">Assignment Info</h3>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="badge" :class="`badge-${assignment.status || 'pending'}`">{{ assignment.status || 'pending' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer</span>
          <span>{{ assignment.customerId?.name || '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer Email</span>
          <span>{{ assignment.customerId?.email || '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Policy</span>
          <span>{{ assignment.policyId?.title || '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Premium</span>
          <span>₹{{ Number(assignment.policyId?.premium || 0).toLocaleString('en-IN') }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration</span>
          <span>{{ assignment.policyId?.duration || '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Assigned On</span>
          <span>{{ formatDate(assignment.createdAt) }}</span>
        </div>
        <div v-if="assignment.signedAt" class="detail-row">
          <span class="detail-label">Signed At</span>
          <span>{{ formatDate(assignment.signedAt) }}</span>
        </div>
      </div>

      <!-- Documents & Signing -->
      <div class="card">
        <h3 style="margin-bottom:1rem">Documents & Signing</h3>

        <div v-if="assignment.policyId?.documentUrl" class="doc-item">
          <span class="detail-label">Policy Document</span>
          <a :href="assignment.policyId.documentUrl" target="_blank" class="btn btn-outline btn-sm">View PDF ↗</a>
        </div>

        <div v-if="assignment.signedPdfUrl" class="doc-item" style="margin-top:.75rem">
          <span class="detail-label">Signed Document</span>
          <a :href="assignment.signedPdfUrl" target="_blank" class="btn btn-outline btn-sm">View Signed ↗</a>
        </div>

        <div class="divider" />

        <div v-if="assignment.signingToken">
          <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:.75rem">Signing link for customer:</p>
          <div class="link-box">
            <span class="link-text">{{ signLinkUrl }}</span>
            <button class="btn btn-gold btn-sm" @click="copyLink">📋 Copy</button>
          </div>
          <div style="margin-top:.75rem;display:flex;gap:.5rem">
            <a :href="`/api/public/sign/${assignment.signingToken}`" target="_blank" class="btn btn-primary btn-sm">Open DocuSign ↗</a>
          </div>
        </div>
        <div v-else>
          <p style="font-size:.88rem;color:var(--text-muted)">No signing token available.</p>
        </div>
      </div>
    </div>

    <div v-if="copied" class="toast">Link copied!</div>
  </div>
</template>

<script setup lang="ts">
import { useAssignment } from '~/composables/useAssignment'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = route.params.id as string

const { getAssignment } = useAssignment()
const config = useRuntimeConfig()

const assignment = ref<any>({})
const loading    = ref(true)
const error      = ref('')
const copied     = ref(false)

const signLinkUrl = computed(() => {
  const base = config.public.appUrl || (process.client ? window.location.origin : '')
  return `${base}/api/public/sign/${assignment.value.signingToken}`
})

onMounted(async () => {
  try {
    const data = await getAssignment(id)
    assignment.value = data.assignment || data
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

async function copyLink() {
  await navigator.clipboard.writeText(signLinkUrl.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2500)
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
@media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: .65rem 0; border-bottom: 1px solid var(--border); }
.detail-row:last-child { border-bottom: none; }
.detail-label { font-size: .78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: .04em; }
.doc-item { display: flex; justify-content: space-between; align-items: center; }
.link-box { display: flex; align-items: center; gap: .75rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: .6rem .9rem; }
.link-text { flex: 1; font-size: .78rem; color: var(--text-muted); word-break: break-all; }
.toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--navy); color: #fff; padding: .65rem 1.5rem; border-radius: 999px; font-size: .88rem; z-index: 300; }
</style>