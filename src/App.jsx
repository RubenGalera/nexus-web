import { Routes, Route, Navigate } from 'react-router-dom'
import Login       from './pages/Login.jsx'
import Home        from './pages/Home.jsx'
import Catalog     from './pages/Catalog.jsx'
import BookDetail  from './pages/BookDetail.jsx'
import Coworking   from './pages/Coworking.jsx'
import MisLibros   from './pages/MisLibros.jsx'
import Purchase    from './pages/Purchase.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas — requieren login */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/catalogo" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
      <Route path="/catalogo/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
      <Route path="/coworking" element={<ProtectedRoute><Coworking /></ProtectedRoute>} />
      <Route path="/mis-libros" element={<ProtectedRoute><MisLibros /></ProtectedRoute>} />
      <Route path="/compra" element={<ProtectedRoute><Purchase /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
