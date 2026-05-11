import { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, ChefHat, Heart, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EnquiryModal from '../components/EnquiryModal'

const services = [
  {
    id: 'driver',
    icon: Car,
    name: 'Care Home Driver',
    tagline: 'Safe, reliable transport — always on time.',
    description: `Our professional drivers provide safe, comfortable, and
    dignified transport for elderly and vulnerable individuals. Whether it is
    regular hospital appointments, visits to loved ones, or day trips, we ensure
    every journey is relaxed and stress-free.`,
    color: '#3B82F6',
    features: [
      'Hospital and GP appointment transport',
      'Day trips and social outings',
      'Airport and long-distance journeys',
      'Wheelchair-accessible vehicles available',
      'Companionship during travel',
      'Flexible scheduling',
    ],
  },
  {
    id: 'cook',
    icon: ChefHat,
    name: 'Cook',
    tagline: 'Nutritious, home-cooked meals with love.',
    description: `Our skilled and caring cooks prepare fresh, nutritious meals
    tailored to individual dietary requirements, allergies, and preferences.
    We believe good nutrition is fundamental to wellbeing and work with families
    to create menus that nourish body and soul.`,
    color: '#06B6D4',
    features: [
      'Fresh, home-cooked meals daily',
      'Dietary and allergy accommodation',
      'Culturally sensitive menus',
      'Batch cooking and meal preparation',
      'Kitchen hygiene and safety compliant',
      'Flexible meal time scheduling',
    ],
  },
  {
    id: 'care-worker',
    icon: Heart,
    name: 'Care Worker',
    tagline: 'Compassionate support every step of the way.',
    description: `Our dedicated care workers provide person-centred support
    that promotes independence, dignity, and quality of life. From personal care
    and medication assistance to companionship and emotional support, we are
    here to make every day better.`,
    color: '#EF4444',
    features: [
      'Personal care and hygiene support',
      'Medication reminders and assistance',
      'Companionship and social engagement',
      'Mobility and fall prevention support',
      'Live-in care available',
      'Emergency and respite care',
    ],
  },
  {
    id: 'other',
    icon: Sparkles,
    name: 'Other Services',
    tagline: 'Whatever you need, we\'re here to help.',
    description: `Beyond our core services, we offer a wide range of support
    to enhance quality of life at home. From housekeeping and laundry to
    gardening and social activities — our flexible team adapts to whatever
    your family needs most.`,
    color: '#F59E0B',
    features: [
      'Light housekeeping and cleaning',
      'Laundry and ironing',
      'Shopping and errand running',
      'Gardening assistance',
      'Pet care support',
      'Social activities and day centres',
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
}

export default function Services() {
  const [modalOpen, setModalOpen]       = useState(false)
  const [selectedService, setSelectedService] = useState('')

  const openEnquiry = (serviceName) => {
    setSelectedService(serviceName)
    setModalOpen(true)
  }

  return (
    <div>
      <Navbar />
      <EnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={selectedService}
      />

      {/* Page Header */}
      <section style={{
        paddingTop: 120, paddingBottom: '4rem',
        background: 'linear-gradient(180deg, #0D1B2E 0%, #08111E 100%)',
        borderBottom: '1px solid #1E3A5F',
        textAlign: 'center',
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="section-tag"
          >
            What We Offer
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title font-serif"
            style={{ marginBottom: '1rem' }}
          >
            Our Care Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ color: '#8BA4C0', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}
          >
            Professional, compassionate services tailored to support your loved ones
            and provide your family with peace of mind.
          </motion.p>
        </div>
      </section>

      {/* Service Cards */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              id={`service-${service.id}`}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} custom={i}
              style={{
                background: 'linear-gradient(135deg, #112240 0%, #162B4F 100%)',
                border: '1px solid #1E3A5F',
                borderRadius: 24,
                overflow: 'hidden',
                transition: 'box-shadow 0.3s',
              }}
              whileHover={{ boxShadow: `0 0 40px ${service.color}20` }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr',
                gap: 0,
              }}
                className="service-grid"
              >
                {/* Icon Panel */}
                <div style={{
                  background: `linear-gradient(135deg, ${service.color}15 0%, ${service.color}05 100%)`,
                  borderRight: i % 2 === 0 ? `1px solid ${service.color}25` : 'none',
                  borderLeft: i % 2 !== 0 ? `1px solid ${service.color}25` : 'none',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '3rem 2rem',
                  order: i % 2 !== 0 ? 1 : 0,
                }}>
                  <div style={{
                    width: 96, height: 96,
                    background: `${service.color}18`,
                    border: `2px solid ${service.color}40`,
                    borderRadius: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem',
                    animation: 'float 3s ease-in-out infinite',
                  }}>
                    <service.icon size={48} color={service.color} />
                  </div>
                  <h2 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.5rem', fontWeight: 700, textAlign: 'center',
                    marginBottom: '0.5rem',
                  }}>
                    {service.name}
                  </h2>
                  <p style={{ color: service.color, fontSize: '0.9rem', textAlign: 'center', fontStyle: 'italic' }}>
                    {service.tagline}
                  </p>
                </div>

                {/* Content Panel */}
                <div style={{ padding: '2.5rem', order: i % 2 !== 0 ? 0 : 1 }}>
                  <p style={{ color: '#8BA4C0', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    {service.description}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '0.6rem',
                    marginBottom: '2rem',
                  }}>
                    {service.features.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <CheckCircle size={15} color={service.color} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: '0.875rem', color: '#C8D9EB' }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    id={`enquire-${service.id}`}
                    onClick={() => openEnquiry(service.name)}
                    className="btn"
                    style={{
                      background: `linear-gradient(135deg, ${service.color}, ${service.color}CC)`,
                      color: 'white',
                      boxShadow: `0 4px 20px ${service.color}35`,
                    }}
                  >
                    Enquire About This Service <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Responsive fix for service grid */}
      <style>{`
        @media (max-width: 768px) {
          .service-grid {
            grid-template-columns: 1fr !important;
          }
          .service-grid > div {
            order: unset !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  )
}
