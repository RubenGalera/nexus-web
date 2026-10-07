import { useState, useEffect } from 'react'
import { getEstado, formatHora } from './SpaceCard'

const BASE_URL = 'https://mock.apidog.com/m1/1265024-1262848-default'

const MESES      = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS_NOMBRE = ['Lu','Ma','Mi','Ju','Vi','Sá','Do']
const SLOTS_HORA  = ['09:00','10:00','11:00','12:00','13:00',
                     '15:00','16:00','17:00','18:00','19:00']

export default function SpaceModal({ espacio, onClose }) {
  const [calMes,          setCalMes]          = useState(new Date().getMonth())
  const [calAnio,         setCalAnio]         = useState(new Date().getFullYear())
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [slotSeleccionado,setSlotSeleccionado]= useState(null)
  const [confirmado,      setConfirmado]      = useState(false)
  const [cargando,        setCargando]        = useState(false)

  const estado        = getEstado(espacio)
  const puedeReservar = !!diaSeleccionado && !!slotSeleccionado && !cargando

  // Bloquear scroll y cerrar con Escape
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // ── Navegación del calendario ─────────────────────────────────────
  function prevMes() {
    setDiaSeleccionado(null); setSlotSeleccionado(null)
    if (calMes === 0) { setCalMes(11); setCalAnio(y => y - 1) }
    else setCalMes(m => m - 1)
  }
  function nextMes() {
    setDiaSeleccionado(null); setSlotSeleccionado(null)
    if (calMes === 11) { setCalMes(0); setCalAnio(y => y + 1) }
    else setCalMes(m => m + 1)
  }

  // ── Confirmar reserva ─────────────────────────────────────────────
  async function confirmarReserva() {
    setCargando(true)
    try {
      await fetch(`${BASE_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          espacio_id: espacio.id,
          espacio:    espacio.nombre,
          dia:        diaSeleccionado,
          mes:        calMes + 1,
          anio:       calAnio,
          hora:       slotSeleccionado,
        }),
      })
    } catch { /* La mock API puede fallar — ignoramos el error */ }
    setConfirmado(true)
    setCargando(false)
  }

  // ── Generar días del mes ──────────────────────────────────────────
  const hoy        = new Date()
  const primerDia  = new Date(calAnio, calMes, 1)
  const totalDias  = new Date(calAnio, calMes + 1, 0).getDate()
  let offset       = primerDia.getDay() - 1
  if (offset < 0) offset = 6

  const celdas = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ]

  // Slots con disponibilidad pseudo-aleatoria por día
  const slots = SLOTS_HORA.map((h, i) => ({
    hora:   h,
    ocupado: diaSeleccionado ? ((diaSeleccionado * 7 + i * 3) % 10 < 3) : false,
  }))

  return (
    <div
      className="popup-overlay visible"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="popup">

        {/* Cabecera */}
        <div className="popup_header">
          <h2 className="popup_titulo">{espacio.nombre}</h2>
          <button className="popup_cerrar" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Estado */}
        <span className={`popup_estado ${estado}`}>
          {estado === 'ocupado' ? 'Ocupado' : 'Disponible'}
        </span>

        {/* Info */}
        <div className="popup_info">
          <div className="popup_fila">
            <span className="popup_clave">Capacidad</span>
            <span className="popup_valor">
              {espacio.capacidad ? `${espacio.capacidad} pax` : 'N/A'}
            </span>
          </div>
          <div className="popup_fila">
            <span className="popup_clave">Horario</span>
            <span className="popup_valor">
              {estado === 'ocupado'
                ? 'Reservado todo el día'
                : espacio.hora_inicio
                  ? `${formatHora(espacio.hora_inicio)} – ${formatHora(espacio.hora_fin)}`
                  : 'Disponible todo el día'}
            </span>
          </div>
          {espacio.ocupado_por && (
            <div className="popup_fila">
              <span className="popup_clave">Reservado por</span>
              <span className="popup_valor">{espacio.ocupado_por}</span>
            </div>
          )}
        </div>

        {/* Calendario — solo si está libre y no confirmado */}
        {estado === 'libre' && !confirmado && (
          <div className="calendario">
            <div className="calendario_header">
              <button className="calendario_nav" onClick={prevMes}>‹</button>
              <span className="calendario_mes">{MESES[calMes]} {calAnio}</span>
              <button className="calendario_nav" onClick={nextMes}>›</button>
            </div>

            <div className="calendario_grid">
              {DIAS_NOMBRE.map(d => (
                <div key={d} className="calendario_dia-nombre">{d}</div>
              ))}
              {celdas.map((d, i) => {
                if (!d) return <div key={`e${i}`} className="calendario_dia" />
                const fecha    = new Date(calAnio, calMes, d)
                const pasado   = fecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
                const esHoy    = fecha.toDateString() === hoy.toDateString()
                const selec    = diaSeleccionado === d
                const clases   = [
                  'calendario_dia',
                  pasado ? 'pasado' : 'disponible',
                  esHoy  ? 'hoy' : '',
                  selec  ? 'seleccionado' : '',
                ].filter(Boolean).join(' ')

                return (
                  <div
                    key={d}
                    className={clases}
                    onClick={() => !pasado && setDiaSeleccionado(d)}
                  >
                    {d}
                  </div>
                )
              })}
            </div>

            {/* Slots de hora */}
            {diaSeleccionado && (
              <div className="slots">
                <span className="slots_titulo">Hora de inicio</span>
                <div className="slots_grid">
                  {slots.map(({ hora, ocupado }) => {
                    const selec = slotSeleccionado === hora
                    const cls   = ['slot',
                      ocupado ? 'ocupado' : selec ? 'seleccionado' : 'libre',
                    ].join(' ')
                    return (
                      <div
                        key={hora}
                        className={cls}
                        onClick={() => !ocupado && setSlotSeleccionado(hora)}
                      >
                        {hora}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmación */}
        {confirmado && (
          <div className="popup_confirmado">
            <span>✅</span>
            <p className="popup_confirmado-titulo">¡Reserva confirmada!</p>
            <p className="popup_confirmado-desc">
              {espacio.nombre} · {diaSeleccionado} de {MESES[calMes]} de {calAnio} · {slotSeleccionado}h
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="popup_acciones">
          {estado === 'libre' && !confirmado && (
            <button
              className="btn btn-primary"
              onClick={confirmarReserva}
              disabled={!puedeReservar}
              style={{ opacity: puedeReservar ? 1 : 0.4 }}
            >
              {cargando ? 'Procesando...' : 'Confirmar reserva'}
            </button>
          )}
          <button className="btn btn-linea" onClick={onClose}>
            {confirmado ? 'Cerrar' : 'Cancelar'}
          </button>
        </div>

      </div>
    </div>
  )
}
