<template>
  <div class="sign-shell">
    <!-- Header -->
    <header class="sign-header">
      <span class="brand-icon">⚜</span>
      <span class="brand-name">BrokerDesk</span>
    </header>

    <main class="sign-main">
      <!-- Loading -->
      <div v-if="loading" class="sign-card card">
        <div class="spinner" />
        <p style="text-align:center;color:var(--text-muted)">Loading document details…</p>
      </div>

      <!-- Error -->
      <div v-else-if="fetchError" class="sign-card card">
        <div class="error-icon">⚠</div>
        <h2>Invalid Link</h2>
        <p>{{ fetchError }}</p>
      </div>

      <!-- Already signed -->
      <div v-else-if="assignment.status === 'signed'" class="sign-card card success-state">
        <div class="success-icon">✓</div>
        <h2>Document Signed</h2>
        <p>This document was signed on <strong>{{ formatDate(assignment.signedAt) }}</strong>.</p>
        <a v-if="assignment.signedFileUrl" :href="assignment.signedFileUrl" target="_blank" class="btn btn-outline" style="margin-top:1rem">
          Download Signed Copy ↗
        </a>
      </div>

      <!-- Sign form -->
      <div v-else class="sign-card card">
        <div class="sign-intro">
          <h2>Sign Policy Document</h2>
          <p class="sign-sub">Please review the policy details and upload your signed document.</p>
        </div>

        <!-- Policy details -->
        <div class="policy-details">
          <h3 style="margin-bottom:.75rem">Policy Details</h3>
          <div class="detail-row">
            <span class="detail-label">Customer</span>
            <span>{{ assignment.customerId?.name || '—' }}</span>
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
            <span class="detail-label">Coverage</span>
            <span>{{ assignment.policyId?.coverage || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration</span>
            <span>{{ assignment.policyId?.duration || '—' }}</span>
          </div>
        </div>

        <!-- Original policy doc -->
        <div v-if="assignment.policyId?.documentUrl" style="margin-top:1rem">
          <a :href="assignment.policyId.documentUrl" target="_blank" class="btn btn-outline">
            📄 View Policy Document
          </a>
          <p style="font-size:.8rem;color:var(--text-muted);margin-top:.4rem">Download, sign it, and upload below.</p>
        </div>

        <div class="divider" />

        <!-- Upload signed file -->
        <div v-if="!submitSuccess">
          <div v-if="submitError" class="alert alert-error">{{ submitError }}</div>

          <h3 style="margin-bottom:.75rem">Upload Signed Document</h3>
          <div
            class="file-drop"
            :class="{ dragover: isDragging }"
            @click="fileInput?.click()"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="onDrop"
          >
            <input ref="fileInput" type="file" accept=".pdf,.doc,.docx,.jpg,.png" @change="onFileChange" />
            <div class="file-icon">📤</div>
            <p v-if="!signedFile">Click to upload your signed document</p>
            <p v-else class="file-name">{{ signedFile.name }}</p>
          </div>

          <div style="margin-top:1.25rem;display:flex;justify-content:center">
            <button
              class="btn btn-gold btn-lg"
              :disabled="!signedFile || submitting"
              @click="handleSubmit"
            >
              {{ submitting ? 'Submitting…' : '✓ Submit Signed Document' }}
            </button>
          </div>

          <p style="text-align:center;font-size:.8rem;color:var(--text-muted);margin-top:.75rem">
            By submitting, you confirm your acceptance of this policy.
          </p>
        </div>

        <!-- Submit success -->
        <div v-else class="success-state" style="text-align:center;padding:1.5rem 0">
          <div class="success-icon">✓</div>
          <h3 style="margin-top:.75rem">Document Submitted!</h3>
          <p style="color:var(--text-muted);margin-top:.5rem">Your signed document has been received. The broker will verify and confirm your policy.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSign } from '~/composables/useSign'

// This page is PUBLIC — no auth middleware
definePageMeta({ layout: false })

const route = useRoute()
const token = route.params.token as string

const { getSigningDetail, submitSignedFile } = useSign()

const assignment   = ref<any>({})
const loading      = ref(true)
const fetchError   = ref('')
const submitError  = ref('')
const submitting   = ref(false)
const submitSuccess = ref(false)

const signedFile = ref<File | null>(null)
const fileInput  = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

// Load assignment via public token
onMounted(async () => {
  try {
    const data = await getSigningDetail(token)
    assignment.value = data.assignment || data
  } catch (e: any) {
    fetchError.value = e.message
  } finally {
    loading.value = false
  }
})

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) signedFile.value = f
}
function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) signedFile.value = f
}

async function handleSubmit() {
  if (!signedFile.value) return
  submitError.value = ''
  submitting.value  = true
  try {
    await submitSignedFile(token, signedFile.value)
    submitSuccess.value = true
    assignment.value.status = 'signed'
  } catch (e: any) {
    submitError.value = e.message || 'Failed to submit. Please try again.'
  } finally {
    submitting.value = false
  }
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.sign-shell {
  min-height: 100vh;
  background: linear-gradient(160deg, var(--navy) 0%, var(--navy-light) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 3rem;
}

.sign-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,.1);
}
.brand-icon { font-size: 1.5rem; color: var(--gold); }
.brand-name { font-family: var(--font-display); font-size: 1.3rem; color: #fff; font-weight: 700; }

.sign-main { width: 100%; max-width: 600px; padding: 2rem 1rem; }

.sign-card {
  box-shadow: var(--shadow-lg);
  border: none;
}

.sign-intro { margin-bottom: 1.5rem; }
.sign-intro h2 { font-size: 1.5rem; }
.sign-sub { color: var(--text-muted); margin-top: .25rem; font-size: .92rem; }

.policy-details {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 1rem;
}
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: .55rem 0; border-bottom: 1px solid var(--border); font-size: .9rem; }
.detail-row:last-child { border-bottom: none; }
.detail-label { color: var(--text-muted); font-size: .78rem; text-transform: uppercase; letter-spacing: .04em; }

.error-icon { font-size: 3rem; text-align: center; color: var(--danger); margin-bottom: 1rem; }
.error-icon + h2 { text-align: center; }
.error-icon + h2 + p { text-align: center; color: var(--text-muted); margin-top: .5rem; }

.success-state { text-align: center; }
.success-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--success); color: #fff;
  font-size: 1.8rem; display: flex; align-items: center; justify-content: center;
  margin: 0 auto;
}
</style>