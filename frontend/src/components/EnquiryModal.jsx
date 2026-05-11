import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, User, Mail, Phone, MapPin, MessageSquare, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitEnquiry } from '../api/services'

const SERVICES = ['Care Home Driver', 'Cook', 'Care Worker', 'Other Services']

const initialForm = {
  customerName: '', email: '', phone: '',
  address: '', serviceName: '', message: '',
}

export default function EnquiryModal({ isOpen, onClose, preselectedService }) {
  const [form, setForm] = useState({ ...initialForm, serviceName: preselectedService || '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.customerName.trim()) errs.customerName = 'Your name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.serviceName) errs.serviceName = 'Please select a service'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await submitEnquiry(form)
      setSubmitted(true)
      toast.success('Enquiry submitted! We\'ll be in touch soon.')
    } catch (err) {
      const serverErrors = err.response?.data?.errors
      if (serverErrors) {
        setErrors(serverErrors)
      } else {
        toast.error('Failed to submit enquiry. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({ ...initialForm, serviceName: preselectedService || '' })
    setErrors({})
    setSubmitted(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            className="modal-box"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Close button */}
            <button
              id="close-enquiry-modal"
              onClick={handleClose}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid #1E3A5F',
                borderRadius: 8, width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#8BA4C0', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#EF4444' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#8BA4C0' }}
            >
              <X size={14} />
            </button>

            {submitted ? (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
                style={{ padding: '2rem 1rem' }}
              >
                <div style={{
                  width: 72, height: 72, margin: '0 auto 1.5rem',
                  background: 'rgba(16,185,129,0.15)',
                  border: '2px solid rgba(16,185,129,0.4)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle size={36} color="#10B981" />
                </div>
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  Enquiry Submitted!
                </h2>
                <p style={{ color: '#8BA4C0', marginBottom: '2rem', lineHeight: 1.7 }}>
                  Thank you for reaching out. Our team will review your enquiry
                  and get back to you within 24 hours.
                </p>
                <button className="btn btn-primary w-full" onClick={handleClose}>
                  Close
                </button>
              </motion.div>
            ) : (
              /* Form state */
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem',
                  }}>
                    <div style={{
                      width: 40, height: 40,
                      background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <MessageSquare size={20} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Make an Enquiry</h2>
                  </div>
                  <p style={{ color: '#8BA4C0', fontSize: '0.9rem' }}>
                    Fill in your details and we'll get back to you promptly.
                  </p>
                </div>

                <form id="enquiry-form" onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label">
                      <User size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Full Name *
                    </label>
                    <input
                      id="enquiry-name"
                      name="customerName"
                      className={`form-control ${errors.customerName ? 'error' : ''}`}
                      placeholder="e.g. Margaret Thompson"
                      value={form.customerName}
                      onChange={onChange}
                    />
                    {errors.customerName && <span className="form-error">{errors.customerName}</span>}
                  </div>

                  {/* Email + Phone */}
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <Mail size={13} style={{ display: 'inline', marginRight: 4 }} />
                        Email *
                      </label>
                      <input
                        id="enquiry-email"
                        name="email"
                        type="email"
                        className={`form-control ${errors.email ? 'error' : ''}`}
                        placeholder="your@email.co.uk"
                        value={form.email}
                        onChange={onChange}
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <Phone size={13} style={{ display: 'inline', marginRight: 4 }} />
                        Phone *
                      </label>
                      <input
                        id="enquiry-phone"
                        name="phone"
                        type="tel"
                        className={`form-control ${errors.phone ? 'error' : ''}`}
                        placeholder="+44 7xxx xxxxxx"
                        value={form.phone}
                        onChange={onChange}
                      />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Address *
                    </label>
                    <input
                      id="enquiry-address"
                      name="address"
                      className={`form-control ${errors.address ? 'error' : ''}`}
                      placeholder="Your full address"
                      value={form.address}
                      onChange={onChange}
                    />
                    {errors.address && <span className="form-error">{errors.address}</span>}
                  </div>

                  {/* Service */}
                  <div className="form-group">
                    <label className="form-label">Service Required *</label>
                    <select
                      id="enquiry-service"
                      name="serviceName"
                      className={`form-control ${errors.serviceName ? 'error' : ''}`}
                      value={form.serviceName}
                      onChange={onChange}
                    >
                      <option value="">Select a service…</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.serviceName && <span className="form-error">{errors.serviceName}</span>}
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label className="form-label">Additional Message (optional)</label>
                    <textarea
                      id="enquiry-message"
                      name="message"
                      className="form-control"
                      placeholder="Tell us more about your requirements…"
                      value={form.message}
                      onChange={onChange}
                      rows={3}
                    />
                  </div>

                  <button
                    id="enquiry-submit"
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                    style={{ marginTop: '0.5rem', justifyContent: 'center' }}
                  >
                    {loading ? (
                      <><div className="spinner" /> Submitting…</>
                    ) : (
                      <><Send size={16} /> Submit Enquiry</>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
