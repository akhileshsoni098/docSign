<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

onMounted(async () => {
  auth.initialize()

  if (auth.isAuthenticated) {
    await navigateTo('/dashboard')
  } else {
    await navigateTo('/login')
  }
})
</script>
