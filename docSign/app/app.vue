<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div v-for="t in toasts" :key="t.id" class="toast-container">
      <div :class="['toast-item', `toast-${t.type}`]">
        {{ t.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
authStore.initialize()

const { toasts } = useToast()
</script>

<style>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.toast-item {
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  animation: slideIn 0.2s ease;
}
.toast-success { background: #2E9E6B; }
.toast-error { background: #E04545; }
.toast-info { background: #0B1437; }
@keyframes slideIn {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
