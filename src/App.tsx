import { useState } from 'react';
import {
  Rocket,
  Beaker,
  Sparkles,
  Calendar,
  Star,
  ArrowRight,
  Volume2,
  Maximize,
  Activity,
  Clock,
  BookOpen,
} from 'lucide-react';
import EnhancedBookingCalendar from './components/EnhancedBookingCalendar';
import GooeyNav from './components/GooeyNav';
import AIStotleModal from './components/AIStotleModal';

const styles = {
  gradient: {
    background:
      'linear-gradient(180deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)',
    minHeight: '100vh',
    color: 'white',
  },
  nav: {
    width: '100%',
    background: 'rgba(88, 28, 135, 0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
    overflow: 'visible',
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
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div style={styles.gradient}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes buttonGlow {
          0%, 100% { box-shadow: 0 0 15px currentColor; }
          50% { box-shadow: 0 0 25px currentColor; }
        }
        @keyframes particleDrift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5px, -5px); }
          50% { transform: translate(-3px, 3px); }
          75% { transform: translate(3px, 5px); }
        }
        @keyframes ledBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }

        .console-grid {
          display: grid;
          grid-template-columns: 160px 1fr 160px;
          gap: 20px;
          align-items: center;
        }

        .console-left-panel,
        .console-right-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .console-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .console-left-panel,
          .console-right-panel {
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 768px) {
          .console-left-panel button,
          .console-right-panel button {
            min-width: 120px;
          }
        }
      `}</style>

      {/* GooeyNav */}
      <GooeyNav
        items={[
          { label: 'Shows', href: '#shows' },
          { label: 'Packages', href: '#packages' },
          { label: 'Booking', href: '#booking' },
          { label: 'Reviews', href: '#testimonials' },
          { label: 'AI-STOTLE', href: '#ai-stotle' },
        ]}
        particleCount={20}
        particleDistances={[90, 10]}
        particleR={120}
        initialActiveIndex={0}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />

      {/* AI-STOTLE Modal */}
      <AIStotleModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      {/* Spacer for fixed nav */}
      <div style={{ height: '20px' }}></div>

      {/* Interactive Console Video Section */}
      <section
        style={{
          paddingTop: '60px',
          paddingBottom: '60px',
          padding: '60px 16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '1400px', width: '100%' }}>
          <div className="console-grid">
            {/* LEFT PANEL - Control Buttons */}
            <div className="console-left-panel">
              {[
                { icon: <Star size={18} />, label: 'REVIEWS', color: '#EC4899', action: () => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }) },
                { icon: <Calendar size={18} />, label: 'BOOKINGS', color: '#06B6D4', action: () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) },
                { icon: <Rocket size={18} />, label: 'PACKAGES', color: '#A855F7', action: () => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }) },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={btn.action}
                  style={{
                    padding: '16px 12px',
                    background: `linear-gradient(135deg, ${btn.color}22, ${btn.color}11)`,
                    border: `2px solid ${btn.color}`,
                    borderRadius: '12px',
                    color: btn.color,
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${btn.color}44, ${btn.color}22)`;
                    e.currentTarget.style.boxShadow = `0 0 25px ${btn.color}`;
                    e.currentTarget.style.transform = 'translateX(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${btn.color}22, ${btn.color}11)`;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* LED Indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: btn.color,
                    boxShadow: `0 0 8px ${btn.color}`,
                    animation: 'ledBlink 2s infinite',
                  }} />
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>

            {/* CENTER - Video Console */}
            <div style={{
              position: 'relative',
              padding: '40px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(168, 85, 247, 0.08))',
              borderRadius: '32px',
              border: '3px solid rgba(6, 182, 212, 0.5)',
              boxShadow: '0 0 50px rgba(6, 182, 212, 0.3), inset 0 0 50px rgba(6, 182, 212, 0.05)',
            }}>
              {/* Corner Brackets */}
              {[
                { top: '8px', left: '8px', borderTop: '4px solid #06B6D4', borderLeft: '4px solid #06B6D4' },
                { top: '8px', right: '8px', borderTop: '4px solid #06B6D4', borderRight: '4px solid #06B6D4' },
                { bottom: '8px', left: '8px', borderBottom: '4px solid #06B6D4', borderLeft: '4px solid #06B6D4' },
                { bottom: '8px', right: '8px', borderBottom: '4px solid #06B6D4', borderRight: '4px solid #06B6D4' },
              ].map((style, idx) => (
                <div key={idx} style={{
                  position: 'absolute',
                  width: '50px',
                  height: '50px',
                  ...style,
                }} />
              ))}

              {/* Status Bar */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '70px',
                right: '70px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#06B6D4',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}>
                  [ MAIN VIEWSCREEN ]
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['#10B981', '#06B6D4', '#A855F7'].map((color, idx) => (
                    <div key={idx} style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: color,
                      boxShadow: `0 0 10px ${color}`,
                      animation: `pulse 2s infinite ${idx * 0.3}s`,
                    }} />
                  ))}
                </div>

                <div style={{
                  fontSize: '11px',
                  color: '#10B981',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}>
                  [ ONLINE ]
                </div>
              </div>

              {/* Video */}
              <video
                id="console-video"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <source src="/carls newton.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Scan Line Effect */}
              <div style={{
                position: 'absolute',
                top: '40px',
                left: '40px',
                right: '40px',
                bottom: '40px',
                borderRadius: '16px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(6, 182, 212, 0.03) 50%, transparent 100%)',
                backgroundSize: '100% 4px',
                animation: 'scan 4s linear infinite',
                pointerEvents: 'none',
                zIndex: 2,
              }} />

              {/* Floating Particles */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: i % 2 === 0 ? '#06B6D4' : '#A855F7',
                    boxShadow: `0 0 6px ${i % 2 === 0 ? '#06B6D4' : '#A855F7'}`,
                    top: `${20 + (i * 10)}%`,
                    left: `${5 + (i * 12)}%`,
                    animation: 'particleDrift 4s ease-in-out infinite',
                    animationDelay: `${i * 0.5}s`,
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                />
              ))}
            </div>

            {/* RIGHT PANEL - Advanced Controls */}
            <div className="console-right-panel">
              {[
                { icon: <Sparkles size={18} />, label: 'AI-STOTLE', color: '#10B981', action: () => setIsAIModalOpen(true) },
                { icon: <Clock size={18} />, label: 'MISSION LOG', color: '#F97316', action: () => alert('Mission Log: Coming Soon!') },
                { icon: <Beaker size={18} />, label: 'EXPERIMENTS', color: '#06B6D4', action: () => document.getElementById('shows')?.scrollIntoView({ behavior: 'smooth' }) },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={btn.action}
                  style={{
                    padding: '16px 12px',
                    background: `linear-gradient(135deg, ${btn.color}22, ${btn.color}11)`,
                    border: `2px solid ${btn.color}`,
                    borderRadius: '12px',
                    color: btn.color,
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${btn.color}44, ${btn.color}22)`;
                    e.currentTarget.style.boxShadow = `0 0 25px ${btn.color}`;
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${btn.color}22, ${btn.color}11)`;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* LED Indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: btn.color,
                    boxShadow: `0 0 8px ${btn.color}`,
                    animation: 'ledBlink 2s infinite',
                  }} />
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* BOTTOM PANEL - Video Controls */}
          <div style={{
            marginTop: '24px',
            padding: '20px 32px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '20px',
            border: '2px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            flexWrap: 'wrap',
          }}>
            {/* Sound Control */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{
                  padding: '12px 20px',
                  background: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  border: `2px solid ${isMuted ? '#EF4444' : '#10B981'}`,
                  borderRadius: '10px',
                  color: isMuted ? '#EF4444' : '#10B981',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 20px ${isMuted ? '#EF4444' : '#10B981'}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Volume2 size={16} />
                {isMuted ? 'MUTED' : 'AUDIO ON'}
              </button>

              {/* Level Indicators */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: `${12 + i * 4}px`,
                      background: !isMuted && i < 3 ? '#10B981' : 'rgba(100, 100, 100, 0.3)',
                      borderRadius: '2px',
                      boxShadow: !isMuted && i < 3 ? '0 0 8px #10B981' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Screen Mode */}
            <button
              onClick={() => {
                const video = document.getElementById('console-video') as HTMLVideoElement;
                if (!document.fullscreenElement) {
                  video.requestFullscreen();
                  setIsFullscreen(true);
                } else {
                  document.exitFullscreen();
                  setIsFullscreen(false);
                }
              }}
              style={{
                padding: '12px 20px',
                background: 'rgba(168, 85, 247, 0.2)',
                border: '2px solid #A855F7',
                borderRadius: '10px',
                color: '#A855F7',
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px #A855F7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Maximize size={16} />
              FULLSCREEN
            </button>

            {/* System Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '10px',
            }}>
              <Activity size={16} color="#06B6D4" />
              <span style={{
                fontSize: '11px',
                color: '#06B6D4',
                fontFamily: 'monospace',
              }}>
                SYSTEM NOMINAL
              </span>
            </div>
          </div>
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