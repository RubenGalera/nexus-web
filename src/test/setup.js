import '@testing-library/jest-dom'

// Mock global de fetch para que ningún test golpee la API real.
// Cada test sobrescribe la implementación concreta que necesite.
global.fetch = vi.fn()

afterEach(() => {
  vi.restoreAllMocks()
  window.sessionStorage.clear()
})
