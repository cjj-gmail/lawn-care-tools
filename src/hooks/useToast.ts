import { useState, useCallback, useRef } from 'react'

interface ToastState {
  msg:     string
  type:    string
  visible: boolean
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ msg: '', type: '', visible: false })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string, type = '') => {
    if (timer.current) clearTimeout(timer.current)
    setToast({ msg, type, visible: true })
    timer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500)
  }, [])

  return { toast, showToast }
}
