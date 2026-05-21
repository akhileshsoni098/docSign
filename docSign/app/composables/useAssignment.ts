import { useApiFetch } from "~/utils/api"

export const useAssignment = () => {
  const { apiFetch } = useApiFetch()

  async function createAssignment(payload: {
    customerId: string
    policyId: string
  }) {
    return apiFetch('/api/broker/policy-assignment/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async function getAssignments(page = 1, limit = 10) {
    return apiFetch(`/api/broker/policy-assignment?page=${page}&limit=${limit}`)
  }

  async function getAssignment(id: string) {
    return apiFetch(`/api/broker/policy-assignment/${id}`)
  }

  return { createAssignment, getAssignments, getAssignment }
}
