import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import Footer from '../Footer.jsx'
import { renderConProveedores } from '../../test/test-utils.jsx'

describe('Footer', () => {
  it('muestra el logo Nexus', () => {
    renderConProveedores(<Footer />)
    expect(screen.getByText(/NEX/)).toBeInTheDocument()
  })

  it('muestra el aviso de copyright', () => {
    renderConProveedores(<Footer />)
    expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument()
  })

  it('el enlace "Catálogo completo" apunta a /catalogo', () => {
    renderConProveedores(<Footer />)
    const enlace = screen.getByRole('link', { name: 'Catálogo completo' })
    expect(enlace).toHaveAttribute('href', '/catalogo')
  })

  it('el enlace "Coworking" apunta a /coworking', () => {
    renderConProveedores(<Footer />)
    const enlace = screen.getByRole('link', { name: 'Coworking' })
    expect(enlace).toHaveAttribute('href', '/coworking')
  })

  it('muestra los tres iconos sociales', () => {
    renderConProveedores(<Footer />)
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument()
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument()
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
  })
})
