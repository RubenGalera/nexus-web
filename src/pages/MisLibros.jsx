import { Link }    from 'react-router-dom'
import Navbar       from '../components/Navbar.jsx'
import Footer       from '../components/Footer.jsx'
import BookCard     from '../components/BookCard.jsx'
import { useAuth }  from '../context/AuthContext.jsx'

export default function MisLibros() {
  const { librosComprados, user } = useAuth()

  return (
    <>
      <Navbar />

      <header className="page-header">
        <div className="container">
          <p className="page-header_eyebrow">Mi cuenta · {user?.usuario}</p>
          <h1 className="page-header_title">Mis libros</h1>
          <p className="page-header_sub">
            Aquí encontrarás todos los títulos que has adquirido en Nexus.
          </p>
        </div>
      </header>

      <main>
        <div className="container" style={{ padding: '3rem var(--space-6) 6rem' }}>

          {librosComprados.length === 0 ? (
            <div className="estado-vacio">
              <span className="estado-vacio_icono">📚</span>
              <p className="estado-vacio_titulo">Aún no tienes libros</p>
              <p className="estado-vacio_desc">
                Cuando compres un título aparecerá aquí.
              </p>
              <Link to="/catalogo" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <>
              <p className="catalogo-toolbar_count" style={{ marginBottom: '1.5rem' }}>
                <strong>{librosComprados.length}</strong> título{librosComprados.length !== 1 ? 's' : ''} adquirido{librosComprados.length !== 1 ? 's' : ''}
              </p>
              <div className="catalogo-grid">
                {librosComprados.map(libro => (
                  <BookCard key={libro.id} libro={libro} />
                ))}
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
