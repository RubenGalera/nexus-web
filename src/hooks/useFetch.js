import { useState, useEffect, useCallback } from 'react'
/**
 * useFetch — Custom hook para peticiones HTTP GET
 *
 * Uso:
 *   const { data, loading, error, refetch } = useFetch(url)
 *
 * - Pasa `null` como url para no ejecutar la petición.
 * - `refetch()` fuerza una nueva llamada a la misma URL.
 * - Cancela automáticamente la petición en vuelo si el componente
 *   se desmonta o cambia la URL (evita actualizaciones en componentes
 *   ya desmontados).
 *
 * @param {string|null} url
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: () => void }}
 */
export function useFetch(url) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [tick, setTick]       = useState(0)          // incrementar para re-fetch

  const refetch = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    if (!url) return

    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Error desconocido')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    // Cleanup: marcar como cancelado para ignorar respuestas tardías
    return () => { cancelled = true }
  }, [url, tick])

  return { data, loading, error, refetch }
}
