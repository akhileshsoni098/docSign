import { useApiFetch } from "~/utils/api"

// composables/usePolicy.ts
export const usePolicy = () => {
  const { apiFetch } = useApiFetch()

  // Builds FormData when a file is included, else sends JSON
  function buildBody(payload: Record<string, any>, file?: File | null) {
    if (file) {
      const fd = new FormData()
      Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)))
      fd.append('document', file)
      return fd
    }
    return JSON.stringify(payload)
  }

  // POST /api/broker/policy/create
  async function createPolicy(
    payload: { title: string; premium: number; coverage: string; duration: string },
    file?: File | null
  ) {
    return apiFetch('/api/broker/policy/create', {
      method: 'POST',
      body: buildBody(payload, file),
    })
  }

  // GET /api/broker/policy?page=&limit=
  async function getPolicies(page = 1, limit = 10) {
    return apiFetch(`/api/broker/policy?page=${page}&limit=${limit}`)
  }

  // GET /api/broker/policy/:id
  async function getPolicy(id: string) {
    return apiFetch(`/api/broker/policy/${id}`)
  }

  // PUT /api/broker/policy/:id  (params id already handled by Nuxt [id].put.ts)
  async function updatePolicy(
    id: string,
    payload: { title?: string; premium?: number; coverage?: string; duration?: string },
    file?: File | null
  ) {
    return apiFetch(`/api/broker/policy/${id}`, {
      method: 'PUT',
      body: buildBody(payload, file),
    })
  }

  // DELETE /api/broker/policy/:id
  async function deletePolicy(id: string) {
    return apiFetch(`/api/broker/policy/${id}`, { method: 'DELETE' })
  }

  return { createPolicy, getPolicies, getPolicy, updatePolicy, deletePolicy }
}