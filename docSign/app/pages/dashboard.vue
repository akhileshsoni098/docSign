<template>
  <div class="app-layout">
    
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="logo">BrokerDesk</h2>

      <nav class="nav-links">
        <NuxtLink to="/dashboard">Dashboard</NuxtLink>

        <NuxtLink to="/customers">
          Customers
        </NuxtLink>

        <NuxtLink to="/policies">
          Policies
        </NuxtLink>

        <NuxtLink to="/assignments">
          Assignments
        </NuxtLink>

        <button class="logout-btn" @click="logout">
          Logout
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="main-content">
      <slot />
    </main>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

function logout() {
  auth.logout()
  navigateTo('/login')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #0b1446;
  color: white;
  padding: 1.5rem;
}

.logo {
  margin-bottom: 2rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: .75rem 1rem;
  border-radius: 8px;
}

.nav-links a.router-link-active {
  background: rgba(255,255,255,.15);
}

.logout-btn {
  margin-top: 2rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
}
</style>