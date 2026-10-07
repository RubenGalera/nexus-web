import { createContext, useContext, useState } from 'react'

// ── Contexto ──────────────────────────────────────────────────────────
const AuthContext = createContext(null)

const BASE_URL = 'https://mock.apidog.com/m1/1265024-1262848-default'

// ── Provider ──────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  // Persistir sesión en sessionStorage para sobrevivir recarga
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('nexus_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Lista de libros comprados (id → objeto libro)
  const [librosComprados, setLibrosComprados] = useState(() => {
    try {
      const stored = sessionStorage.getItem('nexus_comprados')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [loginError, setLoginError]     = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)

  const isAuthenticated = !!user

  // ── LOGIN ─────────────────────────────────────────────────────────
  async function login(usuario, contrasena) {
    setLoginLoading(true)
    setLoginError(null)

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena }),
      })

      // La mock API devuelve 200 para cualquier request válido.
      // Aceptamos el login si la respuesta es ok o si los datos son admin/admin69.
      if (res.ok) {
        const userData = { usuario, nombre: usuario }
        _guardarUsuario(userData)
        setLoginLoading(false)
        return { success: true }
      }

      // Fallback local para demo
      if (usuario === 'admin' && contrasena === 'admin69') {
        const userData = { usuario: 'admin', nombre: 'Administrador' }
        _guardarUsuario(userData)
        setLoginLoading(false)
        return { success: true }
      }

      setLoginError('Usuario o contraseña incorrectos.')
      setLoginLoading(false)
      return { success: false }

    } catch {
      // Sin conexión → aceptar admin/admin69 para poder seguir
      if (usuario === 'admin' && contrasena === 'admin') {
        const userData = { usuario: 'admin', nombre: 'Administrador' }
        _guardarUsuario(userData)
        setLoginLoading(false)
        return { success: true }
      }
      setLoginError('Error de conexión. Usa admin / admi69 para continuar.')
      setLoginLoading(false)
      return { success: false }
    }
  }

  function _guardarUsuario(userData) {
    setUser(userData)
    sessionStorage.setItem('nexus_user', JSON.stringify(userData))
  }

  // ── LOGOUT ────────────────────────────────────────────────────────
  function logout() {
    setUser(null)
    sessionStorage.removeItem('nexus_user')
  }

  // ── CARRITO / LIBROS COMPRADOS ────────────────────────────────────
  function comprarLibro(libro) {
    setLibrosComprados(prev => {
      if (prev.find(l => l.id === libro.id)) return prev
      const nueva = [...prev, libro]
      sessionStorage.setItem('nexus_comprados', JSON.stringify(nueva))
      return nueva
    })
  }

  function estaComprado(id) {
    return librosComprados.some(l => l.id === Number(id) || l.id === id)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loginError,
        loginLoading,
        librosComprados,
        comprarLibro,
        estaComprado,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook de consumo ───────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
