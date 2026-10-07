import { useState, useEffect } from 'react'
import Navbar   from '../components/Navbar.jsx'
import Footer   from '../components/Footer.jsx'
import BookCard from '../components/BookCard.jsx'
import { useFetch } from '../hooks/useFetch.js'
import '../styles/catalogo.css'

const BASE_URL  = 'https://mock.apidog.com/m1/1265024-1262848-default'
const POR_PAGINA = 9

const CATEGORIAS = ['Todas', 'Fantasia', 'Aprender', 'Thriller', 'Entretenimiento']
const ANIOS      = ['Todos', '2021', '2022', '2023', '2024']
const TIPOS      = ['Todos', 'libro', 'revista']

export default function Catalog() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [anioActivo,      setAnioActivo]      = useState('Todos')
  const [tipoActivo,      setTipoActivo]      = useState('Todos')
  const [paginaActual,    setPaginaActual]    = useState(1)

  // Construir URL según filtros activos
  function buildUrl() {
    if (categoriaActiva !== 'Todas')
      return `${BASE_URL}/libros?categoria=${encodeURIComponent(categoriaActiva)}`
    if (anioActivo !== 'Todos')
      return `${BASE_URL}/libros?anio_publicacion=${anioActivo}`
    if (tipoActivo !== 'Todos')
      return `${BASE_URL}/libros?tipo=${tipoActivo}`
    return `${BASE_URL}/libros`
  }

  const { data: libros, loading, error } = useFetch(buildUrl())

  // Resetear página al cambiar filtro
  useEffect(() => { setPaginaActual(1) }, [categoriaActiva, anioActivo, tipoActivo])

  function aplicarCategoria(cat) {
    setCategoriaActiva(cat)
    setAnioActivo('Todos')
    setTipoActivo('Todos')
  }
  function aplicarAnio(anio) {
    setAnioActivo(anio)
    setCategoriaActiva('Todas')
    setTipoActivo('Todos')
  }
  function aplicarTipo(tipo) {
    setTipoActivo(tipo)
    setCategoriaActiva('Todas')
    setAnioActivo('Todos')
  }

  const lista        = libros || []
  const totalPaginas = Math.ceil(lista.length / POR_PAGINA)
  const inicio       = (paginaActual - 1) * POR_PAGINA
  const paginados    = lista.slice(inicio, inicio + POR_PAGINA)

  return (
    <>
      <Navbar />

      <header className="page-header">
        <div className="container">
          <p className="page-header_eyebrow">Librería Universitaria</p>
          <h1 className="page-header_title">Catálogo de Libros</h1>
          <p className="page-header_sub">
            Explora nuestra colección de más de 3.000 títulos especializados.
          </p>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="catalogo-layout">

            {/* ── Sidebar de filtros ───────────────────── */}
            <aside className="catalogo-sidebar">

              <div className="filtro-grupo">
                <p className="filtro-titulo">Categorías</p>
                <ul className="filtro-lista">
                  {CATEGORIAS.map(cat => (
                    <li key={cat}>
                      <button
                        className={`filtro-btn ${categoriaActiva === cat ? 'activo' : ''}`}
                        onClick={() => aplicarCategoria(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filtro-grupo">
                <p className="filtro-titulo">Año de publicación</p>
                <ul className="filtro-lista">
                  {ANIOS.map(a => (
                    <li key={a}>
                      <button
                        className={`filtro-btn ${anioActivo === a ? 'activo' : ''}`}
                        onClick={() => aplicarAnio(a)}
                      >
                        {a}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filtro-grupo">
                <p className="filtro-titulo">Tipo</p>
                <ul className="filtro-lista">
                  {TIPOS.map(t => (
                    <li key={t}>
                      <button
                        className={`filtro-btn ${tipoActivo === t ? 'activo' : ''}`}
                        onClick={() => aplicarTipo(t)}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </aside>

            {/* ── Grid principal ───────────────────────── */}
            <div className="catalogo-content">

              {loading && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <img className="cargando" src="/img/cargando.gif" alt="Cargando..." />
                </div>
              )}

              {error && (
                <div className="estado-vacio">
                  <span className="estado-vacio_icono">⚠️</span>
                  <p className="estado-vacio_titulo">Error al cargar el catálogo</p>
                  <p className="estado-vacio_desc">Revisa tu conexión e inténtalo de nuevo.</p>
                </div>
              )}

              {!loading && !error && lista.length === 0 && (
                <div className="estado-vacio">
                  <span className="estado-vacio_icono">📭</span>
                  <p className="estado-vacio_titulo">Sin resultados</p>
                  <p className="estado-vacio_desc">No hay libros para este filtro.</p>
                </div>
              )}

              {!loading && paginados.length > 0 && (
                <>
                  <div className="catalogo-toolbar">
                    <p className="catalogo-toolbar_count">
                      <strong>{lista.length}</strong> título{lista.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="catalogo-grid">
                    {paginados.map(libro => (
                      <BookCard key={libro.id} libro={libro} />
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPaginas > 1 && (
                    <nav className="paginacion" aria-label="Paginación">
                      {paginaActual > 1 && (
                        <button
                          className="paginacion_btn"
                          onClick={() => { setPaginaActual(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        >‹</button>
                      )}
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          className={`paginacion_btn ${p === paginaActual ? 'active' : ''}`}
                          onClick={() => { setPaginaActual(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        >{p}</button>
                      ))}
                      {paginaActual < totalPaginas && (
                        <button
                          className="paginacion_btn"
                          onClick={() => { setPaginaActual(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        >›</button>
                      )}
                    </nav>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
