import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session from localStorage
    const token = localStorage.getItem('ch_token')
    const adminData = localStorage.getItem('ch_admin')
    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData))
      } catch {
        localStorage.removeItem('ch_token')
        localStorage.removeItem('ch_admin')
      }
    }
    setLoading(false)
  }, [])

  const login = (token, adminData) => {
    localStorage.setItem('ch_token', token)
    localStorage.setItem('ch_admin', JSON.stringify(adminData))
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('ch_token')
    localStorage.removeItem('ch_admin')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
