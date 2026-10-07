import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../Login.jsx'
import { renderConProveedores } from '../../test/test-utils.jsx'

describe('Login (página)', () => {
  beforeEach(() => {
    sessionStorage.clear()
    global.fetch.mockReset()
  })

  it('muestra el formulario con los campos usuario y contraseña', () => {
    renderConProveedores(<Login />, { route: '/login' })

    expect(screen.getByLabelText('Usuario')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
  })

  it('el botón de entrar está deshabilitado si los campos están vacíos', () => {
    renderConProveedores(<Login />, { route: '/login' })

    const boton = screen.getByRole('button', { name: /Entrar/ })
    expect(boton).toBeDisabled()
  })

  it('el botón se habilita al rellenar usuario y contraseña', () => {
    renderConProveedores(<Login />, { route: '/login' })

    fireEvent.change(screen.getByLabelText('Usuario'), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'admin' } })

    const boton = screen.getByRole('button', { name: /Entrar/ })
    expect(boton).not.toBeDisabled()
  })

  it('muestra un mensaje de error con credenciales incorrectas', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 401, statusText: 'Unauthorized' })

    renderConProveedores(<Login />, { route: '/login' })

    fireEvent.change(screen.getByLabelText('Usuario'), { target: { value: 'invitado' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'incorrecta' } })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/ }))

    await waitFor(() => {
      expect(screen.getByText(/Usuario o contraseña incorrectos/)).toBeInTheDocument()
    })
  })
})
