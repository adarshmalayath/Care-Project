import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Layers, LayoutDashboard, LogOut, LogIn, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [tooltip, setTooltip]       = useState(null)
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href) => location.pathname === href

  const NavIcon = ({ href, icon: Icon, label, onClick }) => {
    const active = href ? isActive(href) : false
    const content = (
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setTooltip(label)}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {tooltip === label && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#0D1B2E',
                border: '1px solid #1E3A5F',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color: '#E2EAF4',
                pointerEvents: 'none',
                zIndex: 200,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Icon button */}
        <div style={{
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 10,
          background: active ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${active ? 'rgba(59,130,246,0.4)' : '#1E3A5F'}`,
          color: active ? '#3B82F6' : '#8BA4C0',
          transition: 'all 0.2s',
          cursor: 'pointer',
        }}>
          <Icon size={18} />
        </div>
      </div>
    )

    if (onClick) {
      return (
        <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0 }}>
          {content}
        </button>
      )
    }
    return <Link to={href}>{content}</Link>
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Heart size={20} color="white" fill="white" />
        </div>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1rem, 4vw, 1.25rem)',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}>
          Care<span style={{ color: '#3B82F6' }}>Home</span>
        </span>
      </Link>

      {/* Icon Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <NavIcon href="/"         icon={Home}            label="Home" />
        <NavIcon href="/services" icon={Layers}          label="Services" />
        {isAuthenticated ? (
          <>
            <NavIcon href="/admin"  icon={LayoutDashboard} label="Dashboard" />
            <NavIcon icon={LogOut} label="Logout" onClick={logout} />
          </>
        ) : (
          <NavIcon href="/admin/login" icon={LogIn} label="Admin Login" />
        )}
      </div>
    </nav>
  )
}
