// ── Helpers ─────────────────────────────────────────────────────────
export function getEstado(espacio) {
  if (espacio.estado) return espacio.estado.toLowerCase()
  if (espacio.ocupado_por) return 'ocupado'
  return 'libre'
}

export function formatHora(isoString) {
  if (!isoString) return '--:--'
  return isoString.split('T')[1]?.substring(0, 5) ?? '--:--'
}

export function getPrecio(capacidad) {
  if (capacidad <= 2) return '5 €/h'
  if (capacidad <= 4) return '8 €/h'
  if (capacidad <= 6) return '12 €/h'
  if (capacidad <= 8) return '15 €/h'
  return '20 €/h'
}
  
function nombreAClase(nombre) {
  return nombre.toLowerCase().replace(/\s+/g, '-')
}

// ── Componente ───────────────────────────────────────────────────────
export default function SpaceCard({ espacio, onClick }) {
  const estado     = getEstado(espacio)
  const claseExtra = nombreAClase(espacio.nombre)

  const horario =
    estado === 'ocupado'
      ? 'Reservado todo el día'
      : espacio.hora_inicio
        ? `${formatHora(espacio.hora_inicio)} – ${formatHora(espacio.hora_fin)}`
        : 'Disponible'

  return (
    <div
      className={`espacio ${estado} ${claseExtra}`}
      role="button"
      tabIndex={0}
      onClick={() => onClick(espacio)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onClick(espacio)
      }}
    >
      <div className="espacio_inner">
        <span className="espacio_nombre">{espacio.nombre}</span>
        <span className="espacio_desc">{espacio.descripcion}</span>
        <span className="espacio_estado">
          {estado === 'ocupado' ? 'Ocupado' : 'Disponible'}
        </span>
        <span className="espacio_horario">{horario}</span>
      </div>
      <div className="espacio_footer">
        <span className="espacio_capacidad">
          <span className="espacio_capacidad-num">{espacio.capacidad} pax</span>
        </span>
        <span className="espacio_precio">{getPrecio(espacio.capacidad)}</span>
      </div>
    </div>
  )
}
