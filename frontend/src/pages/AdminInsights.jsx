import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  Tooltip, Legend, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid,
} from 'recharts'
import {
  Heart, ArrowLeft, TrendingUp, Users,
  Clock, CheckCircle, XCircle, RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getInsights } from '../api/services'
import { useAuth } from '../context/AuthContext'

const COLORS = {
  pending:    '#F59E0B',
  replied:    '#10B981',
  discarded:  '#EF4444',
  driver:     '#3B82F6',
  cook:       '#06B6D4',
  careWorker: '#EC4899',
  other:      '#8B5CF6',
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#112240', border: '1px solid #1E3A5F',
      borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem',
    }}>
      {label && <p style={{ color: '#8BA4C0', marginBottom: '0.25rem', fontSize: '0.8rem' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.color, fontWeight: 700 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function AdminInsights() {
  const { admin } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await getInsights()
      setStats(res.data.stats)
    } catch {
      toast.error('Failed to load insights.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const statusData = stats ? [
    { name: 'Pending',   value: Number(stats.pendingCount),   fill: COLORS.pending },
    { name: 'Replied',   value: Number(stats.repliedCount),   fill: COLORS.replied },
    { name: 'Discarded', value: Number(stats.discardedCount), fill: COLORS.discarded },
  ] : []

  const serviceData = stats ? [
    { name: 'Care Driver',  count: Number(stats.driverCount),     fill: COLORS.driver },
    { name: 'Cook',         count: Number(stats.cookCount),        fill: COLORS.cook },
    { name: 'Care Worker',  count: Number(stats.careWorkerCount),  fill: COLORS.careWorker },
    { name: 'Other',        count: Number(stats.otherCount),       fill: COLORS.other },
  ] : []

  const kpis = stats ? [
    { label: 'Total Enquiries',  value: stats.totalEnquiries,  color: COLORS.driver,      icon: Users },
    { label: 'Awaiting Reply',   value: stats.pendingCount,    color: COLORS.pending,     icon: Clock },
    { label: 'Successfully Replied', value: stats.repliedCount,  color: COLORS.replied,  icon: CheckCircle },
    { label: 'Discarded',        value: stats.discardedCount,  color: COLORS.discarded,   icon: XCircle },
  ] : []

  return (
    <div style={{ minHeight: '100vh', background: '#08111E', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(13, 27, 46, 0.98)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #1E3A5F',
        padding: '0 2rem', height: 64,
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
          <span style={{ color: '#4A6882', fontSize: '0.85rem' }}>Insights Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            id="refresh-insights-btn"
            onClick={fetchStats}
            className="btn btn-ghost btn-sm"
            disabled={loading}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} />
            Refresh
          </button>
          <Link to="/admin" id="back-to-dashboard" className="btn btn-ghost btn-sm">
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <TrendingUp size={22} color="#3B82F6" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Enquiry Insights</h1>
          </div>
          <p style={{ color: '#8BA4C0', fontSize: '0.9rem' }}>
            Overview of all enquiry activity and service demand.
          </p>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: '5rem 0' }}>
            <div className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem', marginBottom: '2rem',
            }}>
              {kpis.map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background: 'linear-gradient(135deg, #112240, #162B4F)',
                    border: `1px solid ${kpi.color}30`,
                    borderRadius: 16, padding: '1.5rem',
                    borderTop: `3px solid ${kpi.color}`,
                  }}
                >
                  <kpi.icon size={22} color={kpi.color} style={{ marginBottom: '0.75rem' }} />
                  <div style={{ fontSize: '2.25rem', fontWeight: 900, color: kpi.color, lineHeight: 1 }}>
                    {kpi.value}
                  </div>
                  <div style={{ color: '#8BA4C0', fontSize: '0.8125rem', marginTop: '0.5rem' }}>{kpi.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>

              {/* Status Distribution — Pie */}
              <div style={{
                background: 'linear-gradient(135deg, #112240, #162B4F)',
                border: '1px solid #1E3A5F',
                borderRadius: 20, padding: '1.75rem',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>
                  Enquiry Status Breakdown
                </h3>
                <p style={{ color: '#8BA4C0', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                  Distribution of all enquiries by current status
                </p>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={v => <span style={{ color: '#8BA4C0', fontSize: '0.8rem' }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Service Demand — Bar */}
              <div style={{
                background: 'linear-gradient(135deg, #112240, #162B4F)',
                border: '1px solid #1E3A5F',
                borderRadius: 20, padding: '1.75rem',
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>
                  Enquiries by Service
                </h3>
                <p style={{ color: '#8BA4C0', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                  Total enquiry volume per service category
                </p>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={serviceData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#8BA4C0', fontSize: 11 }}
                      axisLine={{ stroke: '#1E3A5F' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#8BA4C0', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Enquiries" radius={[6, 6, 0, 0]}>
                      {serviceData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Response rate */}
              {stats && (
                <div style={{
                  background: 'linear-gradient(135deg, #112240, #162B4F)',
                  border: '1px solid #1E3A5F',
                  borderRadius: 20, padding: '1.75rem',
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    Response Rate
                  </h3>
                  {[
                    { label: 'Replied', val: stats.repliedCount,   total: stats.totalEnquiries, color: COLORS.replied },
                    { label: 'Pending', val: stats.pendingCount,   total: stats.totalEnquiries, color: COLORS.pending },
                    { label: 'Discarded',val:stats.discardedCount, total: stats.totalEnquiries, color: COLORS.discarded },
                  ].map((item, i) => {
                    const pct = stats.totalEnquiries > 0
                      ? Math.round((Number(item.val) / Number(stats.totalEnquiries)) * 100)
                      : 0
                    return (
                      <div key={i} style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', color: '#C8D9EB' }}>{item.label}</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: item.color }}>
                            {item.val} ({pct}%)
                          </span>
                        </div>
                        <div style={{
                          height: 8, background: 'rgba(255,255,255,0.05)',
                          borderRadius: 4, overflow: 'hidden',
                        }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            style={{
                              height: '100%',
                              background: item.color,
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Most demanded service */}
              {stats && (
                <div style={{
                  background: 'linear-gradient(135deg, #112240, #162B4F)',
                  border: '1px solid #1E3A5F',
                  borderRadius: 20, padding: '1.75rem',
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    Service Demand Breakdown
                  </h3>
                  {serviceData.map((s, i) => {
                    const pct = stats.totalEnquiries > 0
                      ? Math.round((s.count / Number(stats.totalEnquiries)) * 100)
                      : 0
                    return (
                      <div key={i} style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', color: '#C8D9EB' }}>{s.name}</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: s.fill }}>
                            {s.count} ({pct}%)
                          </span>
                        </div>
                        <div style={{
                          height: 8, background: 'rgba(255,255,255,0.05)',
                          borderRadius: 4, overflow: 'hidden',
                        }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.15 }}
                            style={{ height: '100%', background: s.fill, borderRadius: 4 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
