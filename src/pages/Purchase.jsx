import { useState } from 'react'
import { Link }      from 'react-router-dom'
import Navbar        from '../components/Navbar.jsx'
import Footer        from '../components/Footer.jsx'
import { useAuth }   from '../context/AuthContext.jsx'
import '../styles/formulario.css'

const PASOS = ['Datos personales', 'Envío', 'Pago']

export default function Purchase() {
  const { librosComprados } = useAuth()
  const [pasoActual, setPasoActual] = useState(1)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false)

  // Campos del formulario
  const [form, setForm] = useState({
    nombre: '', apellidos: '', email: '', telefono: '', estudiante: '',
    direccion: '', ciudad: '', cp: '', provincia: '',
    titular: '', tarjeta: '', caducidad: '', cvv: '',
  })
  const [errores, setErrores] = useState({})

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
    setErrores(e => ({ ...e, [campo]: false }))
  }

  function validarPaso1() {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = true
    if (!form.apellidos.trim()) e.apellidos = true
    if (!form.email.includes('@')) e.email  = true
    setErrores(e)
    return Object.keys(e).length === 0
  }

  function validarPaso2() {
    const e = {}
    if (!form.direccion.trim()) e.direccion = true
    if (!form.ciudad.trim())    e.ciudad    = true
    if (!form.cp.trim())        e.cp        = true
    setErrores(e)
    return Object.keys(e).length === 0
  }

  function validarPaso3() {
    const e = {}
    if (!form.titular.trim())    e.titular    = true
    if (form.tarjeta.replace(/\s/g,'').length < 16) e.tarjeta = true
    if (!form.caducidad.trim())  e.caducidad  = true
    if (form.cvv.length < 3)     e.cvv        = true
    setErrores(e)
    return Object.keys(e).length === 0
  }

  function siguiente() {
    const ok = pasoActual === 1 ? validarPaso1()
             : pasoActual === 2 ? validarPaso2()
             : validarPaso3()
    if (!ok) return
    if (pasoActual < 3) setPasoActual(p => p + 1)
    else setPedidoConfirmado(true)
  }

  const totalCompra = librosComprados
    .reduce((acc, l) => acc + (parseFloat(l.precio) || 0), 0)
    .toFixed(2)

  if (pedidoConfirmado) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '4rem' }}>✅</p>
            <h2 className="page-header_title" style={{ marginTop: '1rem' }}>¡Pedido confirmado!</h2>
            <p className="page-header_sub" style={{ maxWidth: '400px', margin: '1rem auto' }}>
              Gracias {form.nombre}. Tu pedido se ha procesado correctamente
              y recibirás un correo en <strong>{form.email}</strong>.
            </p>
            <Link to="/mis-libros" className="btn btn-primary" style={{ marginTop: '2rem' }}>
              Ver mis libros →
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <header className="page-header">
        <div className="container">
          <p className="page-header_eyebrow">Librería Nexus</p>
          <h1 className="page-header_title">Finalizar compra</h1>
          <p className="page-header_sub">Completa los datos en tres sencillos pasos.</p>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="formulario-wrapper">

            {/* ── Formulario principal ─── */}
            <div className="formulario-main">

              {/* Stepper */}
              <div className="steps-wrapper">
                <div className="steps">
                  <div className="stepper">
                    {PASOS.map((label, i) => (
                      <div
                        key={i}
                        className={`stepper_paso ${pasoActual === i + 1 ? 'activo' : ''} ${pasoActual > i + 1 ? 'completado' : ''}`}
                      >
                        <div className="stepper_circulo">
                          {pasoActual > i + 1 ? '✓' : i + 1}
                        </div>
                        <span className="stepper_label">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── PASO 1 ── */}
              {pasoActual === 1 && (
                <div className="acordeon_body" style={{ marginTop: '2rem' }}>
                  <h2 className="acordeon_titulo" style={{ marginBottom: '1.5rem' }}>Datos personales</h2>
                  <div className="form-grid dos-col">
                    <Campo id="nombre"    label="Nombre *"    error={errores.nombre}>
                      <input className={`form-input${errores.nombre ? ' error' : ''}`}
                        id="nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)}
                        placeholder="Tu nombre" />
                    </Campo>
                    <Campo id="apellidos" label="Apellidos *" error={errores.apellidos}>
                      <input className={`form-input${errores.apellidos ? ' error' : ''}`}
                        id="apellidos" value={form.apellidos} onChange={e => set('apellidos', e.target.value)}
                        placeholder="Tus apellidos" />
                    </Campo>
                    <Campo id="email"     label="Email *"     error={errores.email}>
                      <input className={`form-input${errores.email ? ' error' : ''}`}
                        id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="correo@ejemplo.com" />
                    </Campo>
                    <Campo id="telefono" label="Teléfono">
                      <input className="form-input" id="telefono" type="tel"
                        value={form.telefono} onChange={e => set('telefono', e.target.value)}
                        placeholder="+34 600 000 000" />
                    </Campo>
                  </div>
                  <button className="btn btn-primary btn-continuar" onClick={siguiente}>
                    Continuar →
                  </button>
                </div>
              )}

              {/* ── PASO 2 ── */}
              {pasoActual === 2 && (
                <div className="acordeon_body" style={{ marginTop: '2rem' }}>
                  <h2 className="acordeon_titulo" style={{ marginBottom: '1.5rem' }}>Datos de envío</h2>
                  <div className="form-grid">
                    <Campo id="direccion" label="Dirección *" error={errores.direccion} full>
                      <input className={`form-input${errores.direccion ? ' error' : ''}`}
                        id="direccion" value={form.direccion} onChange={e => set('direccion', e.target.value)}
                        placeholder="Calle y número" />
                    </Campo>
                    <Campo id="ciudad"   label="Ciudad *" error={errores.ciudad}>
                      <input className={`form-input${errores.ciudad ? ' error' : ''}`}
                        id="ciudad" value={form.ciudad} onChange={e => set('ciudad', e.target.value)}
                        placeholder="Ciudad" />
                    </Campo>
                    <Campo id="cp"       label="Código postal *" error={errores.cp}>
                      <input className={`form-input${errores.cp ? ' error' : ''}`}
                        id="cp" value={form.cp} onChange={e => set('cp', e.target.value)}
                        placeholder="28000" />
                    </Campo>
                    <Campo id="provincia" label="Provincia">
                      <input className="form-input" id="provincia"
                        value={form.provincia} onChange={e => set('provincia', e.target.value)}
                        placeholder="Provincia" />
                    </Campo>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn btn-linea" onClick={() => setPasoActual(1)}>← Volver</button>
                    <button className="btn btn-primary btn-continuar" onClick={siguiente}>Continuar →</button>
                  </div>
                </div>
              )}

              {/* ── PASO 3 ── */}
              {pasoActual === 3 && (
                <div className="acordeon_body" style={{ marginTop: '2rem' }}>
                  <h2 className="acordeon_titulo" style={{ marginBottom: '1.5rem' }}>Datos de pago</h2>
                  <div className="form-grid">
                    <Campo id="titular"   label="Titular de la tarjeta *" error={errores.titular} full>
                      <input className={`form-input${errores.titular ? ' error' : ''}`}
                        id="titular" value={form.titular} onChange={e => set('titular', e.target.value)}
                        placeholder="Nombre en la tarjeta" />
                    </Campo>
                    <Campo id="tarjeta"   label="Número de tarjeta *" error={errores.tarjeta} full>
                      <input className={`form-input${errores.tarjeta ? ' error' : ''}`}
                        id="tarjeta" value={form.tarjeta}
                        onChange={e => set('tarjeta', e.target.value.replace(/[^0-9]/g,'').replace(/(.{4})/g,'$1 ').trim())}
                        placeholder="0000 0000 0000 0000" maxLength={19} />
                    </Campo>
                    <Campo id="caducidad" label="Caducidad *" error={errores.caducidad}>
                      <input className={`form-input${errores.caducidad ? ' error' : ''}`}
                        id="caducidad" value={form.caducidad} onChange={e => set('caducidad', e.target.value)}
                        placeholder="MM/AA" maxLength={5} />
                    </Campo>
                    <Campo id="cvv"       label="CVV *" error={errores.cvv}>
                      <input className={`form-input${errores.cvv ? ' error' : ''}`}
                        id="cvv" type="password" value={form.cvv} onChange={e => set('cvv', e.target.value)}
                        placeholder="•••" maxLength={4} />
                    </Campo>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn btn-linea" onClick={() => setPasoActual(2)}>← Volver</button>
                    <button className="btn btn-primary btn-continuar" onClick={siguiente}>
                      Confirmar pedido ✓
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* ── Resumen ─── */}
            <aside className="formulario-sidebar">
              <div className="resumen">
                <p className="resumen_titulo">Resumen del pedido</p>

                {librosComprados.length === 0 ? (
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                    Tu carrito está vacío.{' '}
                    <Link to="/catalogo" style={{ color: 'var(--color-gold)', display: 'inline-block', padding: '12px 0' }}> {/* le añado padding para que sea más fácil hacer click en móvil */}
                      Ver catálogo →
                    </Link>
                  </p>
                ) : (
                  <>
                    <ul className="resumen_lista">
                      {librosComprados.map(l => (
                        <li key={l.id} className="resumen_item">
                          <span className="resumen_item-titulo">{l.titulo}</span>
                          <span className="resumen_item-precio">
                            {l.precio ? `${l.precio} €` : '—'}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="resumen_total">
                      <span>Total</span>
                      <span>{totalCompra} €</span>
                    </div>
                  </>
                )}
              </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

// ── Campo auxiliar ────────────────────────────────────────────────────
function Campo({ id, label, children, error, full }) {
  return (
    <div className={`form-campo ${full ? 'ancho-completo' : ''}`} id={`campo-${id}`}>
      <label className="form-label" htmlFor={id}>{label}</label>
      {children}
      {error && <span className="form-error">⚠ Este campo es obligatorio</span>}
    </div>
  )
}
