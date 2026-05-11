import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { replyToEnquiry } from '../api/services'

export default function ReplyModal({ enquiry, onClose, onSuccess }) {
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!reply.trim() || reply.trim().length < 5) {
      setError('Reply must be at least 5 characters.')
      return
    }
    setLoading(true)
    try {
      await replyToEnquiry(enquiry.enquiryId, reply)
      toast.success('Reply sent successfully!')
      onSuccess()
      onClose()
    } catch {
      toast.error('Failed to send reply. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!enquiry) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="modal-box"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{ maxWidth: 500 }}
        >
          <button onClick={onClose} style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'rgba(255,255,255,0.05)', border: '1px solid #1E3A5F',
            borderRadius: 8, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#8BA4C0', cursor: 'pointer',
          }}>
            <X size={14} />
          </button>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Reply to Enquiry
          </h2>

          {/* Enquiry summary */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #1E3A5F',
            borderRadius: 10,
            padding: '1rem',
            marginBottom: '1.25rem',
          }}>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{enquiry.customerName}</p>
            <p style={{ color: '#8BA4C0', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              {enquiry.serviceName} · {enquiry.email}
            </p>
            {enquiry.message && (
              <p style={{ color: '#8BA4C0', fontSize: '0.875rem', fontStyle: 'italic' }}>
                "{enquiry.message}"
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Your Reply *</label>
              <textarea
                id="reply-text"
                className={`form-control ${error ? 'error' : ''}`}
                placeholder="Type your reply to the customer…"
                value={reply}
                onChange={e => { setReply(e.target.value); setError('') }}
                rows={5}
              />
              {error && <span className="form-error">{error}</span>}
            </div>
            <button
              id="send-reply-btn"
              type="submit"
              className="btn btn-success w-full"
              disabled={loading}
              style={{ justifyContent: 'center' }}
            >
              {loading ? <><div className="spinner" /> Sending…</> : <><Send size={16} /> Send Reply</>}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
