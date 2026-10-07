import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user, logout, librosComprados } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function cerrarMenu() {
    setMenuOpen(false)
  }

  const linkClass = ({ isActive }) => `nav_link${isActive ? ' activo' : ''}`

  return (
    <nav className="nav">
      <div className="container nav_inner">
        <Link to="/" className="nav_logo" onClick={cerrarMenu}>
          NEX<span>U</span>S
        </Link>

        <button
          className={`nav_toggle ${menuOpen ? 'activo' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav_menu ${menuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/" className={linkClass} end onClick={cerrarMenu}>
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink to="/catalogo" className={linkClass} onClick={cerrarMenu}>
                  Catálogo
                </NavLink>
              </li>
              <li>
                <NavLink to="/coworking" className={linkClass} onClick={cerrarMenu}>
                  Coworking
                </NavLink>
              </li>
              <li>
                <NavLink to="/mis-libros" className={linkClass} onClick={cerrarMenu}>
                  Mis libros {librosComprados.length > 0 && `(${librosComprados.length})`}
                </NavLink>
              </li>
              <li>
                <NavLink to="/compra" className="nav_link carrito" onClick={cerrarMenu}>
                  <img src="/img/carrito.png" alt="Carrito" />
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="nav_link nav_logout"
                >
                  Salir · {user?.usuario}
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" className={linkClass} onClick={cerrarMenu}>
                Acceder
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
