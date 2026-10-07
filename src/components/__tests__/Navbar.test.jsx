import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import Navbar from '../Navbar.jsx'
import { renderConProveedores } from '../../test/test-utils.jsx'

describe('Navbar', () => {
  it('muestra el enlace "Acceder" cuando el usuario no está autenticado', () => {
    renderConProveedores(<Navbar />)
    expect(screen.getByText('Acceder')).toBeInTheDocument()
  })

  it('no muestra los enlaces internos (Catálogo, Coworking) si no hay sesión', () => {
    renderConProveedores(<Navbar />)
    expect(screen.queryByText('Catálogo')).not.toBeInTheDocument()
    expect(screen.queryByText('Coworking')).not.toBeInTheDocument()
  })

  it('el menú móvil se abre y cierra al pulsar el botón hamburguesa', () => {
    renderConProveedores(<Navbar />)

    const toggle = screen.getByLabelText('Abrir menú')
    expect(toggle).not.toHaveClass('activo')

    fireEvent.click(toggle)
    expect(toggle).toHaveClass('activo')

    fireEvent.click(toggle)
    expect(toggle).not.toHaveClass('activo')
  })

  it('el logo Nexus enlaza con la página de inicio', () => {
    renderConProveedores(<Navbar />)
    const logo = screen.getByText(/NEX/).closest('a')
    expect(logo).toHaveAttribute('href', '/')
  })
})
