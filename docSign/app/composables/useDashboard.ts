import { useCustomer } from "./useCustomer"
import { usePolicy } from "./usePolicy"
import { useAssignment } from "./useAssignment"

export interface DashboardStats {
  totalCustomers: number
  totalPolicies: number
  pendingAssignments: number
  signedAssignments: number
  recentAssignments: any[]
}

export const useDashboard = () => {
  const loading = ref(false)
  const stats = ref<DashboardStats>({
    totalCustomers: 0,
    totalPolicies: 0,
    pendingAssignments: 0,
    signedAssignments: 0,
    recentAssignments: [],
  })

  async function fetchStats() {
    loading.value = true
    try {
      const { getCustomers } = useCustomer()
      const { getPolicies } = usePolicy()
      const { getAssignments } = useAssignment()

      const [custRes, polRes, assignRes] = await Promise.all([
        getCustomers(1, 1),
        getPolicies(1, 1),
        getAssignments(1, 100),
      ])

      const customers = custRes.customers || []
      const policies = polRes.policies || []
      const assignments = assignRes.assignments || []

      const pending = assignments.filter((a: any) => a.status === 'pending')
      const signed = assignments.filter((a: any) => a.status === 'signed')

      stats.value = {
        totalCustomers: customers.length > 0 ? (custRes.pagination?.total || customers.length) : 0,
        totalPolicies: policies.length > 0 ? (polRes.pagination?.total || policies.length) : 0,
        pendingAssignments: pending.length,
        signedAssignments: signed.length,
        recentAssignments: assignments.slice(0, 5),
      }
    } catch {
      // silent fail
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, fetchStats }
}
