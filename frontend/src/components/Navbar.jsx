import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'Services', href: '/services' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Heart size={20} color="white" fill="white" />
        </div>
        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700 }}>
          Care<span style={{ color: '#3B82F6' }}>Home</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {navLinks.map(l => (
          <Link key={l.href} to={l.href} style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: location.pathname === l.href ? '#3B82F6' : '#8BA4C0',
            background: location.pathname === l.href ? 'rgba(59,130,246,0.1)' : 'transparent',
            transition: 'all 0.2s',
          }}>
            {l.label}
          </Link>
        ))}
        {isAuthenticated ? (
          <>
            <Link to="/admin" className="btn btn-ghost btn-sm">Dashboard</Link>
            <button onClick={logout} className="btn btn-outline btn-sm">Logout</button>
          </>
        ) : (
          <Link to="/admin/login" className="btn btn-primary btn-sm">Admin Login</Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ display: 'none' }}
        id="mobile-menu-btn"
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile nav - show via CSS */}
      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: 70,
              left: 0, right: 0,
              background: 'rgba(8,17,30,0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid #1E3A5F',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              zIndex: 99,
            }}
          >
            {navLinks.map(l => (
              <Link key={l.href} to={l.href} style={{
                padding: '0.75rem 1rem',
                borderRadius: 8,
                fontSize: '1rem',
                fontWeight: 500,
                color: '#E2EAF4',
                borderBottom: '1px solid #1E3A5F',
              }}>
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="btn btn-ghost">Dashboard</Link>
                <button onClick={logout} className="btn btn-primary">Logout</button>
              </>
            ) : (
              <Link to="/admin/login" className="btn btn-primary">Admin Login</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
