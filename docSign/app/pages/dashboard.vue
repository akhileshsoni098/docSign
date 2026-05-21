<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p class="page-subtitle">Overview of your brokerage activity</p>
      </div>
      <button class="btn btn-outline btn-sm" @click="refresh">
        <span>⟳</span> Refresh
      </button>
    </div>

    <div v-if="loading" class="spinner" />

    <template v-else>
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-customers">◉</div>
          <div class="stat-body">
            <p class="stat-value">{{ dashboard.totalCustomers }}</p>
            <p class="stat-label">Total Customers</p>
          </div>
          <NuxtLink to="/customers" class="stat-link">View all →</NuxtLink>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-policies">◐</div>
          <div class="stat-body">
            <p class="stat-value">{{ dashboard.totalPolicies }}</p>
            <p class="stat-label">Total Policies</p>
          </div>
          <NuxtLink to="/policies" class="stat-link">View all →</NuxtLink>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-pending">◑</div>
          <div class="stat-body">
            <p class="stat-value">{{ dashboard.pendingAssignments }}</p>
            <p class="stat-label">Pending Signatures</p>
          </div>
          <NuxtLink to="/assignments" class="stat-link">View all →</NuxtLink>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-signed">✓</div>
          <div class="stat-body">
            <p class="stat-value">{{ dashboard.signedAssignments }}</p>
            <p class="stat-label">Signed Policies</p>
          </div>
          <NuxtLink to="/assignments" class="stat-link">View all →</NuxtLink>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card quick-actions-card">
        <h3 style="margin-bottom: 0.75rem">Quick Actions</h3>
        <div class="quick-actions">
          <NuxtLink to="/customers/create" class="quick-action-btn">
            <span class="qa-icon">＋</span>
            <span>Add Customer</span>
          </NuxtLink>
          <NuxtLink to="/policies/create" class="quick-action-btn">
            <span class="qa-icon">📄</span>
            <span>Create Policy</span>
          </NuxtLink>
          <NuxtLink to="/assignments/create" class="quick-action-btn">
            <span class="qa-icon">⇄</span>
            <span>New Assignment</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Assignments -->
      <div class="card">
        <div class="card-header">
          <h3>Recent Assignments</h3>
          <NuxtLink to="/assignments" class="btn btn-outline btn-sm">View All</NuxtLink>
        </div>

        <div v-if="!dashboard.recentAssignments.length" class="empty-state" style="padding:2rem 0">
          <p>No assignments yet. Create your first assignment.</p>
        </div>
        <div v-else class="table-wrap" style="margin-top:1rem">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Policy</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in dashboard.recentAssignments" :key="a._id">
                <td style="font-weight:500">{{ a.customerId?.name || '—' }}</td>
                <td>{{ a.policyId?.title || '—' }}</td>
                <td>
                  <span class="badge" :class="`badge-${a.status || 'pending'}`">
                    {{ a.status || 'pending' }}
                  </span>
                </td>
                <td>{{ formatDate(a.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard'

definePageMeta({
  layout: 'default'
})

const { stats: dashboard, loading, fetchStats } = useDashboard()

function refresh() {
  fetchStats()
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(fetchStats)
</script>

<style scoped>
.page-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 0.2rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .stats-grid { grid-template-columns: 1fr; }
}
.stat-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: var(--shadow-sm);
}
.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #fff;
}
.stat-customers { background: #0B1437; }
.stat-policies { background: #C9A84C; }
.stat-pending { background: #D97706; }
.stat-signed { background: #2E9E6B; }
.stat-body { flex: 1; }
.stat-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
}
.stat-label {
  font-size: 0.82rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.stat-link {
  font-size: 0.82rem;
  color: var(--navy);
  font-weight: 600;
  text-decoration: none;
}
.stat-link:hover { color: var(--gold); }

.quick-actions-card {
  margin-bottom: 1.5rem;
}
.quick-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.1rem;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text-primary);
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.15s;
  background: var(--surface);
}
.quick-action-btn:hover {
  border-color: var(--navy);
  background: var(--surface-2);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
.qa-icon {
  font-size: 1rem;
  color: var(--gold);
  font-weight: 700;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
