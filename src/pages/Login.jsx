import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/login.css'

export default function Login() {
  const [usuario,   setUsuario]   = useState('')
  const [contrasena,setContrasena]= useState('')

  const { login, loginError, loginLoading, isAuthenticated } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  // Si ya está autenticado, redirigir
  const destino = location.state?.from?.pathname || '/'
  useEffect(() => {
    if (isAuthenticated) navigate(destino, { replace: true })
  }, [isAuthenticated, navigate, destino])

  async function handleSubmit(e) {
    e.preventDefault()
    const result = await login(usuario, contrasena)
    if (result.success) navigate(destino, { replace: true })
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <p className="login-logo">NEX<span>U</span>S</p>
        <p className="login-eyebrow">Acceso al sistema</p>
        <h1 className="login-titulo">Bienvenido</h1>
        <p className="login-sub">
          Introduce tus credenciales para acceder a la librería y al coworking.
        </p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>

          <div className="login-campo">
            <label className="login-label" htmlFor="usuario">Usuario</label>
            <input
              className="login-input"
              id="usuario"
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-campo">
            <label className="login-label" htmlFor="contrasena">Contraseña</label>
            <input
              className="login-input"
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {loginError && (
            <p className="login-error">⚠ {loginError}</p>
          )}

          <p className="login-hint">
            Credenciales de demo: <strong>admin / admin69</strong>
          </p>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loginLoading || !usuario || !contrasena}
          >
            {loginLoading ? 'Verificando...' : 'Entrar →'}
          </button>

        </form>
      </div>

      {/* Decoración visual */}
      <div className="login-bg">
        <div className="login-bg-glow"></div>
      </div>
    </div>
  )
}
