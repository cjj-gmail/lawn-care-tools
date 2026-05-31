import { useState, useCallback, useRef } from 'react'

export function useToast() {
  const [toast, setToast] = useState({ msg: '', type: '', visible: false })
  const timer = useRef(null)

  const showToast = useCallback((msg, type = '') => {
    clearTimeout(timer.current)
    setToast({ msg, type, visible: true })
    timer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500)
  }, [])

  return { toast, showToast }
}
