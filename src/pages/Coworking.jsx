import { useState }  from 'react'
import Navbar         from '../components/Navbar.jsx'
import Footer         from '../components/Footer.jsx'
import SpaceCard      from '../components/SpaceCard.jsx'
import SpaceModal     from '../components/SpaceModal.jsx'
import { useFetch }   from '../hooks/useFetch.js'
import '../styles/coworking.css'

const BASE_URL = 'https://mock.apidog.com/m1/1265024-1262848-default'

// ── Datos estáticos del gimnasio ─────────────────────────────────────
const DIAS_SEM   = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']
const FRANJAS    = ['09:00','10:00','11:00','12:00','16:00','17:00','18:00','19:00']
const ACTIVIDADES = [
  { nombre: 'Spinning',  tipo: 'act-spinning',  sala: 'Sala A',  plazas: 15 },
  { nombre: 'Yoga',      tipo: 'act-yoga',      sala: 'Sala B',  plazas: 20 },
  { nombre: 'Crossfit',  tipo: 'act-crossfit',  sala: 'Sala C',  plazas: 12 },
  { nombre: 'Pilates',   tipo: 'act-pilates',   sala: 'Sala B',  plazas: 18 },
  { nombre: 'Zumba',     tipo: 'act-zumba',     sala: 'Sala A',  plazas: 25 },
  { nombre: 'Natación',  tipo: 'act-natacion',  sala: 'Piscina', plazas: 10 },
]
const HORARIO = {
  0: { 0: 0, 2: 2, 4: 1, 6: 4 },
  1: { 1: 1, 3: 3, 5: 0, 7: 2 },
  2: { 0: 4, 2: 0, 4: 3, 6: 1 },
  3: { 1: 2, 3: 1, 5: 5, 7: 0 },
  4: { 0: 1, 2: 3, 4: 2, 6: 4 },
}

