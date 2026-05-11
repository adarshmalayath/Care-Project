import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: '#080F1A',
      borderTop: '1px solid #1E3A5F',
      padding: '4rem 0 2rem',
      marginTop: '6rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
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
            </div>
            <p style={{ color: '#8BA4C0', lineHeight: 1.7, fontSize: '0.9rem' }}>
              Providing compassionate, professional care services to families across the UK.
              Your loved ones deserve the very best.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36,
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#3B82F6', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.transform = 'none' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#E2EAF4' }}>Our Services</h4>
            {['Care Home Driver', 'Cook', 'Care Worker', 'Other Services'].map(s => (
              <Link key={s} to="/services" style={{
                display: 'block', color: '#8BA4C0', fontSize: '0.9rem',
                marginBottom: '0.6rem', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#3B82F6'}
                onMouseLeave={e => e.currentTarget.style.color = '#8BA4C0'}
              >
                → {s}
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#E2EAF4' }}>Quick Links</h4>
            {[['Home', '/'], ['Services', '/services'], ['Admin Portal', '/admin/login']].map(([label, href]) => (
              <Link key={href} to={href} style={{
                display: 'block', color: '#8BA4C0', fontSize: '0.9rem',
                marginBottom: '0.6rem', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#3B82F6'}
                onMouseLeave={e => e.currentTarget.style.color = '#8BA4C0'}
              >
                → {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: '#E2EAF4' }}>Contact Us</h4>
            {[
              [Phone, '+44 20 7946 0958'],
              [Mail,  'info@carehome.co.uk'],
              [MapPin,'London, United Kingdom'],
            ].map(([Icon, text], i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                <Icon size={16} style={{ color: '#3B82F6', marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: '#8BA4C0', fontSize: '0.9rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1E3A5F', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#4A6882', fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} CareHome Services. All rights reserved. Made with{' '}
            <Heart size={12} style={{ display: 'inline', color: '#EF4444', verticalAlign: 'middle' }} fill="#EF4444" />{' '}
            in the United Kingdom.
          </p>
        </div>
      </div>
    </footer>
  )
}
