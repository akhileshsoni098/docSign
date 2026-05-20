<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Assignments</h1>
      <button @click="showModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create Assignment
      </button>
    </div>

    <div v-if="assignmentStore.loading" class="text-center py-10">Loading...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AssignmentCard
        v-for="assignment in assignmentStore.assignments"
        :key="assignment._id"
        :assignment="assignment"
        @deleted="refreshAssignments"
      />
    </div>

    <Modal v-model="showModal" title="Create New Assignment">
      <form @submit.prevent="createAssignment" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Customer</label>
          <select v-model="newAssignment.customerId" required class="w-full border rounded px-3 py-2">
            <option value="">Select Customer</option>
            <option v-for="c in customerStore.customers" :key="c._id" :value="c._id">
              {{ c.name }} ({{ c.email }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium">Policy</label>
          <select v-model="newAssignment.policyId" required class="w-full border rounded px-3 py-2">
            <option value="">Select Policy</option>
            <option v-for="p in policyStore.policies" :key="p._id" :value="p._id">
              {{ p.title }} - ₹{{ p.premium }}
            </option>
          </select>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">Create</button>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
const assignmentStore = useAssignmentStore()
const customerStore = useCustomerStore()
const policyStore = usePolicyStore()
const authStore = useAuthStore()
const { show } = useToast()

const showModal = ref(false)
const newAssignment = reactive({ customerId: '', policyId: '' })

await Promise.all([
  customerStore.fetchCustomers(),
  policyStore.fetchPolicies(authStore.broker!._id),
  assignmentStore.fetchAssignments(authStore.broker!._id),
])

const createAssignment = async () => {
  try {
    await assignmentStore.createAssignment(newAssignment)
    show('Assignment created and email sent to customer', 'success')
    showModal.value = false
    newAssignment.customerId = ''
    newAssignment.policyId = ''
  } catch (error: any) {
    show(error.message, 'error')
  }
}

const refreshAssignments = () => {
  assignmentStore.fetchAssignments(authStore.broker!._id)
}
</script>