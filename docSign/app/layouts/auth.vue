<template>
  <div class="auth-shell">
    <div class="auth-brand">
      <span class="brand-icon">⚜</span>
      <h1 class="brand-name">BrokerDesk</h1>
      <p class="brand-sub">Policy Management Platform</p>
    </div>
    <div class="auth-card card">
      <slot />
    </div>
    <p class="auth-footer">© {{ year }} BrokerDesk. All rights reserved.</p>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(145deg, var(--navy) 0%, var(--navy-light) 100%);
  position: relative;
  overflow: hidden;
}
.auth-shell::before {
  content: '';
  position: absolute;
  width: 500px; height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,.12), transparent 70%);
  top: -100px; right: -100px;
}
.auth-shell::after {
  content: '';
  position: absolute;
  width: 350px; height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,.08), transparent 70%);
  bottom: -80px; left: -80px;
}

.auth-brand {
  text-align: center;
  margin-bottom: 2rem;
  position: relative; z-index: 1;
}
.brand-icon { font-size: 2.5rem; color: var(--gold); display: block; margin-bottom: .5rem; }
.brand-name {
  font-family: var(--font-display);
  font-size: 2rem;
  color: #fff;
  font-weight: 700;
  letter-spacing: .02em;
}
.brand-sub { color: rgba(255,255,255,.5); font-size: .9rem; margin-top: .25rem; }

.auth-card {
  width: 100%;
  max-width: 420px;
  position: relative; z-index: 1;
  box-shadow: var(--shadow-lg);
}

.auth-footer {
  margin-top: 1.5rem;
  color: rgba(255,255,255,.3);
  font-size: .78rem;
  position: relative; z-index: 1;
}
</style>