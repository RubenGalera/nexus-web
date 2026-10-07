import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import Navbar from '../Navbar.jsx'
import { renderConProveedores } from '../../test/test-utils.jsx'

// AuthContext lee el usuario inicial desde sessionStorage al montar,
// así que simulamos una sesión ya iniciada antes de renderizar.
function simularSesionIniciada() {
  sessionStorage.setItem('nexus_user', JSON.stringify({ usuario: 'admin', nombre: 'Administrador' }))
}

describe('Navbar — usuario autenticado', () => {
  beforeEach(() => {
    simularSesionIniciada()
  })

  it('muestra los enlaces internos cuando hay sesión activa', () => {
    renderConProveedores(<Navbar />)

    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Catálogo')).toBeInTheDocument()
    expect(screen.getByText('Coworking')).toBeInTheDocument()
  })

  it('muestra el nombre del usuario en el botón de salir', () => {
    renderConProveedores(<Navbar />)
    expect(screen.getByText(/Salir · admin/)).toBeInTheDocument()
  })

  it('no muestra el contador de "Mis libros" si no hay libros comprados', () => {
    renderConProveedores(<Navbar />)
    const enlaceMisLibros = screen.getByText(/Mis libros/)
    expect(enlaceMisLibros.textContent).not.toMatch(/\(\d+\)/)
  })
})
