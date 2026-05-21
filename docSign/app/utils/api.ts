export const useApiFetch = () => {
  const config = useRuntimeConfig()
  const BASE = config.public.appUrl

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('token') || ''
    }
    return ''
  }

  async function apiFetch<T = any>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const isFormData = options.body instanceof FormData

    const headers: Record<string, string> = {
      Authorization: `Bearer ${getToken()}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...((options.headers as Record<string, string>) || {})
    }

    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers
    })

    const ct = res.headers.get('content-type') || ''
    const data = ct.includes('application/json')
      ? await res.json()
      : await res.text()

    if (!res.ok) {
      throw new Error(
        (data?.message || data?.error) ??
        `Request failed (${res.status})`
      )
    }

    return data as T
  }

  return { apiFetch, BASE }
}
