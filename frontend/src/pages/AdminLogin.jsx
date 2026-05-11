import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { adminLogin } from '../api/services'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.username.trim() || !form.password) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await adminLogin(form.username, form.password)
      const { data } = res.data
      login(data.token, {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      })
      toast.success(`Welcome back, ${data.fullName || data.username}!`)
      navigate('/admin')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid username or password.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #08111E 0%, #0D1B2E 50%, #112240 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* BG orbs */}
      <div style={{
        position: 'absolute', top: '10%', right: '10%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '5%',
        width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          background: 'rgba(17, 34, 64, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #1E3A5F',
          borderRadius: 24,
          padding: '3rem',
          width: '100%', maxWidth: 420,
          boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.1)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
              borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={24} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700 }}>
              Care<span style={{ color: '#3B82F6' }}>Home</span>
            </span>
          </Link>

          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56,
            background: 'rgba(59,130,246,0.1)',
            border: '1.5px solid rgba(59,130,246,0.3)',
            borderRadius: '50%', marginBottom: '1rem',
          }}>
            <Lock size={24} color="#3B82F6" />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.375rem' }}>
            Admin Portal
          </h1>
          <p style={{ color: '#8BA4C0', fontSize: '0.9rem' }}>
            Sign in to access the care home dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '0.75rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '1.25rem', color: '#F87171', fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            {error}
          </motion.div>
        )}

        <form id="admin-login-form" onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}
        >
          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{
                position: 'absolute', left: '0.875rem', top: '50%',
                transform: 'translateY(-50%)', color: '#4A6882',
              }} />
              <input
                id="admin-username"
                name="username"
                className="form-control"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                style={{ paddingLeft: '2.5rem' }}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: '0.875rem', top: '50%',
                transform: 'translateY(-50%)', color: '#4A6882',
              }} />
              <input
                id="admin-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: '#4A6882', cursor: 'pointer',
                }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.875rem' }}
          >
            {loading ? <><div className="spinner" /> Signing in…</> : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#4A6882', fontSize: '0.8125rem' }}>
            <Lock size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            Secured with BCrypt encryption & JWT authentication
          </p>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#3B82F6', fontSize: '0.875rem', fontWeight: 500 }}>
            ← Back to CareHome Website
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
