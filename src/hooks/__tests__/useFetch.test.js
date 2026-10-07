import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useFetch } from '../useFetch.js'
import { mockFetchOnce, libroMock } from '../../test/test-utils.jsx'

describe('useFetch', () => {
  beforeEach(() => {
    global.fetch.mockReset()
  })

  it('empieza con data=null y loading=false antes de recibir url', () => {
    const { result } = renderHook(() => useFetch(null))
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('carga los datos correctamente cuando la petición tiene éxito', async () => {
    mockFetchOnce([libroMock])

    const { result } = renderHook(() => useFetch('https://example.com/libros'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual([libroMock])
    expect(result.current.error).toBeNull()
  })

  it('guarda un mensaje de error si la respuesta no es ok', async () => {
    mockFetchOnce(null, false)

    const { result } = renderHook(() => useFetch('https://example.com/libros'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toMatch(/HTTP 500/)
    expect(result.current.data).toBeNull()
  })

  it('refetch() vuelve a lanzar la petición a la misma URL', async () => {
    mockFetchOnce([libroMock])
    const { result } = renderHook(() => useFetch('https://example.com/libros'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    mockFetchOnce([{ ...libroMock, id: 2, titulo: 'Otro libro' }])
    act(() => result.current.refetch())

    await waitFor(() => expect(result.current.data[0].titulo).toBe('Otro libro'))
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
})
