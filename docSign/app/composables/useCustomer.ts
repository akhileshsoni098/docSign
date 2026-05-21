import { useApiFetch } from "~/utils/api"

export const useCustomer = () => {
  const { apiFetch } = useApiFetch()

  async function createCustomer(payload: {
    name: string
    email: string
    phone: string
    address?: string
  }) {
    return apiFetch('/api/broker/customer/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async function getCustomers(page = 1, limit = 10) {
    return apiFetch(`/api/broker/customer?page=${page}&limit=${limit}`)
  }

  async function getCustomer(id: string) {
    return apiFetch(`/api/broker/customer/${id}`)
  }

  async function updateCustomer(
    id: string,
    payload: { name?: string; phone?: string; address?: string; email?: string }
  ) {
    return apiFetch(`/api/broker/customer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  async function deleteCustomer(id: string) {
    return apiFetch(`/api/broker/customer/${id}`, { method: 'DELETE' })
  }

  return { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer }
}
