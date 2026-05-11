import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Car, ChefHat, Heart, Sparkles, Shield, Clock, Phone } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EnquiryModal from '../components/EnquiryModal'


const services = [
  { icon: Car,       label: 'Care Home Driver', desc: 'Safe, reliable transport to appointments and outings.', color: '#3B82F6' },
  { icon: ChefHat,   label: 'Cook',             desc: 'Nutritious, home-cooked meals tailored to your needs.', color: '#06B6D4' },
  { icon: Heart,     label: 'Care Worker',      desc: 'Compassionate personal care and daily living support.', color: '#EF4444' },
  { icon: Sparkles,  label: 'Other Services',   desc: 'Housekeeping, companionship, and so much more.', color: '#F59E0B' },
]

const whyUs = [
  { icon: Shield, title: 'Fully DBS Checked', desc: 'All our staff are thoroughly vetted and DBS checked for your peace of mind.' },
  { icon: Clock,  title: '24/7 Availability', desc: 'Round-the-clock support ensures care is always there when needed.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <Navbar />
      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ─── Hero ─── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #08111E 0%, #0D1B2E 50%, #112240 100%)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        paddingTop: 80,
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '15%', right: '-5%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            <motion.h1
              initial="hidden" animate="show" variants={fadeUp} custom={1}
              className="section-title font-serif"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1.5rem' }}
            >
              Compassionate Care<br />
              <span className="gradient-text">For Your Loved Ones</span>
            </motion.h1>
            <motion.p
              initial="hidden" animate="show" variants={fadeUp} custom={2}
              style={{
                fontSize: '1.125rem', color: '#8BA4C0', lineHeight: 1.8,
                maxWidth: 560, marginBottom: '2.5rem',
              }}
            >
              We provide professional, dignified care services across the UK — from
              dedicated care workers and drivers to skilled cooks. Your family
              deserves nothing less than the very best.
            </motion.p>

            <motion.div
              initial="hidden" animate="show" variants={fadeUp} custom={3}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <button
                id="hero-enquiry-btn"
                onClick={() => setModalOpen(true)}
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
              >
                Make an Enquiry <ArrowRight size={18} />
              </button>
              <Link
                to="/services"
                className="btn btn-ghost"
                style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
              >
                Explore Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Services Preview ─── */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag">Our Services</div>
            <h2 className="section-title">
              Everything Your Family <span className="gradient-text">Needs</span>
            </h2>
            <p style={{ color: '#8BA4C0', marginTop: '1rem', maxWidth: 500, margin: '1rem auto 0' }}>
              Comprehensive care services delivered by qualified, compassionate professionals.
            </p>
          </div>

          <div className="grid-4">
            {services.map((s, i) => (
              <motion.div
                key={i}
                className="card card-hover"
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: 60, height: 60, margin: '0 auto 1.25rem',
                  background: `${s.color}18`,
                  border: `1.5px solid ${s.color}40`,
                  borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={26} color={s.color} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.0625rem' }}>{s.label}</h3>
                <p style={{ color: '#8BA4C0', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn btn-primary">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section style={{ background: '#0D1B2E', padding: '6rem 0', borderTop: '1px solid #1E3A5F' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div className="section-tag">Why Choose Us</div>
              <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>
                Trusted By Hundreds<br />
                <span className="gradient-text">Of UK Families</span>
              </h2>
              <p style={{ color: '#8BA4C0', lineHeight: 1.8 }}>
                We understand how important it is to find care you can trust.
                Our team of professionals brings expertise, warmth, and
                dedication to every family we serve.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="btn btn-primary"
                style={{ marginTop: '2rem' }}
              >
                Get Started Today <ArrowRight size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {whyUs.map((item, i) => (
                <motion.div
                  key={i}
                  className="card"
                  initial="hidden" whileInView="show" viewport={{ once: true }}
                  variants={fadeUp} custom={i}
                  style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                >
                  <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    background: 'rgba(59,130,246,0.1)',
                    border: '1.5px solid rgba(59,130,246,0.3)',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={20} color="#3B82F6" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</h4>
                    <p style={{ color: '#8BA4C0', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, #112240 0%, #162B4F 100%)',
              border: '1px solid #2E5080',
              borderRadius: 28,
              padding: 'clamp(2.5rem, 6vw, 4rem)',
              textAlign: 'center',
              boxShadow: '0 0 60px rgba(59,130,246,0.12)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💙</div>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Ready to Get Started?
            </h2>
            <p style={{ color: '#8BA4C0', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.8 }}>
              Submit an enquiry today and one of our care coordinators
              will be in touch within 24 hours.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                id="cta-enquiry-btn"
                onClick={() => setModalOpen(true)}
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
              >
                Make an Enquiry <ArrowRight size={16} />
              </button>
              <a href="tel:+442079460958" className="btn btn-ghost" style={{ fontSize: '1rem' }}>
                <Phone size={16} /> Call Us Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
