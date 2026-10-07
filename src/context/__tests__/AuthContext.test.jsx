import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext.jsx'
import { libroMock } from '../../test/test-utils.jsx'

// Componente de prueba que expone el contexto en pantalla
function ConsumidorDePrueba() {
  const { isAuthenticated, user, login, logout, comprarLibro, estaComprado, librosComprados } = useAuth()

  return (
    <div>
      <p data-testid="estado">{isAuthenticated ? 'autenticado' : 'invitado'}</p>
      <p data-testid="usuario">{user?.usuario ?? 'ninguno'}</p>
      <p data-testid="comprados">{librosComprados.length}</p>
      <p data-testid="esta-comprado">{estaComprado(libroMock.id) ? 'sí' : 'no'}</p>
      {/* Sin conexión, el fallback del catch acepta admin/admin (no admin69) */}
      <button onClick={() => login('admin', 'admin')}>Entrar</button>
      <button onClick={logout}>Salir</button>
      <button onClick={() => comprarLibro(libroMock)}>Comprar</button>
    </div>
  )
}

function renderConAuth(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>)
}

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('empieza como invitado si no hay sesión guardada', () => {
    renderConAuth(<ConsumidorDePrueba />)
    expect(screen.getByTestId('estado').textContent).toBe('invitado')
  })

  it('inicia sesión por el fallback local cuando la API no responde', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))
    renderConAuth(<ConsumidorDePrueba />)

    fireEvent.click(screen.getByText('Entrar'))

    await waitFor(() => {
      expect(screen.getByTestId('estado').textContent).toBe('autenticado')
    })
    expect(screen.getByTestId('usuario').textContent).toBe('admin')
  })

  it('cierra sesión correctamente con logout()', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))
    renderConAuth(<ConsumidorDePrueba />)

    fireEvent.click(screen.getByText('Entrar'))
    await waitFor(() => expect(screen.getByTestId('estado').textContent).toBe('autenticado'))

    fireEvent.click(screen.getByText('Salir'))
    expect(screen.getByTestId('estado').textContent).toBe('invitado')
  })

  it('comprarLibro añade el libro a la lista y estaComprado lo detecta', () => {
    renderConAuth(<ConsumidorDePrueba />)

    expect(screen.getByTestId('esta-comprado').textContent).toBe('no')
    fireEvent.click(screen.getByText('Comprar'))

    expect(screen.getByTestId('comprados').textContent).toBe('1')
    expect(screen.getByTestId('esta-comprado').textContent).toBe('sí')
  })

  it('comprar el mismo libro dos veces no lo duplica en la lista', () => {
    renderConAuth(<ConsumidorDePrueba />)

    fireEvent.click(screen.getByText('Comprar'))
    fireEvent.click(screen.getByText('Comprar'))

    expect(screen.getByTestId('comprados').textContent).toBe('1')
  })
})
