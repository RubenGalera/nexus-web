import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import MisLibros from '../MisLibros.jsx'
import { renderConProveedores } from '../../test/test-utils.jsx'

describe('MisLibros (página)', () => {
  it('muestra el estado vacío cuando no hay libros comprados', () => {
    renderConProveedores(<MisLibros />, { route: '/mis-libros' })

    expect(screen.getByText('Aún no tienes libros')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explorar catálogo' })).toHaveAttribute('href', '/catalogo')
  })

  it('muestra el saludo con el usuario de la cuenta si hay sesión', () => {
    sessionStorage.setItem('nexus_user', JSON.stringify({ usuario: 'admin' }))
    renderConProveedores(<MisLibros />, { route: '/mis-libros' })

    expect(screen.getByText(/Mi cuenta · admin/)).toBeInTheDocument()
  })

  it('muestra los libros comprados guardados en sessionStorage', () => {
    const libro = { id: 5, titulo: 'Física Cuántica', autor: 'A. Einstein', precio: 19.99, categoria: 'Aprender' }
    sessionStorage.setItem('nexus_comprados', JSON.stringify([libro]))

    renderConProveedores(<MisLibros />, { route: '/mis-libros' })

    expect(screen.getByText('Física Cuántica')).toBeInTheDocument()
    // El número va en un <strong> separado del resto del texto,
    // así que comprobamos el contenido completo del párrafo contenedor.
    const contador = screen.getByText('1').closest('p')
    expect(contador.textContent).toMatch(/1 título adquirido/)
  })
})
