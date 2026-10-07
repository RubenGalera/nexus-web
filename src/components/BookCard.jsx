import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function BookCard({ libro }) {
  const { estaComprado, comprarLibro } = useAuth()
  const comprado = estaComprado(libro.id)

  return (
    <article className="card-libro">
      <div className="card-libro_imagen">
        <img src={`/img/libro${libro.id}.png`} alt={libro.titulo} />
      </div>
      <div className="card-libro_body">
        <span className="card-libro_categoria">{libro.categoria || 'General'}</span>
        <h3 className="card-libro_titulo">{libro.titulo || '—'}</h3>
        <p className="card-libro_autor">{libro.autor || '—'}</p>
        <div className="card-libro_footer">
          <span className="card-libro_precio">
            {libro.precio ? `${libro.precio} €` : '—'}
          </span>
          <Link to={`/catalogo/${libro.id}`} className="card-libro_cta">
            Ver más
          </Link>
        </div>
      </div>
    </article>
  )
}
