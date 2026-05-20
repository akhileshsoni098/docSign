<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="px-6 py-8">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-8">Sign Your Policy Document</h1>

        <div v-if="loading" class="text-center py-10">Loading assignment details...</div>
        <div v-else-if="error" class="text-center py-10 text-red-600">{{ error }}</div>
        <div v-else-if="assignment">
          <SigningForm :assignment="assignment" @signed="onSigned" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import type { Assignment } from '~/types'

const route = useRoute()
const token = computed(() => route.params.token as string)

const assignment = ref<Assignment | null>(null)
const loading = ref(true)
const error = ref('')

const fetchAssignment = async () => {
  try {
    const api = useApi()
    const response = await api.get<Assignment>(`/api/public/assignment/${token.value}`)
    assignment.value = response
  } catch (err: any) {
    error.value = err.message || 'Invalid or expired signing link'
  } finally {
    loading.value = false
  }
}

const onSigned = () => {
  alert('Document signed successfully!')
}

await fetchAssignment()
</script>