function fechaHoy() {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ── Modal de actividad del gimnasio ──────────────────────────────────
function ActividadModal({ actividad, hora, onClose }) {
  const [inscrito, setInscrito] = useState(false)
  return (
    <div
      className="popup-overlay visible"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="popup">
        <div className="popup_header">
          <h2 className="popup_titulo">{actividad.nombre}</h2>
          <button className="popup_cerrar" onClick={onClose}>✕</button>
        </div>
        <span className="popup_estado libre">Plazas disponibles</span>
        <div className="popup_info">
          <div className="popup_fila">
            <span className="popup_clave">Hora</span>
            <span className="popup_valor">{hora}h</span>
          </div>
          <div className="popup_fila">
            <span className="popup_clave">Sala</span>
            <span className="popup_valor">{actividad.sala}</span>
          </div>
          <div className="popup_fila">
            <span className="popup_clave">Plazas</span>
            <span className="popup_valor">{actividad.plazas} disponibles</span>
          </div>
        </div>
        {inscrito && (
          <div className="popup_confirmado">
            <span>✅</span>
            <p className="popup_confirmado-titulo">¡Inscripción realizada!</p>
            <p className="popup_confirmado-desc">{actividad.nombre} a las {hora}h</p>
          </div>
        )}
        <div className="popup_acciones">
          {!inscrito && (
            <button className="btn btn-primary" onClick={() => setInscrito(true)}>
              Inscribirse
            </button>
          )}
          <button className="btn btn-linea" onClick={onClose}>
            {inscrito ? 'Cerrar' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────
export default function Coworking() {
  const { data: espacios, loading, error } = useFetch(`${BASE_URL}/espacios`)
  const [espacioActivo, setEspacioActivo]  = useState(null)
  const [actividadActiva, setActividadActiva] = useState(null)

  const diaHoy = new Date().getDay() - 1  // 0=lun

  const salas = espacios ? espacios.filter(e => e.nombre?.toLowerCase().includes('sala')) : []
  const mesas = espacios ? espacios.filter(e => e.nombre?.toLowerCase().includes('mesa')) : []

  const paraMesas = mesas.length ? mesas : (espacios ? espacios.slice(0, Math.ceil(espacios.length / 2)) : [])
  const paraSalas = salas.length ? salas : (espacios ? espacios.slice(Math.ceil(espacios.length / 2)) : [])

  return (
    <>
      <Navbar />

      <header className="page-header">
        <div className="container">
          <p className="page-header_eyebrow">Plano de espacios</p>
          <h1 className="page-header_title">Coworking Nexus</h1>
          <p className="page-header_sub">
            Consulta la disponibilidad en tiempo real y reserva tu espacio.
            Haz clic sobre cualquier sala o mesa para ver los detalles.
          </p>
        </div>
      </header>

      <main>
        <div className="container plano-wrapper">
          <div className="plano" id="plano">

            {/* Entrada */}
            <div className="zona zona-entrada">
              <span className="zona-entrada-label">COWORKING NEXUS</span>
              <span className="fecha_hoy">DISPONIBILIDAD:</span>
              <span className="fecha_hoy">{fechaHoy()}</span>
            </div>

            {/* Zona silenciosa */}
            <div className="zona zona-silencio">
              <span className="zona-label">Zona de silencio</span>
              {loading && <div className="plano-cargando"><img src="/img/cargando.gif" alt="Cargando" /></div>}
              {paraMesas[0] && (
                <SpaceCard espacio={paraMesas[0]} onClick={setEspacioActivo} />
              )}
            </div>

            {/* Sala principal */}
            <div className="zona zona-sala-grande">
              <span className="zona-label">Sala principal</span>
              {loading && <div className="plano-cargando"><img src="/img/cargando.gif" alt="Cargando" /></div>}
              {paraSalas[0] && (
                <SpaceCard espacio={paraSalas[0]} onClick={setEspacioActivo} />
              )}
            </div>

            {/* Mesas individuales */}
            <div className="zona zona-mesas">
              <span className="zona-label">Mesas individuales</span>
              <div className="mesas-grid">
                {loading && <div className="plano-cargando"><img src="/img/cargando.gif" alt="Cargando" /></div>}
                {paraMesas.slice(1).map(e => (
                  <SpaceCard key={e.id} espacio={e} onClick={setEspacioActivo} />
                ))}
              </div>
            </div>

            {/* Salas de reunión */}
            <div className="zona zona-salas-reunion">
              <span className="zona-label">Salas de reuniones</span>
              <div className="salas-grid">
                {loading && <div className="plano-cargando"><img src="/img/cargando.gif" alt="Cargando" /></div>}
                {paraSalas.slice(1).map(e => (
                  <SpaceCard key={e.id} espacio={e} onClick={setEspacioActivo} />
                ))}
              </div>
            </div>

            {/* Gimnasio */}
            <div className="zona zona-gimnasio">
              <div className="zona-gimnasio-titulo">
                <span className="zona-label">Actividades del Gimnasio &nbsp;</span>
                <span className="fecha_hoy">{fechaHoy()}</span>
              </div>
              <div className="zona-gimnasio-imagen"></div>
              <div className="gimnasio-calendario">
                {/* Esquina vacía */}
                <div></div>
                {/* Cabeceras */}
                {DIAS_SEM.map((dia, i) => (
                  <div key={dia} className={`gcal-dia-header ${i === diaHoy ? 'hoy' : ''}`}>
                    {dia}
                  </div>
                ))}
                {/* Filas */}
                {FRANJAS.map((hora, fi) => (
                  <>
                    <div key={`h${fi}`} className="gcal-hora">{hora}</div>
                    {DIAS_SEM.map((_, di) => {
                      const actIdx = HORARIO[di]?.[fi]
                      if (actIdx !== undefined) {
                        const act = ACTIVIDADES[actIdx]
                        return (
                          <div
                            key={`${di}-${fi}`}
                            className={`gcal-actividad ${act.tipo}`}
                            onClick={() => setActividadActiva({ act, hora })}
                          >
                            <span className="gcal-actividad_nombre">{act.nombre}</span>
                            <span className="gcal-actividad_info">{act.sala}</span>
                            <span className="gcal-actividad_info">{act.plazas} plazas</span>
                          </div>
                        )
                      }
                      return <div key={`${di}-${fi}`} className="gcal-vacio"></div>
                    })}
                  </>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</p>
                <p>No se pudo cargar el plano. Revisa tu conexión.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modales */}
      {espacioActivo && (
        <SpaceModal espacio={espacioActivo} onClose={() => setEspacioActivo(null)} />
      )}
      {actividadActiva && (
        <ActividadModal
          actividad={actividadActiva.act}
          hora={actividadActiva.hora}
          onClose={() => setActividadActiva(null)}
        />
      )}

      <Footer />
    </>
  )
}
