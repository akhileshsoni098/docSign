<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

onMounted(async () => {
  auth.init()

  if (auth.isLoggedIn) {
    await navigateTo('/dashboard')
  } else {
    await navigateTo('/login')
  }
})
</script>