<template>
  <div>
    <div class="page-header">
      <h1>Policy Assignments</h1>
      <NuxtLink to="/assignments/create" class="btn btn-gold">+ New Assignment</NuxtLink>
    </div>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <div class="card">
      <div v-if="loading"><div class="spinner" /></div>
      <div v-else-if="!assignments.length" class="empty-state">
        <div class="icon">◑</div>
        <p>No assignments yet. Assign a policy to a customer.</p>
      </div>
      <template v-else>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Policy</th>
                <th>Status</th>
                <th>Signed At</th>
                <th>Signing Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in assignments" :key="a._id">
                <td style="color:var(--text-muted)">{{ (page - 1) * limit + i + 1 }}</td>
                <td style="font-weight:500">{{ a.customerId?.name || '—' }}</td>
                <td>{{ a.policyId?.title || '—' }}</td>
                <td>
                  <span class="badge" :class="`badge-${a.status || 'pending'}`">
                    {{ a.status || 'pending' }}
                  </span>
                </td>
                <td>{{ a.signedAt ? formatDate(a.signedAt) : '—' }}</td>
                <td>
                  <button
                    v-if="a.signingToken"
                    class="btn btn-outline btn-sm"
                    @click="copyLink(a.signingToken)"
                    :title="signLink(a.signingToken)"
                  >
                    📋 Copy Link
                  </button>
                  <span v-else style="color:var(--text-muted);font-size:.82rem">—</span>
                </td>
                <td>
                  <NuxtLink :to="`/assignments/${a._id}`" class="btn btn-outline btn-sm">View</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button :disabled="page === 1" @click="changePage(page - 1)">← Prev</button>
          <button v-for="p in totalPages" :key="p" :class="{ active: p === page }" @click="changePage(p)">{{ p }}</button>
          <button :disabled="page === totalPages" @click="changePage(page + 1)">Next →</button>
        </div>
      </template>
    </div>

    <!-- Copy toast -->
    <div v-if="copied" class="toast">Link copied to clipboard!</div>
  </div>
</template>

<script setup lang="ts">
import { useAssignment } from '~/composables/useAssignment'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { getAssignments } = useAssignment()
const config = useRuntimeConfig()

const assignments = ref<any[]>([])
const page       = ref(1)
const limit      = ref(10)
const total      = ref(0)
const loading    = ref(true)
const error      = ref('')
const copied     = ref(false)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

async function fetchAssignments() {
  loading.value = true
  error.value = ''
  try {
    const data = await getAssignments(page.value, limit.value)
    assignments.value = data.assignments || data.data || []
    total.value       = data.total || data.pagination?.total || assignments.value.length
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function changePage(p: number) { page.value = p; fetchAssignments() }

function signLink(token: string) {
  // Public sign URL for customer
  const base = config.public.appUrl || window.location.origin
  return `${base}/sign/${token}`
}

async function copyLink(token: string) {
  try {
    await navigator.clipboard.writeText(signLink(token))
    copied.value = true
    setTimeout(() => (copied.value = false), 2500)
  } catch (_) { /* fallback */ }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(fetchAssignments)
</script>

<style scoped>
.toast {
  position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
  background: var(--navy); color: #fff; padding: .65rem 1.5rem;
  border-radius: 999px; font-size: .88rem; z-index: 300;
  box-shadow: var(--shadow-md);
  animation: fadein .2s ease;
}
@keyframes fadein { from { opacity:0; transform: translateX(-50%) translateY(8px); } }
</style>