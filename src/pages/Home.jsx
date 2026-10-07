import { Link } from 'react-router-dom'
import Navbar   from '../components/Navbar.jsx'
import Footer   from '../components/Footer.jsx'
import BookCard from '../components/BookCard.jsx'
import { useFetch } from '../hooks/useFetch.js'
import '../styles/home.css'

const BASE_URL = 'https://mock.apidog.com/m1/1265024-1262848-default'

export default function Home() {
  const { data: libros, loading, error } = useFetch(`${BASE_URL}/libros`)

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero_bg">
          <div className="hero_grain"></div>
          <div className="hero_glow"></div>
        </div>

        <div className="container hero_inner">
          <div className="hero_content">
            <p className="hero_eyebrow">Campus Universitario</p>
            <h1 className="hero_title">
              Donde el<br />
              <em>conocimiento</em><br />
              cobra vida.
            </h1>
            <p className="hero_subtitle">
              Librería universitaria especializada, espacio de coworking y cafetería.
              Todo lo que necesitas para estudiar, crear y conectar.
            </p>
            <div className="hero_actions">
              <Link to="/catalogo" className="btn btn-primary">Explorar Catálogo</Link>
              <a href="#servicios" className="btn btn-linea">Nuestros Servicios</a>
            </div>
          </div>

          <div className="hero_visual">
            <div className="hero-stack">
              <div className="imagen-hero libros">
                <img src="/img/libreria-nexus-vertical.jpg" alt="Librería" />
              </div>
              <div className="imagen-hero cokorking">
                <img src="/img/coworking-nexus-vertical.jpg" alt="Coworking" />
              </div>
              <div className="imagen-hero cafeteria">
                <img src="/img/cafeteria-nexus-vertical.jpg" alt="Cafetería" />
              </div>
            </div>
            <div className="hero_stats">
              <div className="stat">
                <span className="stat_num">+3.000</span>
                <span className="stat_label">Títulos</span>
              </div>
              <div className="stat">
                <span className="stat_num">12</span>
                <span className="stat_label">Salas</span>
              </div>
              <div className="stat">
                <span className="stat_num">2</span>
                <span className="stat_label">Menús</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero_scroll">
          <a href="#servicios">Descubrir</a>
          <div className="hero_scroll-line"></div>
        </div>
      </section>

      {/* ===== SERVICIOS ===== */}
      <section className="servicios" id="servicios">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">¿Qué ofrecemos?</p>
            <h2 className="section-title">Un espacio diseñado<br />para el aprendizaje</h2>
            <div className="divider"></div>
          </div>

          <div className="servicios_grid">
            <article className="servicio-card">
              <div className="servicio-card_img">
                <img src="/img/libreria-nexus-horizontal.jpg" alt="Librería" />
              </div>
              <h3 className="servicio-card_title">Librería Universitaria</h3>
              <p className="servicio-card_desc">
                Más de 3.000 títulos especializados en derecho, ciencias, humanidades y tecnología.
                Libros de texto, revistas académicas y recursos digitales.
              </p>
              <Link to="/catalogo" className="btn btn-servicio">Ver catálogo →</Link>
            </article>

            <article className="servicio-card servicio-card-highlight">
              <div className="servicio-card_img">
                <img src="/img/coworking-nexus-horizontal.jpg" alt="Coworking" />
              </div>
              <h3 className="servicio-card_title">Coworking & Salas</h3>
              <p className="servicio-card_desc">
                12 salas equipadas para trabajo individual y grupal. Reserva online,
                Wi-Fi de alta velocidad, proyectores y pizarras colaborativas.
              </p>
              <Link to="/coworking" className="btn btn-servicio">Reservar sala →</Link>
            </article>

            <article className="servicio-card">
              <div className="servicio-card_img">
                <img src="/img/cafeteria-nexus-horizontal.jpg" alt="Cafetería" />
              </div>
              <h3 className="servicio-card_title">Cafetería Nexus</h3>
              <p className="servicio-card_desc">
                Desayunos, almuerzos y snacks saludables. El lugar perfecto para
                recargar energía entre sesiones de estudio o reuniones.
              </p>
              <a href="#cafeteria" className="btn btn-servicio">Ver menú →</a>
            </article>
          </div>
        </div>
      </section>

      {/* ===== DESTACADOS ===== */}
      <section className="destacados">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Catálogo</p>
            <h2 className="section-title">Novedades & Destacados</h2>
            <div className="divider"></div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <img className="cargando" src="/img/cargando.gif" alt="Cargando..." />
            </div>
          )}

          {error && (
            <div className="estado-vacio">
              <span className="estado-vacio_icono">⚠️</span>
              <p className="estado-vacio_titulo">Error al cargar libros</p>
              <p className="estado-vacio_desc">{error}</p>
            </div>
          )}

          {libros && (
            <div className="catalogo-grid">
              {libros.slice(0, 9).map(libro => (
                <BookCard key={libro.id} libro={libro} />
              ))}
            </div>
          )}

          <div className="destacados_cta">
            <Link to="/catalogo" className="btn btn-linea">Ver catálogo completo</Link>
          </div>
        </div>
      </section>

      {/* ===== BANNER CTA ===== */}
      <section className="cta-banner">
        <div className="cta-banner_bg"></div>
        <div className="container cta-banner_inner">
          <h2 className="cta-banner_title">Tu próximo gran proyecto<br />empieza aquí.</h2>
          <p className="cta-banner_subtitle">
            Reserva tu sala de coworking y accede al catálogo de recursos que necesitas.
          </p>
          <Link to="/catalogo" className="btn btn-primary">Empezar ahora</Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
