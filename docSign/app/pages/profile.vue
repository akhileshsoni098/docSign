<template>
  <div>
    <div class="page-header">
      <h1>My Profile</h1>
      <button class="btn btn-primary" @click="fetchProfile">Refresh</button>
    </div>

    <div v-if="loading"><div class="spinner" /></div>
    <div v-else class="profile-layout">
      <div class="card profile-card">
        <div class="avatar-circle">{{ initials }}</div>
        <h2 style="margin-top:1rem">{{ profile.name }}</h2>
        <span class="badge badge-signed" style="margin-top:.5rem">{{ profile.role }}</span>

        <div class="divider" />

        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-val">{{ profile.email }}</span>
        </div>
        <div class="detail-row" v-if="profile.createdAt">
          <span class="detail-label">Member Since</span>
          <span class="detail-val">{{ formatDate(profile.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { getProfile } = useAuth()
const auth = useAuthStore()

const loading = ref(true)
const profile = ref<any>({})

const initials = computed(() => {
  const n = profile.value?.name || 'B'
  return n.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
})

async function fetchProfile() {
  loading.value = true
  try {
    const data = await getProfile()
    profile.value = data.broker || data.user || data
  } catch (_) {
    profile.value = auth.broker || {}
  } finally {
    loading.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-layout { max-width: 420px; }
.profile-card { text-align: center; }
.avatar-circle {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--navy); color: #fff;
  font-family: var(--font-display); font-size: 1.8rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto;
}
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: .6rem 0; border-bottom: 1px solid var(--border); }
.detail-row:last-child { border-bottom: none; }
.detail-label { font-size: .8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: .04em; }
.detail-val { font-size: .92rem; font-weight: 500; }
</style>