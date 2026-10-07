import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'

/**
 * renderConProveedores — envuelve el componente bajo test con los
 * mismos providers que tiene la app real (Router + AuthContext),
 * para que useAuth(), <Link>, useNavigate, etc. funcionen igual
 * que en producción dentro de los tests.
 */
export function renderConProveedores(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  )
}

// Libro de ejemplo reutilizable en varios tests
export const libroMock = {
  id: 1,
  titulo: 'Cálculo Avanzado',
  autor: 'J. Pérez',
  categoria: 'Aprender',
  precio: 24.99,
  anio: 2023,
  tipo: 'libro',
}

// Espacio de coworking libre de ejemplo
export const espacioLibreMock = {
  id: 1,
  nombre: 'Sala Curie',
  descripcion: 'Sala de reuniones con proyector',
  capacidad: 6,
  estado: 'libre',
  hora_inicio: '2025-01-01T09:00:00',
  hora_fin: '2025-01-01T18:00:00',
}

// Espacio de coworking ocupado de ejemplo
export const espacioOcupadoMock = {
  id: 2,
  nombre: 'Sala Picasso',
  descripcion: 'Mesa individual junto a la ventana',
  capacidad: 2,
  estado: 'ocupado',
  ocupado_por: 'Marta G.',
}

/** Crea una respuesta de fetch mockeada exitosa con el JSON dado */
export function mockFetchOnce(data, ok = true) {
  global.fetch.mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? 'OK' : 'Internal Server Error',
    json: async () => data,
  })
}
