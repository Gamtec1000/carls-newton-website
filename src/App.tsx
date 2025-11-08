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
  Wind,
  Fuel,
  Zap,
  Thermometer,
  Navigation,
} from 'lucide-react';
import EnhancedBookingCalendar from './components/EnhancedBookingCalendar';
import GooeyNav from './components/GooeyNav';
import AIStotleModal from './components/AIStotleModal';
import TelemetryPanels from './components/TelemetryPanels';
import AuthModal from './components/AuthModal';

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedPanel, setSelectedPanel] = useState<{title: string, content: string, color: string} | null>(null);

  const openPanel = (detail: {title: string, content: string, color: string}) => {
    setSelectedPanel(detail);
  };

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
          gap: 24px;
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

        /* Telemetry responsive styles */
        @media (max-width: 1024px) {
          .telemetry-panel {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            transform: none !important;
            width: 100% !important;
            max-width: 300px;
            margin: 8px auto !important;
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
          { label: 'AI-STOTLE', href: '#ai-stotle', onClick: () => setIsAIModalOpen(true) },
        ]}
        particleCount={20}
        particleDistances={[90, 10]}
        particleR={120}
        initialActiveIndex={0}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />

      {/* AI-STOTLE Modal */}
      <AIStotleModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Telemetry Detail Modal */}
      {selectedPanel && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedPanel(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '32px',
              background: 'linear-gradient(180deg, #1e1b4b 0%, #1e3a8a 100%)',
              borderRadius: '24px',
              border: `3px solid ${selectedPanel.color}`,
              boxShadow: `0 0 60px ${selectedPanel.color}`,
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPanel(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid #EF4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#EF4444', fontSize: '20px' }}>×</span>
            </button>

            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: selectedPanel.color,
                marginBottom: '16px',
                fontFamily: 'monospace',
              }}
            >
              {selectedPanel.title}
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: '#C4B5FD',
                lineHeight: '1.6',
                whiteSpace: 'pre-line',
              }}
            >
              {selectedPanel.content}
            </p>
          </div>
        </div>
      )}

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
            {/* LEFT PANEL - Telemetry + Control Buttons */}
            <div className="console-left-panel">
              {/* Life Support Telemetry */}
              <div
                onClick={() =>
                  openPanel({
                    title: '[ LIFE SUPPORT ]',
                    content:
                      'Oxygen Level: 95.3%\nStatus: NOMINAL\n\nCO₂ scrubbers operating at peak efficiency. Cabin atmosphere composition within acceptable parameters.\n\nNext maintenance: T+ 48:00:00',
                    color: '#06B6D4',
                  })
                }
                style={{
                  width: '100%',
                  minHeight: '220px',
                  padding: '24px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '12px',
                  border: '2px solid #06B6D4',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.1)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.filter = 'brightness(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                <div style={{ fontSize: '11px', color: '#06B6D4', fontFamily: 'monospace', marginBottom: '12px' }}>
                  [ SYS-01 LIFE SUPPORT ]
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Wind size={18} color="#06B6D4" style={{ animation: 'pulse 3s infinite' }} />
                    <span style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace' }}>O₂ LEVEL</span>
                  </div>
                  <div
                    style={{
                      height: '12px',
                      background: 'rgba(6, 182, 212, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: '95%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #06B6D4, #0EA5E9)',
                        borderRadius: '4px',
                        boxShadow: '0 0 10px #06B6D4',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '16px', color: '#06B6D4', fontFamily: 'monospace', marginTop: '6px' }}>
                    95.3%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace', marginBottom: '6px' }}>
                    CO₂ SCRUBBERS
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: '8px',
                          background: '#10B981',
                          borderRadius: '2px',
                          boxShadow: '0 0 4px #10B981',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#10B981', fontFamily: 'monospace' }}>NOMINAL • 0.04%</div>
                </div>
              </div>

              {/* Fuel & Power Telemetry */}
              <div
                onClick={() =>
                  openPanel({
                    title: '[ FUEL & POWER ]',
                    content:
                      'Fuel Reserves: 70.2%\nPower Core: 98.7%\nStatus: OPTIMAL\n\nAll systems receiving adequate power. Fuel consumption within expected parameters.\n\nEstimated reserve time: 127 hours',
                    color: '#F97316',
                  })
                }
                style={{
                  width: '100%',
                  minHeight: '220px',
                  padding: '24px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '12px',
                  border: '2px solid #F97316',
                  boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), inset 0 0 20px rgba(249, 115, 22, 0.1)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.filter = 'brightness(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                <div style={{ fontSize: '11px', color: '#F97316', fontFamily: 'monospace', marginBottom: '12px' }}>
                  [ PWR-03 FUEL & POWER ]
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                    animation: 'pulse 2s infinite 1s',
                  }}
                />
                <div style={{ marginBottom: '16px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Fuel size={18} color="#F97316" />
                    <span style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace' }}>FUEL RESERVES</span>
                  </div>
                  <div
                    style={{
                      height: '50px',
                      width: '70px',
                      background: 'rgba(249, 115, 22, 0.2)',
                      borderRadius: '6px',
                      border: '2px solid #F97316',
                      position: 'relative',
                      overflow: 'hidden',
                      margin: '0 auto',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '70%',
                        background: 'linear-gradient(180deg, #3B82F6, #06B6D4)',
                        boxShadow: '0 0 10px #06B6D4',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '16px', color: '#F97316', fontFamily: 'monospace', marginTop: '6px', textAlign: 'center' }}>
                    ⛽ 70.2%
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace', marginBottom: '6px' }}>
                    POWER CORE
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid #F97316',
                        background: 'radial-gradient(circle, #F97316, #EA580C)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                    >
                      <Zap size={20} color="white" />
                    </div>
                    <div style={{ fontSize: '16px', color: '#F97316', fontFamily: 'monospace', textAlign: 'right' }}>
                      ⚡ 98.7%<br />
                      <span style={{ fontSize: '11px' }}>OPTIMAL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER - Video Console */}
            <div style={{
              position: 'relative',
              padding: '40px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(168, 85, 247, 0.08))',
              borderRadius: '32px',
              border: '3px solid rgba(6, 182, 212, 0.5)',
              boxShadow: '0 0 50px rgba(6, 182, 212, 0.3), inset 0 0 50px rgba(6, 182, 212, 0.05)',
              zIndex: 1,
            }}>
              {/* Telemetry Panels */}
              <TelemetryPanels />
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
                  zIndex: 5,
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
                zIndex: 5,
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
                  zIndex: 2,
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

            {/* RIGHT PANEL - Telemetry + Advanced Controls */}
            <div className="console-right-panel">
              {/* Environmental Telemetry */}
              <div
                onClick={() =>
                  openPanel({
                    title: '[ ENVIRONMENTAL ]',
                    content:
                      'Cabin Temperature: 22.1°C\nStatus: OPTIMAL\n\nThermal control system maintaining comfortable cabin environment. Microgravity conditions stable.\n\nGravity: 0.00 G (Freefall)',
                    color: '#A855F7',
                  })
                }
                style={{
                  width: '100%',
                  minHeight: '220px',
                  padding: '24px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '12px',
                  border: '2px solid #A855F7',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(168, 85, 247, 0.1)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.filter = 'brightness(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                <div style={{ fontSize: '11px', color: '#A855F7', fontFamily: 'monospace', marginBottom: '12px' }}>
                  [ ENV-02 ENVIRONMENTAL ]
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                    animation: 'pulse 2s infinite 0.5s',
                  }}
                />
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Thermometer size={18} color="#A855F7" />
                    <span style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace' }}>CABIN TEMP</span>
                  </div>
                  <div
                    style={{
                      height: '12px',
                      background: 'rgba(168, 85, 247, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '73%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #3B82F6, #A855F7)',
                        borderRadius: '4px',
                        boxShadow: '0 0 10px #A855F7',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '16px', color: '#A855F7', fontFamily: 'monospace', marginTop: '6px' }}>
                    22.1°C
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace', marginBottom: '6px' }}>
                    GRAVITY
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid #A855F7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#A855F7',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                      }}
                    >
                      0.0
                    </div>
                    <div style={{ fontSize: '11px', color: '#A855F7', fontFamily: 'monospace', textAlign: 'right' }}>
                      MICROGRAVITY<br />MODE
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Telemetry */}
              <div
                onClick={() =>
                  openPanel({
                    title: '[ NAVIGATION ]',
                    content:
                      'Altitude: 408 KM\nVelocity: 27,600 KM/H\nStatus: STABLE ORBIT\n\nMaintaining Low Earth Orbit (LEO). Orbital path nominal. No course corrections required.\n\nNext orbit: 92 minutes',
                    color: '#06B6D4',
                  })
                }
                style={{
                  width: '100%',
                  minHeight: '220px',
                  padding: '24px',
                  background: 'rgba(0, 0, 0, 0.85)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '12px',
                  border: '2px solid #06B6D4',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 20px rgba(6, 182, 212, 0.1)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.filter = 'brightness(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                <div style={{ fontSize: '11px', color: '#06B6D4', fontFamily: 'monospace', marginBottom: '12px' }}>
                  [ NAV-04 NAVIGATION ]
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                    animation: 'pulse 2s infinite 1.5s',
                  }}
                />
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Navigation size={18} color="#06B6D4" />
                    <span style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace' }}>ALTITUDE</span>
                  </div>
                  <div style={{ fontSize: '28px', color: '#06B6D4', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    408
                    <span style={{ fontSize: '14px', marginLeft: '4px' }}>KM</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#10B981', fontFamily: 'monospace' }}>↑ STABLE ORBIT</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace', marginBottom: '6px' }}>
                    VELOCITY
                  </div>
                  <div style={{ fontSize: '22px', color: '#06B6D4', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    27,600
                    <span style={{ fontSize: '12px', marginLeft: '4px' }}>KM/H</span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      background: 'rgba(6, 182, 212, 0.2)',
                      borderRadius: '2px',
                      marginTop: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '85%',
                        height: '100%',
                        background: '#06B6D4',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px #06B6D4',
                      }}
                    />
                  </div>
                </div>
              </div>
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
            position: 'relative',
            zIndex: 10,
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
                } else {
                  document.exitFullscreen();
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
              {
                name: 'Custom Project',
                duration: 'School-Wide Events',
                price: '8,000+',
                features: [
                  'Science Fair Support',
                  'Expert Guidance & Consultation',
                  'Materials & Experiments',
                  'Training Sessions',
                  'Curriculum Alignment',
                  'Best Experience Guarantee',
                ],
                premium: true,
                description: 'Perfect for school-wide science fairs, STEM weeks, large events',
              },
            ].map((pkg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.card,
                  border: pkg.popular
                    ? '2px solid #06B6D4'
                    : pkg.premium
                    ? '2px solid #FBBF24'
                    : '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (pkg.premium) {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
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
                {pkg.premium && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      right: '32px',
                      background: 'linear-gradient(135deg, #FBBF24, #F97316)',
                      padding: '4px 16px',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 0 15px rgba(251, 191, 36, 0.5)',
                    }}
                  >
                    ⭐ Premium
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
                <p style={{ color: '#C4B5FD', marginBottom: pkg.description ? '8px' : '16px' }}>
                  {pkg.duration}
                </p>
                {pkg.description && (
                  <p style={{ color: '#A78BFA', marginBottom: '16px', fontSize: '14px', fontStyle: 'italic' }}>
                    {pkg.description}
                  </p>
                )}
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 'bold' }}>
                    {pkg.premium ? 'From د.إ ' : 'د.إ '}{pkg.price}
                  </span>
                  {pkg.price !== 'Custom' && !pkg.premium && (
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
                        color={pkg.premium ? '#FBBF24' : '#06B6D4'}
                        style={{ flexShrink: 0, marginTop: '2px' }}
                      />
                      <span style={{ color: '#C4B5FD' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    ...(pkg.popular ? styles.button : pkg.premium ? {
                      background: 'linear-gradient(135deg, #FBBF24, #F97316)',
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
                      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
                    } : styles.buttonSecondary),
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (pkg.premium) {
                      e.currentTarget.style.boxShadow = '0 6px 25px rgba(251, 191, 36, 0.5)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pkg.premium) {
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {pkg.premium ? 'Get Custom Quote' : 'Learn More'}
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