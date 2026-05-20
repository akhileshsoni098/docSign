<template>
  <div>
    <div class="page-header">
      <h1>Policies</h1>
      <NuxtLink to="/policies/create" class="btn btn-gold">+ Create Policy</NuxtLink>
    </div>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <div class="card">
      <div v-if="loading"><div class="spinner" /></div>
      <div v-else-if="!policies.length" class="empty-state">
        <div class="icon">◐</div>
        <p>No policies yet. Create your first policy.</p>
      </div>
      <template v-else>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Premium (₹)</th>
                <th>Coverage</th>
                <th>Duration</th>
                <th>Document</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in policies" :key="p._id">
                <td style="color:var(--text-muted)">{{ (page - 1) * limit + i + 1 }}</td>
                <td style="font-weight:500">{{ p.title }}</td>
                <td>{{ Number(p.premium).toLocaleString('en-IN') }}</td>
                <td>{{ p.coverage }}</td>
                <td>{{ p.duration }}</td>
                <td>
                  <a v-if="p.documentUrl" :href="p.documentUrl" target="_blank" class="btn btn-outline btn-sm">View PDF</a>
                  <span v-else style="color:var(--text-muted);font-size:.82rem">—</span>
                </td>
                <td>
                  <div style="display:flex;gap:.5rem">
                    <NuxtLink :to="`/policies/${p._id}`" class="btn btn-outline btn-sm">Edit</NuxtLink>
                    <button class="btn btn-danger btn-sm" @click="confirmDelete(p)">Delete</button>
                  </div>
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

    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal card">
          <h3>Delete Policy</h3>
          <p style="margin-top:.5rem;color:var(--text-muted)">Delete <strong>{{ deleteTarget?.title }}</strong>? This cannot be undone.</p>
          <div style="display:flex;gap:.75rem;margin-top:1.25rem;justify-content:flex-end">
            <button class="btn btn-outline" @click="deleteTarget = null">Cancel</button>
            <button class="btn btn-danger" :disabled="deleting" @click="handleDelete">{{ deleting ? 'Deleting…' : 'Delete' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePolicy } from '~/composables/usePolicy'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { getPolicies, deletePolicy } = usePolicy()

const policies    = ref<any[]>([])
const page        = ref(1)
const limit       = ref(10)
const total       = ref(0)
const loading     = ref(true)
const error       = ref('')
const deleteTarget = ref<any>(null)
const deleting    = ref(false)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

async function fetchPolicies() {
  loading.value = true
  error.value = ''
  try {
    const data = await getPolicies(page.value, limit.value)
    policies.value = data.policies || data.data || []
    total.value    = data.total || data.pagination?.total || policies.value.length
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function changePage(p: number) { page.value = p; fetchPolicies() }
function confirmDelete(p: any) { deleteTarget.value = p }

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await deletePolicy(deleteTarget.value._id)
    deleteTarget.value = null
    await fetchPolicies()
  } catch (e: any) {
    error.value = e.message
  } finally {
    deleting.value = false
  }
}

onMounted(fetchPolicies)
</script>

<style scoped>
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:200;padding:1rem; }
.modal { max-width:420px;width:100%; }
</style>