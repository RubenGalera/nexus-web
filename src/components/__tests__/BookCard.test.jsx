import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import BookCard from '../BookCard.jsx'
import { renderConProveedores, libroMock } from '../../test/test-utils.jsx'

describe('BookCard', () => {
  it('muestra el título, autor y precio del libro', () => {
    renderConProveedores(<BookCard libro={libroMock} />)

    expect(screen.getByText('Cálculo Avanzado')).toBeInTheDocument()
    expect(screen.getByText('J. Pérez')).toBeInTheDocument()
    expect(screen.getByText('24.99 €')).toBeInTheDocument()
  })

  it('muestra "General" como categoría por defecto si el libro no tiene categoría', () => {
    const libroSinCategoria = { ...libroMock, categoria: undefined }
    renderConProveedores(<BookCard libro={libroSinCategoria} />)

    expect(screen.getByText('General')).toBeInTheDocument()
  })

  it('el enlace "Ver más" apunta al detalle del libro correcto', () => {
    renderConProveedores(<BookCard libro={libroMock} />)

    const enlace = screen.getByRole('link', { name: 'Ver más' })
    expect(enlace).toHaveAttribute('href', '/catalogo/1')
  })

  it('muestra un guion como precio si el libro no tiene precio', () => {
    const libroSinPrecio = { ...libroMock, precio: null }
    renderConProveedores(<BookCard libro={libroSinPrecio} />)

    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
