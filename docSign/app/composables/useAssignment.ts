import { useApiFetch } from "~/utils/api"

// composables/useAssignment.ts
export const useAssignment = () => {
  const { apiFetch } = useApiFetch()

  // POST /api/broker/policy-assignment/create
  async function createAssignment(payload: {
    customerId: string
    policyId: string
  }) {
    return apiFetch('/api/broker/policy-assignment/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  // GET /api/broker/policy-assignment?page=&limit=
  async function getAssignments(page = 1, limit = 10) {
    return apiFetch(`/api/broker/policy-assignment?page=${page}&limit=${limit}`)
  }

  // GET /api/broker/policy-assignment/:id
  async function getAssignment(id: string) {
    return apiFetch(`/api/broker/policy-assignment/${id}`)
  }

  return { createAssignment, getAssignments, getAssignment }
}