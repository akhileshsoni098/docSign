<template>
  <div>
    <div class="page-header">
      <h1>Edit Policy</h1>
      <NuxtLink to="/policies" class="btn btn-outline">← Back</NuxtLink>
    </div>

    <div v-if="fetchLoading"><div class="spinner" /></div>
    <div v-else class="card form-wrap">
      <div v-if="error"   class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="title">Policy Title *</label>
          <input id="title" v-model="form.title" type="text" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="premium">Premium (₹) *</label>
            <input id="premium" v-model.number="form.premium" type="number" min="0" required />
          </div>
          <div class="form-group">
            <label for="coverage">Coverage Amount *</label>
            <input id="coverage" v-model="form.coverage" type="text" required />
          </div>
        </div>

        <div class="form-group">
          <label for="duration">Duration *</label>
          <input id="duration" v-model="form.duration" type="text" required />
        </div>

        <div class="form-group">
          <label>Current Document</label>
          <a v-if="existingDocUrl" :href="existingDocUrl" target="_blank" class="btn btn-outline btn-sm">View Current PDF ↗</a>
          <span v-else style="color:var(--text-muted);font-size:.85rem">No document uploaded</span>
        </div>

        <div class="form-group">
          <label>Replace Document (optional)</label>
          <div
            class="file-drop"
            :class="{ dragover: isDragging }"
            @click="fileInput?.click()"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onDrop"
          >
            <input ref="fileInput" type="file" accept=".pdf" @change="onFileChange" />
            <div class="file-icon">📄</div>
            <p v-if="!selectedFile">Click to upload a new PDF</p>
            <p v-else class="file-name">{{ selectedFile.name }}</p>
          </div>
        </div>

        <div style="display:flex;gap:.75rem;justify-content:flex-end;margin-top:.5rem">
          <NuxtLink to="/policies" class="btn btn-outline">Cancel</NuxtLink>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePolicy } from '~/composables/usePolicy'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const id = route.params.id as string

const { getPolicy, updatePolicy } = usePolicy()

const form = reactive({ title: '', premium: 0, coverage: '', duration: '' })
const existingDocUrl = ref('')
const selectedFile = ref<File | null>(null)
const fileInput    = ref<HTMLInputElement | null>(null)
const isDragging   = ref(false)
const fetchLoading = ref(true)
const saving       = ref(false)
const error        = ref('')
const success      = ref('')

onMounted(async () => {
  try {
    const data = await getPolicy(id)
    const p = data.policy || data
    form.title    = p.title || ''
    form.premium  = p.premium || 0
    form.coverage = p.coverage || ''
    form.duration = p.duration || ''
    existingDocUrl.value = p.documentUrl || ''
  } catch (e: any) {
    error.value = e.message
  } finally {
    fetchLoading.value = false
  }
})

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) selectedFile.value = f
}
function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) selectedFile.value = f
}

async function handleUpdate() {
  error.value = ''
  saving.value = true
  try {
    await updatePolicy(id, form, selectedFile.value)
    success.value = 'Policy updated successfully!'
  } catch (e: any) {
    error.value = e.message || 'Failed to update policy.'
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
