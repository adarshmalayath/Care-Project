import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Services from './pages/Services'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminInsights from './pages/AdminInsights'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#112240',
              color: '#E2EAF4',
              border: '1px solid #1E3A5F',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#112240' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#112240' } },
          }}
        />
        <Routes>
          <Route path="/"                 element={<Home />} />
          <Route path="/services"         element={<Services />} />
          <Route path="/admin/login"      element={<AdminLogin />} />
          <Route path="/admin"            element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/insights"   element={<ProtectedRoute><AdminInsights /></ProtectedRoute>} />
          <Route path="*"                 element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
