import { useEffect, useState } from 'react';
import { X, Rocket, Calendar, User, Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  firstName: string;
  onClose: () => void;
  show: boolean;
}

export default function WelcomeModal({ firstName, onClose, show }: WelcomeModalProps) {
  const [confettiParticles, setConfettiParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#06B6D4', '#A855F7', '#EC4899', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.5,
      }));
      setConfettiParticles(particles);
    }
  }, [show]);

  const handleStartBooking = () => {
    onClose();
    // Scroll to booking section on the main page
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease-out',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          width: '90%',
          maxWidth: '600px',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.98), rgba(49, 46, 129, 0.98))',
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(135deg, rgba(30, 27, 75, 0.98), rgba(49, 46, 129, 0.98)), linear-gradient(135deg, #06B6D4, #A855F7, #EC4899)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
          animation: 'slideInUp 0.5s ease-out',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s',
            width: '36px',
            height: '36px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Close welcome modal"
        >
          <X size={20} />
        </button>

        {/* Confetti Animation */}
        {confettiParticles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: '8px',
              height: '8px',
              background: particle.color,
              borderRadius: '50%',
              animation: `confettiFall 3s ease-out ${particle.delay}s`,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Logo */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
              borderRadius: '50%',
              marginBottom: '16px',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <Rocket size={40} color="white" />
          </div>
        </div>

        {/* Welcome Text */}
        <h2
          style={{
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: 'white',
            fontFamily: "'Aloe Vera Sans', sans-serif",
          }}
        >
          🎉 Welcome, {firstName}! 🎉
        </h2>

        <p
          style={{
            textAlign: 'center',
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '12px',
            fontFamily: "'Aloe Vera Sans', sans-serif",
          }}
        >
          Your email has been confirmed!
        </p>

        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '32px',
            fontFamily: "'Aloe Vera Sans', sans-serif",
          }}
        >
          Your account is now fully activated.
        </p>

        {/* Features Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
              textAlign: 'center',
              fontFamily: "'Aloe Vera Sans', sans-serif",
            }}
          >
            What You Can Do Now:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Calendar size={18} color="white" />
              </div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '15px',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                }}
              >
                Book science shows for your school
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={18} color="white" />
              </div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '15px',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                }}
              >
                View your booking history
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #EC4899, #F59E0B)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={18} color="white" />
              </div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '15px',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                }}
              >
                Manage your profile settings
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            fontFamily: "'Aloe Vera Sans', sans-serif",
          }}
        >
          Ready to bring science to life?
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '14px 28px',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              fontFamily: "'Aloe Vera Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Maybe Later
          </button>

          <button
            onClick={handleStartBooking}
            style={{
              background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
              padding: '14px 28px',
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
              fontFamily: "'Aloe Vera Sans', sans-serif",
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(168, 85, 247, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.4)';
            }}
          >
            Start Booking
            <Rocket size={18} />
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            transform: translate(-50%, -40%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes confettiFall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(300px) rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px 10px rgba(168, 85, 247, 0);
          }
        }
      `}</style>
    </>
  );
}
