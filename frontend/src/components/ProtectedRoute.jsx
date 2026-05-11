import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}
