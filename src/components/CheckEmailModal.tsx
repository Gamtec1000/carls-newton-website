import { useEffect, useState } from 'react';
import { X, Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CheckEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  firstName: string;
}

export default function CheckEmailModal({
  isOpen,
  onClose,
  email,
  firstName,
}: CheckEmailModalProps) {
  const [countdown, setCountdown] = useState(6);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  // Auto-close timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleClose = () => {
    setCountdown(6);
    setResendSuccess(false);
    setResendError('');
    onClose();
  };

  const handleResendEmail = async () => {
    setResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setResendSuccess(true);
      setCountdown(6); // Reset countdown

      // Clear success message after 3 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Resend email error:', error);
      setResendError(error.message || 'Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  // Truncate first name if too long
  const displayName = firstName.length > 15 ? firstName.substring(0, 15) + '...' : firstName;

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
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease-out',
        }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="check-email-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10001,
          width: '90%',
          maxWidth: '500px',
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98), rgba(45, 36, 64, 0.98))',
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98), rgba(45, 36, 64, 0.98)), linear-gradient(135deg, #d946ef, #06b6d4)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(217, 70, 239, 0.3)',
          animation: 'modalEnter 0.3s ease-out',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
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
        >
          <X size={20} />
        </button>

        {/* Icon */}
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
              background: 'linear-gradient(135deg, #d946ef, #06b6d4)',
              borderRadius: '50%',
              marginBottom: '16px',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <Mail size={40} color="white" />
          </div>
          <div style={{ fontSize: '32px', marginTop: '8px' }}>🚀✨</div>
        </div>

        {/* Title */}
        <h2
          id="check-email-title"
          style={{
            textAlign: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: 'white',
            fontFamily: "'Aloe Vera Sans', sans-serif",
            background: 'linear-gradient(135deg, #d946ef, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {firstName ? `Almost There, ${displayName}! 📧` : 'Almost There! 📧'}
        </h2>

        {/* Body Text */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '20px',
            fontFamily: "'Aloe Vera Sans', sans-serif",
            lineHeight: '1.6',
          }}
        >
          We've sent a confirmation email to:
        </p>

        {/* Email Display */}
        <div
          style={{
            background: 'rgba(6, 182, 212, 0.1)',
            border: '2px solid #06b6d4',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#06b6d4',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: "'Aloe Vera Sans', sans-serif",
              wordBreak: 'break-word',
            }}
            title={email}
          >
            {email}
          </div>
        </div>

        {/* Instructions */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '16px',
            fontFamily: "'Aloe Vera Sans', sans-serif",
            lineHeight: '1.6',
          }}
        >
          Please check your inbox and click the confirmation link to activate your account.
        </p>

        {/* Timer Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px',
            padding: '12px',
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '12px',
          }}
        >
          <Clock size={18} color="#06b6d4" />
          <span
            style={{
              color: '#06b6d4',
              fontSize: '14px',
              fontFamily: "'Aloe Vera Sans', sans-serif",
            }}
          >
            This usually takes less than a minute
          </span>
        </div>

        {/* Tips Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '12px',
              fontFamily: "'Aloe Vera Sans', sans-serif",
            }}
          >
            📌 Tips:
          </div>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              color: '#9ca3af',
              fontFamily: "'Aloe Vera Sans', sans-serif",
              lineHeight: '1.8',
            }}
          >
            <li style={{ marginBottom: '8px' }}>• Check your spam/junk folder</li>
            <li style={{ marginBottom: '8px' }}>• Look for email from noreply@carlsnewton.com</li>
            <li>• Add us to your contacts</li>
          </ul>
        </div>

        {/* Resend Success Message */}
        {resendSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '8px',
              marginBottom: '16px',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <CheckCircle size={18} color="#10b981" />
            <span
              style={{
                color: '#10b981',
                fontSize: '14px',
                fontFamily: "'Aloe Vera Sans', sans-serif",
              }}
            >
              ✅ Email resent! Check your inbox.
            </span>
          </div>
        )}

        {/* Resend Error Message */}
        {resendError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '8px',
              marginBottom: '16px',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            <AlertCircle size={18} color="#ef4444" />
            <span
              style={{
                color: '#ef4444',
                fontSize: '14px',
                fontFamily: "'Aloe Vera Sans', sans-serif",
              }}
            >
              {resendError}
            </span>
          </div>
        )}

        {/* Resend Button */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '12px',
              fontFamily: "'Aloe Vera Sans', sans-serif",
            }}
          >
            Didn't receive it?
          </p>
          <button
            onClick={handleResendEmail}
            disabled={resending}
            style={{
              background: 'transparent',
              border: '2px solid #06b6d4',
              color: '#06b6d4',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: resending ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              fontFamily: "'Aloe Vera Sans', sans-serif",
              opacity: resending ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!resending) {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!resending) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {resending ? 'Sending...' : 'Resend Email'}
          </button>
        </div>

        {/* Countdown */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: "'Aloe Vera Sans', sans-serif",
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          Auto-closing in {countdown} second{countdown !== 1 ? 's' : ''}...
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

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) translateY(0);
          }
        }

        @keyframes modalExit {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(217, 70, 239, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px 10px rgba(217, 70, 239, 0);
          }
        }
      `}</style>
    </>
  );
}
