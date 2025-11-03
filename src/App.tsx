import {
  Rocket,
  Beaker,
  Sparkles,
  Calendar,
  Star,
  ArrowRight,
} from 'lucide-react';
import EnhancedBookingCalendar from './components/EnhancedBookingCalendar';

const styles = {
  gradient: {
    background:
      'linear-gradient(180deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)',
    minHeight: '100vh',
    color: 'white',
  },
  nav: {
    position: 'fixed' as const,
    width: '100%',
    background: 'rgba(88, 28, 135, 0.9)',
    backdropFilter: 'blur(10px)',
    zIndex: 50,
    borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
  },
  logo: {
    background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
    borderRadius: '12px',
    padding: '8px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
    padding: '12px 32px',
    borderRadius: '25px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    fontSize: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  buttonSecondary: {
    background: 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: '12px 32px',
    borderRadius: '25px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'white',
    fontSize: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: '32px',
    transition: 'all 0.3s',
  },
  textGradient: {
    background: 'linear-gradient(135deg, #06B6D4, #A855F7, #EC4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
};

export default function CarlsNewtonLanding() {
  return (
    <div style={styles.gradient}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div
          style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '64px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/carls-newton-logo.png"
                alt="Carls Newton Logo"
                style={{
                  height: '56px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '32px',
              }}
            >
              <a
                href="#shows"
                style={{ color: '#06B6D4', textDecoration: 'none' }}
              >
                Shows
              </a>
              <a
                href="#packages"
                style={{ color: '#06B6D4', textDecoration: 'none' }}
              >
                Packages
              </a>
              <a
                href="#booking"
                style={{ color: '#06B6D4', textDecoration: 'none' }}
              >
                Booking
              </a>
              <a
                href="#testimonials"
                style={{ color: '#06B6D4', textDecoration: 'none' }}
              >
                Reviews
              </a>
            </div>

            <button
              style={styles.button}
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book a Show
            </button>
          </div>
        </div>
      </nav>

      {/* Video Animation Section */}
      <section
        style={{
          paddingTop: '80px',
          paddingBottom: '40px',
          padding: '80px 16px 40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '1280px', width: '100%' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.3)',
            }}
          >
            <source src="/carls newton.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Hero Section */}
      <section
        style={{
          paddingTop: '128px',
          paddingBottom: '80px',
          padding: '128px 16px 80px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '384px',
            height: '384px',
            background: 'rgba(6, 182, 212, 0.2)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            top: '-192px',
            left: '-192px',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            width: '384px',
            height: '384px',
            background: 'rgba(168, 85, 247, 0.2)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            bottom: '-192px',
            right: '-192px',
          }}
        ></div>

        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'inline-block', marginBottom: '24px' }}>
            <span
              style={{
                background: 'rgba(6, 182, 212, 0.2)',
                color: '#06B6D4',
                padding: '8px 16px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            >
              🚀 STEM Education Reimagined
            </span>
          </div>

          <h1
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              marginBottom: '24px',
              lineHeight: '1.2',
            }}
          >
            Where Science
            <div style={{ ...styles.textGradient, fontSize: '64px' }}>
              Comes Alive!
            </div>
          </h1>

          <p
            style={{
              fontSize: '24px',
              color: '#C4B5FD',
              marginBottom: '48px',
              maxWidth: '768px',
              margin: '0 auto 48px',
            }}
          >
            Interactive science shows that spark curiosity and ignite a love for
            STEM learning in students across UAE
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <button
              style={styles.button}
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar size={20} />
              <span>Book Your Show</span>
            </button>
            <button style={styles.buttonSecondary}>
              <span>Watch Preview</span>
              <ArrowRight size={20} />
            </button>
          </div>

          <div style={{ marginTop: '64px' }}>
            <div
              style={{
                width: '128px',
                height: '128px',
                margin: '0 auto',
                background: 'linear-gradient(135deg, #F97316, #EF4444)',
                borderRadius: '24px',
                transform: 'rotate(45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.5)',
              }}
            >
              <Rocket
                size={64}
                color="white"
                style={{ transform: 'rotate(-45deg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          padding: '48px 16px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
          }}
        >
          {[
            { number: '500+', label: 'Happy Students' },
            { number: '20+', label: 'Schools Visited' },
            { number: '100+', label: 'Experiments' },
            { number: '5⭐', label: 'Teacher Rating' },
          ].map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  ...styles.textGradient,
                  marginBottom: '8px',
                }}
              >
                {stat.number}
              </div>
              <div style={{ color: '#C4B5FD' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 16px' }} id="shows">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            What We Bring to Your School
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#C4B5FD',
              marginBottom: '64px',
              fontSize: '18px',
            }}
          >
            Explosive learning experiences that students will never forget
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
            }}
          >
            {[
              {
                icon: <Beaker size={32} />,
                title: 'Live Interactive Shows',
                description:
                  '45-60 minute explosive demonstrations that make complex science concepts simple and fun',
                color: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
              },
              {
                icon: <Sparkles size={32} />,
                title: 'Hands-On Workshops',
                description:
                  'Students become scientists with guided experiments and real-world STEM activities',
                color: 'linear-gradient(135deg, #A855F7, #EC4899)',
              },
              {
                icon: <Rocket size={32} />,
                title: 'Blast-off! Lab Experience',
                description:
                  '120-150 minute outdoor lab adventures combining multiple experiments and discovery',
                color: 'linear-gradient(135deg, #F97316, #EF4444)',
              },
            ].map((feature, idx) => (
              <div key={idx} style={styles.card}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: feature.color,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: '#C4B5FD' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section
        style={{
          padding: '80px 16px',
          background:
            'linear-gradient(180deg, transparent, rgba(88, 28, 135, 0.5))',
        }}
        id="packages"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            Our Packages
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#C4B5FD',
              marginBottom: '64px',
              fontSize: '18px',
            }}
          >
            Flexible options to fit your school's needs and budget
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
            }}
          >
            {[
              {
                name: 'Preschool Special',
                duration: '30-45 mins',
                price: '1,200',
                features: [
                  'Age-appropriate experiments',
                  'Interactive storytelling',
                  'Sensory activities',
                  'Fun takeaways',
                ],
              },
              {
                name: 'Classic Show',
                duration: '45-60 mins',
                price: '1,800',
                features: [
                  'Curriculum-aligned topics',
                  'Explosive demos',
                  'Q&A session',
                  'Student participation',
                ],
                popular: true,
              },
              {
                name: 'Half-Day Experience',
                duration: 'Show + Workshop',
                price: '2,500',
                features: [
                  'Live show included',
                  'Hands-on group session',
                  'Max 30 students',
                  'Take-home materials',
                ],
              },
            ].map((pkg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.card,
                  border: pkg.popular
                    ? '2px solid #06B6D4'
                    : '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                }}
              >
                {pkg.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      right: '32px',
                      background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
                      padding: '4px 16px',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  {pkg.name}
                </h3>
                <p style={{ color: '#C4B5FD', marginBottom: '16px' }}>
                  {pkg.duration}
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 'bold' }}>
                    AED {pkg.price}
                  </span>
                  {pkg.price !== 'Custom' && (
                    <span style={{ color: '#C4B5FD' }}> +</span>
                  )}
                </div>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    marginBottom: '32px',
                  }}
                >
                  {pkg.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      <Star
                        size={20}
                        color="#06B6D4"
                        style={{ flexShrink: 0, marginTop: '2px' }}
                      />
                      <span style={{ color: '#C4B5FD' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    ...(pkg.popular ? styles.button : styles.buttonSecondary),
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Calendar Section */}
      <section
        style={{
          padding: '80px 16px',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
        id="booking"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            Book Your Show
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#C4B5FD',
              marginBottom: '48px',
              fontSize: '18px',
            }}
          >
            Select a date and time that works best for your school
          </p>
          <EnhancedBookingCalendar />
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 16px' }} id="testimonials">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '64px',
            }}
          >
            What Schools Say About Us
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
            }}
          >
            {[
              {
                quote:
                  "The students were absolutely mesmerized! They're still talking about the experiments days later.",
                author: 'Ms. Sarah Ahmed',
                role: 'Science Teacher, Dubai International School',
              },
              {
                quote:
                  'Carls Newton brought our curriculum to life. The perfect blend of education and entertainment!',
                author: 'Mr. James Wilson',
                role: 'Head of STEM, Abu Dhabi Academy',
              },
              {
                quote:
                  'Our preschoolers loved every moment. Age-appropriate and engaging from start to finish.',
                author: 'Mrs. Fatima Al Mazrouei',
                role: 'Early Years Coordinator',
              },
            ].map((testimonial, idx) => (
              <div key={idx} style={styles.card}>
                <div
                  style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#FBBF24" color="#FBBF24" />
                  ))}
                </div>
                <p
                  style={{
                    color: '#C4B5FD',
                    marginBottom: '24px',
                    fontStyle: 'italic',
                  }}
                >
                  "{testimonial.quote}"
                </p>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{testimonial.author}</div>
                  <div style={{ fontSize: '14px', color: '#C4B5FD' }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '80px 16px',
          background: 'linear-gradient(135deg, #0891b2, #A855F7)',
        }}
      >
        <div
          style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center' }}
        >
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '24px',
            }}
          >
            Ready to Spark Curiosity in Your Students?
          </h2>
          <p
            style={{ fontSize: '20px', marginBottom: '32px', color: '#E9D5FF' }}
          >
            Book a show today and watch science come alive in your classroom!
            🔬🚀
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <button
              style={{
                background: 'white',
                color: '#A855F7',
                padding: '16px 32px',
                borderRadius: '25px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              Schedule a Call
            </button>
            <button
              style={{
                ...styles.buttonSecondary,
                padding: '16px 32px',
                fontSize: '18px',
              }}
            >
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e1b4b', padding: '48px 16px' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <img
                src="/carls-newton-logo.png"
                alt="Carls Newton Logo"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  objectFit: 'contain'
                }}
              />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Carls Newton
              </span>
            </div>
            <p style={{ color: '#C4B5FD', fontSize: '14px' }}>
              Making science fun, one explosion at a time!
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '16px' }}>
              Quick Links
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                color: '#C4B5FD',
                fontSize: '14px',
              }}
            >
              <li style={{ marginBottom: '8px' }}>
                <a
                  href="#"
                  style={{ color: '#C4B5FD', textDecoration: 'none' }}
                >
                  About Us
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a
                  href="#"
                  style={{ color: '#C4B5FD', textDecoration: 'none' }}
                >
                  Our Shows
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a
                  href="#"
                  style={{ color: '#C4B5FD', textDecoration: 'none' }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1280px',
            margin: '48px auto 0',
            paddingTop: '32px',
            borderTop: '1px solid rgba(168, 85, 247, 0.3)',
            textAlign: 'center',
            color: '#A78BFA',
            fontSize: '14px',
          }}
        >
          <p>
            © 2025 Carls Newton. All rights reserved. | Making STEM education
            accessible across UAE 🇦🇪
          </p>
        </div>
      </footer>
    </div>
  );
}
