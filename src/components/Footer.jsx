import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer" id="contacto">
      <div className="container">
        <div className="footer_grid">

          <div className="footer_col">
            <p className="footer_logo">NEX<span>U</span>S</p>
            <p className="footer_desc">
              Librería universitaria, coworking y cafetería,
              junto al campus universitario.
            </p>
          </div>

          <div className="footer_col">
            <p className="footer_heading">Librería</p>
            <ul className="footer_links">
              <li><Link to="/catalogo" className="footer_link">Catálogo completo</Link></li>
              <li><Link to="/mis-libros" className="footer_link">Mis libros</Link></li>
              <li><a href="#" className="footer_link">Novedades</a></li>
              <li><a href="#" className="footer_link">Recursos digitales</a></li>
            </ul>
          </div>

          <div className="footer_col">
            <p className="footer_heading">Servicios</p>
            <ul className="footer_links">
              <li><Link to="/coworking" className="footer_link">Coworking</Link></li>
              <li><a href="#" className="footer_link">Salas de reunión</a></li>
              <li><a href="#" className="footer_link">Cafetería</a></li>
              <li><a href="#" className="footer_link">Eventos</a></li>
            </ul>
          </div>

          <div className="footer_col">
            <p className="footer_heading">Contacto</p>
            <ul className="footer_links">
              <li><a href="mailto:info@nexus.es" className="footer_link">info@nexus.es</a></li>
              <li><a href="tel:+34654000000" className="footer_link">+34 654 000 000</a></li>
              <li><span className="footer_link">C/ Universidad, 1</span></li>
            </ul>
            <div className="footer_social">
              <a href="#" className="footer_social-link" aria-label="Instagram">IG</a>
              <a href="#" className="footer_social-link" aria-label="Facebook">FB</a>
              <a href="#" className="footer_social-link" aria-label="LinkedIn">LI</a>
            </div>
          </div>

        </div>

        <div className="footer_bottom">
          <p className="footer_copy">© 2025 Nexus Grupo 4. Todos los derechos reservados.</p>
          <nav className="footer_legal">
            <a href="#">Aviso legal</a>
            <a href="#">Privacidad</a>
            <a href="#">Cookies</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
