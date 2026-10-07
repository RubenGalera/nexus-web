import { useState }            from 'react'
import { useParams, Link }     from 'react-router-dom'
import Navbar                  from '../components/Navbar.jsx'
import Footer                  from '../components/Footer.jsx'
import { useFetch }            from '../hooks/useFetch.js'
import { useAuth }             from '../context/AuthContext.jsx'
import '../styles/detalle.css'

const BASE_URL = 'https://mock.apidog.com/m1/1265024-1262848-default'

export default function BookDetail() {
  const { id }                               = useParams()
  const { data: libro, loading, error }      = useFetch(`${BASE_URL}/libros/${id}`)
  const { comprarLibro, estaComprado }       = useAuth()
  const [comprado, setComprado]              = useState(false)
  const [reservado, setReservado]            = useState(false)

  const yaComprado = estaComprado(id)

  function handleComprar() {
    if (libro) {
      comprarLibro(libro)
      setComprado(true)
    }
  }

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <ol className="breadcrumb_lista">
            <li className="breadcrumb_item"><Link to="/">Inicio</Link></li>
            <li className="breadcrumb_sep">›</li>
            <li className="breadcrumb_item"><Link to="/catalogo">Catálogo</Link></li>
            <li className="breadcrumb_sep">›</li>
            <li className="breadcrumb_item active">
              {loading ? 'Cargando...' : libro?.titulo || 'Detalle'}
            </li>
          </ol>
        </div>
      </div>

      <main>
        <section className="detalle">
          <div className="container">

            {loading && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <img className="cargando" src="/img/cargando.gif" alt="Cargando..." />
              </div>
            )}

            {error && (
              <div className="estado-vacio">
                <span className="estado-vacio_icono">⚠️</span>
                <p className="estado-vacio_titulo">No se pudo cargar el libro</p>
                <Link to="/catalogo" className="btn btn-linea" style={{ marginTop: '1rem' }}>
                  Volver al catálogo
                </Link>
              </div>
            )}

            {libro && (
              <div className="detalle_layout">

                {/* Columna portada */}
                <div className="detalle_portada-col">
                  <div className="detalle_portada">
                    <img src={`/img/libro${id}.png`} alt={libro.titulo} />
                  </div>
                  <div className="detalle_badges">
                    <span className="badge badge-gold">{libro.categoria || 'General'}</span>
                    <span className="badge badge-muted">{libro.tipo || 'Libro'}</span>
                  </div>
                </div>

                {/* Columna info */}
                <div className="detalle_info-col">
                  <p className="detalle_categoria">{libro.categoria || 'General'}</p>
                  <h1 className="detalle_titulo">{libro.titulo || '—'}</h1>
                  <p className="detalle_autor">{libro.autor || '—'}</p>

                  <div className="detalle_divider"></div>

                  <div className="detalle_meta">
                    {(libro.anio || libro.anio_publicacion) && (
                      <div className="detalle_meta-fila">
                        <span className="detalle_meta-clave">Año</span>
                        <span className="detalle_meta-valor">
                          {libro.anio || libro.anio_publicacion}
                        </span>
                      </div>
                    )}
                    {libro.tipo && (
                      <div className="detalle_meta-fila">
                        <span className="detalle_meta-clave">Tipo</span>
                        <span className="detalle_meta-valor">{libro.tipo}</span>
                      </div>
                    )}
                  </div>

                  <div className="detalle_divider"></div>

                  {(libro.descripcion || libro.sinopsis) && (
                    <>
                      <div>
                        <p className="detalle_sinopsis-titulo">SINOPSIS</p>
                        <p className="detalle_sinopsis-texto">
                          {libro.descripcion || libro.sinopsis}
                        </p>
                      </div>
                      <div className="detalle_divider"></div>
                    </>
                  )}

                  {/* Bloque de compra */}
                  <div className="detalle_compra">
                    <div>
                      <p className="detalle_precio-label">Precio</p>
                      <p className="detalle_precio">
                        {libro.precio ? `${libro.precio} €` : 'Consultar'}
                      </p>
                    </div>

                    <div className="detalle_disponibilidad">
                      <span className="dot dot-green"></span>
                      <span>Disponible en tienda</span>
                    </div>

                    <div className="detalle_acciones">
                      {yaComprado || comprado ? (
                        <span className="btn btn-primary" style={{ opacity: 0.7, cursor: 'default' }}>
                          ✓ Comprado
                        </span>
                      ) : (
                        <button className="btn btn-primary" onClick={handleComprar}>
                          Comprar
                        </button>
                      )}
                      <button
                        className="btn btn-linea"
                        onClick={() => setReservado(true)}
                        disabled={reservado}
                        style={{ opacity: reservado ? 0.7 : 1 }}
                      >
                        {reservado ? '✓ Reservado' : 'Reservar'}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <Link to="/catalogo" className="btn btn-ghost">← Volver al catálogo</Link>
                  </div>
                </div>

              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
