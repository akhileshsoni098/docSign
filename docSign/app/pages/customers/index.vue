<template>
  <div>
    <div class="page-header">
      <h1>Customers</h1>
      <NuxtLink to="/customers/create" class="btn btn-gold">+ Add Customer</NuxtLink>
    </div>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <div class="card">
      <div v-if="loading"><div class="spinner" /></div>
      <div v-else-if="!customers.length" class="empty-state">
        <div class="icon">◉</div>
        <p>No customers yet. Add your first customer to get started.</p>
      </div>
      <template v-else>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, i) in customers" :key="c._id">
                <td style="color:var(--text-muted)">{{ (page - 1) * limit + i + 1 }}</td>
                <td style="font-weight:500">{{ c.name }}</td>
                <td>{{ c.email }}</td>
                <td>{{ c.phone || '—' }}</td>
                <td>{{ c.address || '—' }}</td>
                <td>
                  <div style="display:flex;gap:.5rem">
                    <NuxtLink :to="`/customers/${c._id}`" class="btn btn-outline btn-sm">Edit</NuxtLink>
                    <button class="btn btn-danger btn-sm" @click="confirmDelete(c)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button :disabled="page === 1" @click="changePage(page - 1)">← Prev</button>
          <button
            v-for="p in totalPages"
            :key="p"
            :class="{ active: p === page }"
            @click="changePage(p)"
          >{{ p }}</button>
          <button :disabled="page === totalPages" @click="changePage(page + 1)">Next →</button>
        </div>
      </template>
    </div>

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal card">
          <h3>Delete Customer</h3>
          <p style="margin-top:.5rem;color:var(--text-muted)">
            Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong>? This cannot be undone.
          </p>
          <div style="display:flex;gap:.75rem;margin-top:1.25rem;justify-content:flex-end">
            <button class="btn btn-outline" @click="deleteTarget = null">Cancel</button>
            <button class="btn btn-danger" :disabled="deleting" @click="handleDelete">
              {{ deleting ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCustomer } from '~/composables/useCustomer'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { getCustomers, deleteCustomer } = useCustomer()

const customers  = ref<any[]>([])
const page       = ref(1)
const limit      = ref(10)
const total      = ref(0)
const loading    = ref(true)
const error      = ref('')
const deleteTarget = ref<any>(null)
const deleting   = ref(false)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

async function fetchCustomers() {
  loading.value = true
  error.value = ''
  try {
    const data = await getCustomers(page.value, limit.value)
    customers.value = data.customers || data.data || []
    total.value     = data.total || data.pagination?.total || customers.value.length
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function changePage(p: number) { page.value = p; fetchCustomers() }
function confirmDelete(c: any) { deleteTarget.value = c }

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await deleteCustomer(deleteTarget.value._id)
    deleteTarget.value = null
    await fetchCustomers()
  } catch (e: any) {
    error.value = e.message
  } finally {
    deleting.value = false
  }
}

onMounted(fetchCustomers)
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 1rem;
}
.modal { max-width: 420px; width: 100%; }
</style>