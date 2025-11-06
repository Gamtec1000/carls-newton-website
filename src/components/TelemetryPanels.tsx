import { useState, useEffect } from 'react';
import { Wind, Thermometer, Zap, Fuel, Navigation, Clock, X } from 'lucide-react';

interface TelemetryDetail {
  title: string;
  content: string;
  color: string;
}

export default function TelemetryPanels() {
  const [missionTime, setMissionTime] = useState(9257); // seconds
  const [selectedPanel, setSelectedPanel] = useState<TelemetryDetail | null>(null);
  const [warpClicks, setWarpClicks] = useState(0);
  const [showWarpMessage, setShowWarpMessage] = useState(false);

  // Mission clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setMissionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format mission time as T+ HH:MM:SS
  const formatMissionTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `T+ ${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePowerCoreClick = () => {
    setWarpClicks((prev) => prev + 1);
    if (warpClicks + 1 === 3) {
      setShowWarpMessage(true);
      setTimeout(() => setShowWarpMessage(false), 3000);
      setWarpClicks(0);
    }
  };

  const openPanel = (detail: TelemetryDetail) => {
    setSelectedPanel(detail);
  };

  return (
    <div className="telemetry-container">
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes liquidSlosh {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-2px) scaleY(1.05); }
        }
        @keyframes energyPulse {
          0%, 100% {
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
            transform: scale(1.05);
          }
        }
        @keyframes colonBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes valueFlicker {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.8; }
        }
        @keyframes barGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes steamRise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-30px) scale(0.5); opacity: 0; }
        }
        @keyframes glitchWarp {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-5px, 2px); }
          40% { transform: translate(3px, -2px); }
          60% { transform: translate(-2px, -3px); }
          80% { transform: translate(2px, 3px); }
        }
        @keyframes scanPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        .telemetry-panel {
          transition: all 0.3s;
        }
        .telemetry-panel:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
        }
      `}</style>

      {/* Warp Drive Message */}
      {showWarpMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10000,
            padding: '32px 48px',
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            border: '3px solid #FCA5A5',
            borderRadius: '16px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            textAlign: 'center',
            boxShadow: '0 0 60px rgba(239, 68, 68, 0.8)',
            animation: 'glitchWarp 0.2s infinite',
          }}
        >
          ⚠️ WARP DRIVE: NOT AVAILABLE<br />IN THIS DIMENSION ⚠️
        </div>
      )}

      {/* Detail Modal */}
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
              <X size={20} color="#EF4444" />
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

      {/* TOP-LEFT: Life Support */}
      <div
        className="telemetry-panel"
        style={{
          position: 'absolute',
          top: '80px',
          left: '20px',
          width: '180px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '2px solid #06B6D4',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={() =>
          openPanel({
            title: '[ LIFE SUPPORT ]',
            content:
              'Oxygen Level: 95.3%\nStatus: NOMINAL\n\nCO₂ scrubbers operating at peak efficiency. Cabin atmosphere composition within acceptable parameters.\n\nNext maintenance: T+ 48:00:00',
            color: '#06B6D4',
          })
        }
      >
        <div style={{ fontSize: '9px', color: '#06B6D4', fontFamily: 'monospace', marginBottom: '8px' }}>
          [ SYS-01 LIFE SUPPORT ]
        </div>

        {/* LED */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 10px #10B981',
            animation: 'scanPulse 2s infinite',
          }}
        />

        {/* Oxygen */}
        <div style={{ marginBottom: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
            }}
          >
            <Wind size={14} color="#06B6D4" style={{ animation: 'breathe 3s infinite' }} />
            <span style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace' }}>O₂ LEVEL</span>
          </div>
          <div
            style={{
              height: '8px',
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
                animation: 'barGlow 2s infinite, valueFlicker 3s infinite',
                boxShadow: '0 0 10px #06B6D4',
              }}
            />
          </div>
          <div style={{ fontSize: '13px', color: '#06B6D4', fontFamily: 'monospace', marginTop: '4px' }}>
            95.3%
          </div>
        </div>

        {/* CO2 Scrubbers */}
        <div>
          <div style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace', marginBottom: '4px' }}>
            CO₂ SCRUBBERS
          </div>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '6px',
                  background: '#10B981',
                  borderRadius: '2px',
                  animation: `barGlow 1s infinite ${i * 0.2}s`,
                  boxShadow: '0 0 4px #10B981',
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: '10px', color: '#10B981', fontFamily: 'monospace' }}>NOMINAL • 0.04%</div>
        </div>
      </div>

      {/* TOP-RIGHT: Environmental */}
      <div
        className="telemetry-panel"
        style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          width: '180px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '2px solid #A855F7',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={() =>
          openPanel({
            title: '[ ENVIRONMENTAL ]',
            content:
              'Cabin Temperature: 22.1°C\nStatus: OPTIMAL\n\nThermal control system maintaining comfortable cabin environment. Microgravity conditions stable.\n\nGravity: 0.00 G (Freefall)',
            color: '#A855F7',
          })
        }
      >
        <div style={{ fontSize: '9px', color: '#A855F7', fontFamily: 'monospace', marginBottom: '8px' }}>
          [ ENV-02 ENVIRONMENTAL ]
        </div>

        {/* LED */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 10px #10B981',
            animation: 'scanPulse 2s infinite 0.5s',
          }}
        />

        {/* Temperature */}
        <div style={{ marginBottom: '12px', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
            }}
          >
            <Thermometer size={14} color="#A855F7" />
            <span style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace' }}>CABIN TEMP</span>
          </div>
          <div
            style={{
              height: '8px',
              background: 'rgba(168, 85, 247, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '73%',
                height: '100%',
                background: 'linear-gradient(90deg, #3B82F6, #A855F7)',
                borderRadius: '4px',
                animation: 'barGlow 3s infinite',
                boxShadow: '0 0 10px #A855F7',
              }}
            />
          </div>
          <div style={{ fontSize: '13px', color: '#A855F7', fontFamily: 'monospace', marginTop: '4px' }}>
            22.1°C
          </div>

          {/* Steam particles */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '10px',
                right: `${10 + i * 8}px`,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#A855F7',
                opacity: 0,
                animation: `steamRise 2s infinite ${i * 0.7}s`,
              }}
            />
          ))}
        </div>

        {/* Gravity */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace', marginBottom: '4px' }}>
            GRAVITY
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
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid #A855F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#A855F7',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                position: 'relative',
              }}
            >
              0.0
              {/* Floating particles */}
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: '#A855F7',
                    boxShadow: '0 0 4px #A855F7',
                    top: `${10 + i * 8}px`,
                    right: `${-10 + i * 6}px`,
                    animation: `float 3s infinite ${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '9px', color: '#A855F7', fontFamily: 'monospace', textAlign: 'right' }}>
              MICROGRAVITY<br />MODE
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM-LEFT: Fuel & Power */}
      <div
        className="telemetry-panel"
        style={{
          position: 'absolute',
          bottom: '180px',
          left: '20px',
          width: '180px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '2px solid #F97316',
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={() =>
          openPanel({
            title: '[ FUEL & POWER ]',
            content:
              'Fuel Reserves: 70.2%\nPower Core: 98.7%\nStatus: OPTIMAL\n\nAll systems receiving adequate power. Fuel consumption within expected parameters.\n\nEstimated reserve time: 127 hours',
            color: '#F97316',
          })
        }
      >
        <div style={{ fontSize: '9px', color: '#F97316', fontFamily: 'monospace', marginBottom: '8px' }}>
          [ PWR-03 FUEL & POWER ]
        </div>

        {/* LED */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 10px #10B981',
            animation: 'scanPulse 2s infinite 1s',
          }}
        />

        {/* Fuel Reserves */}
        <div style={{ marginBottom: '12px', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
            }}
          >
            <Fuel size={14} color="#F97316" />
            <span style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace' }}>FUEL RESERVES</span>
          </div>

          <div
            style={{
              height: '40px',
              width: '60px',
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
                animation: 'liquidSlosh 2s infinite',
                boxShadow: '0 0 10px #06B6D4',
              }}
            />
            {/* Bubbles */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: `${15 + i * 15}px`,
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.6)',
                  animation: `bubble 3s infinite ${i * 0.8}s`,
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: '13px', color: '#F97316', fontFamily: 'monospace', marginTop: '4px', textAlign: 'center' }}>
            ⛽ 70.2%
          </div>
        </div>

        {/* Power Core */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace', marginBottom: '4px' }}>
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
              onClick={(e) => {
                e.stopPropagation();
                handlePowerCoreClick();
              }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid #F97316',
                background: 'radial-gradient(circle, #F97316, #EA580C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                animation: 'energyPulse 2s infinite',
                cursor: 'pointer',
              }}
            >
              <Zap size={16} color="white" />
              {/* Sparkles */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '3px',
                    height: '3px',
                    background: '#FCD34D',
                    top: `${-5 + Math.sin((i * Math.PI * 2) / 5) * 20}px`,
                    left: `${16 + Math.cos((i * Math.PI * 2) / 5) * 20}px`,
                    borderRadius: '50%',
                    animation: `sparkle 1.5s infinite ${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '13px', color: '#F97316', fontFamily: 'monospace', textAlign: 'right' }}>
              ⚡ 98.7%<br />
              <span style={{ fontSize: '9px' }}>OPTIMAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM-RIGHT: Navigation */}
      <div
        className="telemetry-panel"
        style={{
          position: 'absolute',
          bottom: '180px',
          right: '20px',
          width: '180px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '2px solid #06B6D4',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={() =>
          openPanel({
            title: '[ NAVIGATION ]',
            content:
              'Altitude: 408 KM\nVelocity: 27,600 KM/H\nStatus: STABLE ORBIT\n\nMaintaining Low Earth Orbit (LEO). Orbital path nominal. No course corrections required.\n\nNext orbit: 92 minutes',
            color: '#06B6D4',
          })
        }
      >
        <div style={{ fontSize: '9px', color: '#06B6D4', fontFamily: 'monospace', marginBottom: '8px' }}>
          [ NAV-04 NAVIGATION ]
        </div>

        {/* LED */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 10px #10B981',
            animation: 'scanPulse 2s infinite 1.5s',
          }}
        />

        {/* Altitude */}
        <div style={{ marginBottom: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '4px',
            }}
          >
            <Navigation size={14} color="#06B6D4" />
            <span style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace' }}>ALTITUDE</span>
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#06B6D4',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              animation: 'valueFlicker 4s infinite',
            }}
          >
            408
            <span style={{ fontSize: '12px', marginLeft: '4px' }}>KM</span>
          </div>
          <div style={{ fontSize: '9px', color: '#10B981', fontFamily: 'monospace' }}>↑ STABLE ORBIT</div>
        </div>

        {/* Velocity */}
        <div>
          <div style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace', marginBottom: '4px' }}>
            VELOCITY
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#06B6D4',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              animation: 'valueFlicker 3s infinite',
            }}
          >
            27,600
            <span style={{ fontSize: '10px', marginLeft: '4px' }}>KM/H</span>
          </div>
          <div
            style={{
              height: '4px',
              background: 'rgba(6, 182, 212, 0.2)',
              borderRadius: '2px',
              marginTop: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '85%',
                height: '100%',
                background: '#06B6D4',
                borderRadius: '2px',
                animation: 'barGlow 1.5s infinite',
                boxShadow: '0 0 8px #06B6D4',
              }}
            />
          </div>
        </div>
      </div>

      {/* CENTER-BOTTOM: Mission Clock */}
      <div
        className="telemetry-panel"
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '2px solid #10B981',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={() =>
          openPanel({
            title: '[ MISSION CLOCK ]',
            content: `Mission Elapsed Time: ${formatMissionTime(missionTime)}\n\nContinuous operation since launch. All mission phases proceeding nominally.\n\nMission Status: ACTIVE`,
            color: '#10B981',
          })
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="#10B981" />
          <div style={{ fontSize: '9px', color: '#10B981', fontFamily: 'monospace' }}>MISSION ELAPSED TIME</div>
        </div>
        <div
          style={{
            fontSize: '20px',
            color: '#10B981',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            marginTop: '4px',
            letterSpacing: '2px',
          }}
        >
          {formatMissionTime(missionTime).split(':').map((part, idx, arr) => (
            <span key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <span style={{ animation: 'colonBlink 1s infinite' }}>:</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
