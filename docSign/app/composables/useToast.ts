const toasts = ref<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([])
let nextId = 0

export const useToast = () => {
  const show = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }

  return { toasts, show }
}
