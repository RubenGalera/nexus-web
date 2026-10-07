import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import SpaceCard, { getEstado, getPrecio, formatHora } from '../SpaceCard.jsx'
import { renderConProveedores, espacioLibreMock, espacioOcupadoMock } from '../../test/test-utils.jsx'

describe('SpaceCard', () => {
  it('muestra el nombre y la descripción del espacio', () => {
    renderConProveedores(<SpaceCard espacio={espacioLibreMock} onClick={() => {}} />)

    expect(screen.getByText('Sala Curie')).toBeInTheDocument()
    expect(screen.getByText('Sala de reuniones con proyector')).toBeInTheDocument()
  })

  it('muestra "Disponible" cuando el espacio está libre', () => {
    renderConProveedores(<SpaceCard espacio={espacioLibreMock} onClick={() => {}} />)
    expect(screen.getByText('Disponible')).toBeInTheDocument()
  })

  it('muestra "Ocupado" cuando el espacio está ocupado', () => {
    renderConProveedores(<SpaceCard espacio={espacioOcupadoMock} onClick={() => {}} />)
    expect(screen.getByText('Ocupado')).toBeInTheDocument()
  })

  it('llama a onClick con el espacio al hacer click', () => {
    const handleClick = vi.fn()
    renderConProveedores(<SpaceCard espacio={espacioLibreMock} onClick={handleClick} />)

    fireEvent.click(screen.getByText('Sala Curie'))
    expect(handleClick).toHaveBeenCalledWith(espacioLibreMock)
  })

  it('llama a onClick al pulsar Enter sobre la tarjeta (accesibilidad teclado)', () => {
    const handleClick = vi.fn()
    renderConProveedores(<SpaceCard espacio={espacioLibreMock} onClick={handleClick} />)

    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledWith(espacioLibreMock)
  })
})

describe('SpaceCard — funciones auxiliares', () => {
  it('getEstado devuelve "ocupado" si el espacio tiene ocupado_por', () => {
    expect(getEstado({ ocupado_por: 'Marta' })).toBe('ocupado')
  })

  it('getEstado devuelve "libre" por defecto', () => {
    expect(getEstado({})).toBe('libre')
  })

  it('getPrecio escala según la capacidad del espacio', () => {
    expect(getPrecio(2)).toBe('5 €/h')
    expect(getPrecio(6)).toBe('12 €/h')
    expect(getPrecio(10)).toBe('20 €/h')
  })

  it('formatHora extrae HH:MM de un ISO string', () => {
    expect(formatHora('2025-01-01T09:30:00')).toBe('09:30')
  })

  it('formatHora devuelve "--:--" si no recibe fecha', () => {
    expect(formatHora(null)).toBe('--:--')
  })
})
