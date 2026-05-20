import { useApiFetch } from "~/utils/api"

// composables/useCustomer.ts
export const useCustomer = () => {
  const { apiFetch } = useApiFetch()

  // POST /api/broker/customer/create
  async function createCustomer(payload: {
    name: string
    email: string
    phone: string
    address: string
  }) {
    return apiFetch('/api/broker/customer/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  // GET /api/broker/customer?page=&limit=
  async function getCustomers(page = 1, limit = 10) {
    return apiFetch(`/api/broker/customer?page=${page}&limit=${limit}`)
  }

  // GET /api/broker/customer/:id
  async function getCustomer(id: string) {
    return apiFetch(`/api/broker/customer/${id}`)
  }

  // PUT /api/broker/customer/:id
  async function updateCustomer(
    id: string,
    payload: { name?: string; phone?: string; address?: string; email?: string }
  ) {
    return apiFetch(`/api/broker/customer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  // DELETE /api/broker/customer/:id
  async function deleteCustomer(id: string) {
    return apiFetch(`/api/broker/customer/${id}`, { method: 'DELETE' })
  }

  return { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer }
}