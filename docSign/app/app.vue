<template>
  <div>
    <AppHeader v-if="authStore.isAuthenticated" />
    <div class="flex">
      <AppSidebar v-if="authStore.isAuthenticated" />
      <main class="flex-1 p-6 bg-gray-100 min-h-screen">
        <NuxtPage />
      </main>
    </div>
    <div v-if="toast" class="fixed bottom-4 right-4 z-50">
      <div :class="{
        'bg-green-500': toast.type === 'success',
        'bg-red-500': toast.type === 'error',
        'bg-blue-500': toast.type === 'info',
      }" class="text-white px-6 py-3 rounded-lg shadow-lg">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { toast } = useToast()
authStore.initialize()
</script>