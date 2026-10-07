import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute.jsx'
import { renderConProveedores } from '../../test/test-utils.jsx'

function PaginaPrivada() {
  return <p>Contenido privado</p>
}
function PaginaLogin() {
  return <p>Página de login</p>
}

describe('ProtectedRoute', () => {
  it('redirige a /login si el usuario no está autenticado', () => {
    renderConProveedores(
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/" element={<ProtectedRoute><PaginaPrivada /></ProtectedRoute>} />
      </Routes>,
      { route: '/' }
    )

    expect(screen.getByText('Página de login')).toBeInTheDocument()
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument()
  })

  it('muestra el contenido protegido si el usuario está autenticado', () => {
    sessionStorage.setItem('nexus_user', JSON.stringify({ usuario: 'admin' }))

    renderConProveedores(
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/" element={<ProtectedRoute><PaginaPrivada /></ProtectedRoute>} />
      </Routes>,
      { route: '/' }
    )

    expect(screen.getByText('Contenido privado')).toBeInTheDocument()
  })
})
