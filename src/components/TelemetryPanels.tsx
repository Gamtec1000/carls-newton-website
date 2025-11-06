import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function TelemetryPanels() {
  const [missionTime, setMissionTime] = useState(9257); // seconds

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

  return (
    <>
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

      {/* CENTER-BOTTOM: Mission Clock */}
      <div
        className="telemetry-panel"
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(15px)',
          borderRadius: '12px',
          border: '2px solid #10B981',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(16, 185, 129, 0.1)',
          zIndex: 10,
        }}
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
    </>
  );
}
