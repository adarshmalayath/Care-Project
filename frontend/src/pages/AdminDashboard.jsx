import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, BarChart2, LogOut, Heart, RefreshCw,
  Mail, Phone, MapPin, Clock, MessageSquare,
  CheckCircle, XCircle, Inbox, ChevronDown,
  Search, Filter, X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getEnquiries, discardEnquiry } from '../api/services'
import ReplyModal from '../components/ReplyModal'

const STATUS_COLORS = {
  PENDING:   { bg: 'rgba(245,158,11,0.15)',  text: '#FCD34D', border: 'rgba(245,158,11,0.3)' },
  REPLIED:   { bg: 'rgba(16,185,129,0.15)',  text: '#34D399',  border: 'rgba(16,185,129,0.3)' },
  DISCARDED: { bg: 'rgba(239,68,68,0.15)',   text: '#F87171',  border: 'rgba(239,68,68,0.3)' },
}

const FILTERS = ['All', 'PENDING', 'REPLIED', 'DISCARDED']

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [enquiries, setEnquiries]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery]   = useState('')
  const [pendingCount, setPendingCount] = useState(0)
  const [totalCount, setTotalCount]     = useState({ total: 0, pending: 0, replied: 0, discarded: 0 })
  const [replyTarget, setReplyTarget]   = useState(null)
  const [expandedId, setExpandedId]     = useState(null)
  const [lastRefresh, setLastRefresh]   = useState(new Date())
  const [notifOpen, setNotifOpen]       = useState(false)
  const notifRef                        = useRef(null)

  // Close notification popup on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchData = useCallback(async (filter) => {
    setLoading(true)
    try {
      // Always fetch ALL enquiries first to keep total counts accurate
      const allRes = await getEnquiries('')
      const allEnqs = allRes.data.enquiries || []
      setTotalCount({
        total:     allEnqs.length,
        pending:   allEnqs.filter(e => e.status === 'PENDING').length,
        replied:   allEnqs.filter(e => e.status === 'REPLIED').length,
        discarded: allEnqs.filter(e => e.status === 'DISCARDED').length,
      })
      setPendingCount(allRes.data.pendingCount || 0)

      // Then apply the active filter to the displayed list
      if (filter && filter !== 'All') {
        const filtered = await getEnquiries(filter)
        setEnquiries(filtered.data.enquiries || [])
      } else {
        setEnquiries(allEnqs)
      }
      setLastRefresh(new Date())
    } catch {
      toast.error('Failed to load enquiries.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Poll for new enquiries every 30 seconds
  useEffect(() => {
    fetchData(activeFilter)
    const interval = setInterval(() => fetchData(activeFilter), 30000)
    return () => clearInterval(interval)
  }, [fetchData, activeFilter])

  const handleDiscard = async (enquiry) => {
    if (!window.confirm(`Discard enquiry from ${enquiry.customerName}?`)) return
    try {
      await discardEnquiry(enquiry.enquiryId)
      toast.success('Enquiry discarded.')
      fetchData(activeFilter)
    } catch {
      toast.error('Failed to discard enquiry.')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const filtered = enquiries.filter(e => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      e.customerName?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.serviceName?.toLowerCase().includes(q) ||
      e.phone?.includes(q)
    )
  })

  const formatDate = (dt) => {
    if (!dt) return '—'
    return new Date(dt).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08111E', display: 'flex', flexDirection: 'column' }}>
      {/* ─── Top Nav ─── */}
      <header style={{
        background: 'rgba(13, 27, 46, 0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1E3A5F',
        padding: '0 2rem',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
              borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={18} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.1rem' }}>
              Care<span style={{ color: '#3B82F6' }}>Home</span>
            </span>
          </Link>
          <div style={{ height: 20, width: 1, background: '#1E3A5F' }} />
          <span style={{ color: '#4A6882', fontSize: '0.85rem' }}>Admin Dashboard</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notification Bell + Popup */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              id="notification-bell-btn"
              title={pendingCount > 0 ? `${pendingCount} pending enquiries` : 'No pending enquiries'}
              onClick={() => setNotifOpen(o => !o)}
              style={{
                width: 38, height: 38,
                background: notifOpen ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${notifOpen ? 'rgba(59,130,246,0.5)' : '#1E3A5F'}`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: pendingCount > 0 ? '#FCD34D' : '#8BA4C0',
                cursor: 'pointer',
                animation: pendingCount > 0 && !notifOpen ? 'pulse-glow 2s infinite' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <Bell size={17} />
            </button>

            {/* Badge */}
            {pendingCount > 0 && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                color: 'white', fontSize: '0.6875rem', fontWeight: 700,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #08111E',
                pointerEvents: 'none',
              }}>
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}

            {/* Dropdown popup */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute', top: 48, right: 0,
                    width: 340,
                    background: '#0D1B2E',
                    border: '1px solid #1E3A5F',
                    borderRadius: 14,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)',
                    zIndex: 200,
                    overflow: 'hidden',
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    borderBottom: '1px solid #1E3A5F',
                    background: 'rgba(255,255,255,0.02)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Bell size={15} color="#3B82F6" />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                      {pendingCount > 0 && (
                        <span style={{
                          background: 'rgba(239,68,68,0.2)', color: '#F87171',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: 20, padding: '0 6px',
                          fontSize: '0.7rem', fontWeight: 700,
                        }}>
                          {pendingCount} pending
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setNotifOpen(false)}
                      style={{
                        background: 'none', border: 'none', color: '#4A6882',
                        cursor: 'pointer', padding: 4, borderRadius: 6,
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Body */}
                  <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    {enquiries.filter(e => e.status === 'PENDING').length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#4A6882' }}>
                        <CheckCircle size={28} style={{ marginBottom: 8, opacity: 0.5 }} />
                        <p style={{ fontSize: '0.875rem', margin: 0 }}>All caught up!</p>
                        <p style={{ fontSize: '0.8rem', margin: '4px 0 0', opacity: 0.7 }}>No pending enquiries</p>
                      </div>
                    ) : (
                      enquiries
                        .filter(e => e.status === 'PENDING')
                        .map((enq, i) => (
                          <div
                            key={enq.enquiryId}
                            style={{
                              padding: '0.75rem 1rem',
                              borderBottom: i < enquiries.filter(e => e.status === 'PENDING').length - 1 ? '1px solid rgba(30,58,95,0.5)' : 'none',
                              display: 'flex', flexDirection: 'column', gap: '0.25rem',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{enq.customerName}</div>
                                <div style={{ fontSize: '0.775rem', color: '#3B82F6', marginTop: 2 }}>{enq.serviceName}</div>
                              </div>
                              <button
                                onClick={() => {
                                  setNotifOpen(false)
                                  setExpandedId(enq.enquiryId)
                                  // Do NOT change the active filter — keep total count intact
                                  setTimeout(() => {
                                    document.getElementById(`enq-${enq.enquiryId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                  }, 150)
                                }}
                                style={{
                                  background: 'rgba(59,130,246,0.1)',
                                  border: '1px solid rgba(59,130,246,0.3)',
                                  color: '#3B82F6', borderRadius: 6,
                                  fontSize: '0.75rem', fontWeight: 600,
                                  padding: '3px 10px', cursor: 'pointer',
                                  whiteSpace: 'nowrap', flexShrink: 0,
                                }}
                              >
                                View
                              </button>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#4A6882' }}>
                              {enq.email} · {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </div>
                          </div>
                        ))
                    )}
                  </div>

                  {/* Footer */}
                  {pendingCount > 0 && (
                    <div style={{ padding: '0.625rem 1rem', borderTop: '1px solid #1E3A5F' }}>
                      <button
                        onClick={() => {
                          setNotifOpen(false)
                          setActiveFilter('PENDING')
                          setTimeout(() => document.getElementById('enquiry-list')?.scrollIntoView({ behavior: 'smooth' }), 100)
                        }}
                        style={{
                          width: '100%', padding: '0.5rem',
                          background: 'rgba(59,130,246,0.08)',
                          border: '1px solid rgba(59,130,246,0.2)',
                          borderRadius: 8, color: '#3B82F6',
                          fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        View all {pendingCount} pending enquiries
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Insights */}
          <Link
            to="/admin/insights"
            id="insights-link"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: 8, color: '#3B82F6',
              fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            <BarChart2 size={15} /> Insights
          </Link>

          {/* Admin info + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{admin?.fullName || admin?.username}</div>
              <div style={{ color: '#4A6882', fontSize: '0.7rem', marginTop: '0.1rem' }}>
                {admin?.email && <span>{admin.email}</span>}
                {admin?.phone && <span style={{ marginLeft: '0.5rem' }}>· {admin.phone}</span>}
              </div>
            </div>
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main style={{ flex: 1, padding: '2rem' }}>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {[
            { label: 'Total Enquiries', value: totalCount.total,     color: '#3B82F6', icon: Inbox },
            { label: 'Pending',         value: totalCount.pending,    color: '#F59E0B', icon: Clock },
            { label: 'Replied',         value: totalCount.replied,    color: '#10B981', icon: CheckCircle },
            { label: 'Discarded',       value: totalCount.discarded,  color: '#EF4444', icon: XCircle },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'linear-gradient(135deg, #112240, #162B4F)',
                border: `1px solid ${s.color}30`,
                borderRadius: 16, padding: '1.25rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `${s.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.625rem', fontWeight: 800, lineHeight: 1.1, color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#8BA4C0' }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          flexWrap: 'wrap', marginBottom: '1.5rem',
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginRight: 'auto' }}>
            Enquiries
          </h1>

          {/* Search */}
          <div style={{ position: 'relative', minWidth: 220 }}>
            <Search size={15} style={{
              position: 'absolute', left: '0.75rem', top: '50%',
              transform: 'translateY(-50%)', color: '#4A6882',
            }} />
            <input
              id="enquiry-search"
              placeholder="Search name, email…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.25rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
            />
          </div>

          {/* Filter tabs */}
          <div style={{
            display: 'flex', gap: '0.375rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #1E3A5F',
            borderRadius: 10, padding: '0.25rem',
          }}>
            {FILTERS.map(f => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: 7, fontSize: '0.8125rem', fontWeight: 600,
                  background: activeFilter === f ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: activeFilter === f ? '#3B82F6' : '#8BA4C0',
                  border: activeFilter === f ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            id="refresh-btn"
            onClick={() => fetchData(activeFilter)}
            className="btn btn-ghost btn-sm"
            disabled={loading}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        <p style={{ color: '#4A6882', fontSize: '0.8rem', marginBottom: '1rem' }}>
          Last refreshed: {lastRefresh.toLocaleTimeString('en-GB')} · Auto-refreshes every 30s
        </p>

        {/* Enquiry List */}
        {loading && enquiries.length === 0 ? (
          <div className="flex-center" style={{ padding: '4rem 0' }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#4A6882' }}>
            <Inbox size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>No enquiries found</p>
            <p style={{ fontSize: '0.875rem' }}>
              {searchQuery ? 'Try a different search term.' : 'New enquiries will appear here.'}
            </p>
          </div>
        ) : (
          <div id="enquiry-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((enq, i) => {
                const sc = STATUS_COLORS[enq.status] || STATUS_COLORS.PENDING
                const isExpanded = expandedId === enq.enquiryId

                return (
                  <motion.div
                    id={`enq-${enq.enquiryId}`}
                    key={enq.enquiryId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      background: 'linear-gradient(135deg, #112240, #162B4F)',
                      border: '1px solid #1E3A5F',
                      borderRadius: 16, overflow: 'hidden',
                    }}
                  >
                    {/* Card Header */}
                    <div
                      style={{
                        padding: '1.125rem 1.5rem',
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        cursor: 'pointer', flexWrap: 'wrap',
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : enq.enquiryId)}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 42, height: 42, flexShrink: 0,
                        background: `${sc.bg}`,
                        border: `1.5px solid ${sc.border}`,
                        borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '1rem', color: sc.text,
                      }}>
                        {enq.customerName?.[0]?.toUpperCase() || '?'}
                      </div>

                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.2rem' }}>
                          {enq.customerName}
                        </div>
                        <div style={{ color: '#8BA4C0', fontSize: '0.8125rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span><Mail size={11} style={{ display: 'inline', marginRight: 3 }} />{enq.email}</span>
                          <span><Phone size={11} style={{ display: 'inline', marginRight: 3 }} />{enq.phone}</span>
                        </div>
                      </div>

                      {/* Service badge */}
                      <span style={{
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.25)',
                        color: '#93C5FD',
                        borderRadius: 6, padding: '0.25rem 0.625rem',
                        fontSize: '0.75rem', fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}>
                        {enq.serviceName}
                      </span>

                      {/* Status badge */}
                      <span style={{
                        background: sc.bg, border: `1px solid ${sc.border}`,
                        color: sc.text, borderRadius: 6,
                        padding: '0.25rem 0.625rem',
                        fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                      }}>
                        {enq.status}
                      </span>

                      {/* Date */}
                      <span style={{ color: '#4A6882', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        <Clock size={11} style={{ display: 'inline', marginRight: 3 }} />
                        {formatDate(enq.createdAt)}
                      </span>

                      {/* Chevron */}
                      <ChevronDown
                        size={16}
                        style={{
                          color: '#4A6882',
                          transform: isExpanded ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            borderTop: '1px solid #1E3A5F',
                            padding: '1.25rem 1.5rem',
                            display: 'flex', flexDirection: 'column', gap: '1rem',
                          }}>
                            {/* Address + Message */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <div style={{ fontSize: '0.75rem', color: '#4A6882', marginBottom: '0.25rem', fontWeight: 600 }}>
                                  <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />ADDRESS
                                </div>
                                <p style={{ color: '#C8D9EB', fontSize: '0.875rem' }}>{enq.address}</p>
                              </div>
                              {enq.message && (
                                <div>
                                  <div style={{ fontSize: '0.75rem', color: '#4A6882', marginBottom: '0.25rem', fontWeight: 600 }}>
                                    <MessageSquare size={11} style={{ display: 'inline', marginRight: 3 }} />MESSAGE
                                  </div>
                                  <p style={{ color: '#C8D9EB', fontSize: '0.875rem', fontStyle: 'italic' }}>"{enq.message}"</p>
                                </div>
                              )}
                            </div>

                            {/* Admin reply preview */}
                            {enq.adminReply && (
                              <div style={{
                                background: 'rgba(16,185,129,0.05)',
                                border: '1px solid rgba(16,185,129,0.2)',
                                borderRadius: 10, padding: '0.875rem',
                              }}>
                                <div style={{ fontSize: '0.75rem', color: '#34D399', marginBottom: '0.25rem', fontWeight: 600 }}>
                                  ✉ ADMIN REPLY
                                </div>
                                <p style={{ color: '#C8D9EB', fontSize: '0.875rem' }}>{enq.adminReply}</p>
                              </div>
                            )}

                            {/* Actions */}
                            {enq.status === 'PENDING' && (
                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                  id={`reply-btn-${enq.enquiryId}`}
                                  onClick={() => setReplyTarget(enq)}
                                  className="btn btn-success btn-sm"
                                >
                                  <Mail size={14} /> Reply
                                </button>
                                <button
                                  id={`discard-btn-${enq.enquiryId}`}
                                  onClick={() => handleDiscard(enq)}
                                  className="btn btn-danger btn-sm"
                                >
                                  <XCircle size={14} /> Discard
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Reply Modal */}
      {replyTarget && (
        <ReplyModal
          enquiry={replyTarget}
          onClose={() => setReplyTarget(null)}
          onSuccess={() => fetchData(activeFilter)}
        />
      )}
    </div>
  )
}
