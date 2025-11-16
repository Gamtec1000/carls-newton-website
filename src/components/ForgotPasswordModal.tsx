import { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '2px solid rgba(6, 182, 212, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontFamily: "'Aloe Vera Sans', sans-serif",
    letterSpacing: '0.5px',
    outline: 'none',
    transition: 'all 0.3s',
  };

  const inputFocusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = '#06B6D4';
      e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.3)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '40px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)',
          borderRadius: '24px',
          border: '2px solid #A855F7',
          boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid #EF4444',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)';
            e.currentTarget.style.boxShadow = '0 0 20px #EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <X color="#EF4444" size={24} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
            }}
          >
            <Mail size={40} color="white" />
          </div>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              fontFamily: "'Aloe Vera Sans', sans-serif",
              background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '1px',
              marginBottom: '12px',
            }}
          >
            {success ? 'Check Your Email' : 'Forgot Password?'}
          </h2>
          <p
            style={{
              color: '#C4B5FD',
              fontSize: '15px',
              fontFamily: "'Aloe Vera Sans', sans-serif",
              lineHeight: '1.6',
            }}
          >
            {success
              ? "We've sent you a password reset link. Please check your email and follow the instructions to reset your password."
              : "No worries! Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #EF4444',
              borderRadius: '8px',
              color: '#EF4444',
              fontFamily: "'Aloe Vera Sans', sans-serif",
              marginBottom: '20px',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
            }}
          >
            {error}
          </div>
        )}

        {/* Success State */}
        {success ? (
          <div>
            <div
              style={{
                padding: '20px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10B981',
                borderRadius: '12px',
                marginBottom: '24px',
              }}
            >
              <p
                style={{
                  color: '#10B981',
                  fontSize: '14px',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                  lineHeight: '1.6',
                  marginBottom: '12px',
                }}
              >
                ✅ Password reset email sent successfully!
              </p>
              <p
                style={{
                  color: '#C4B5FD',
                  fontSize: '13px',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                  lineHeight: '1.5',
                }}
              >
                <strong>Next steps:</strong>
                <br />
                1. Check your inbox for an email from Carls Newton
                <br />
                2. Click the "Reset Password" link in the email
                <br />
                3. Enter your new password on the reset page
                <br />
                <br />
                <em>Didn't receive the email? Check your spam folder or try again.</em>
              </p>
            </div>

            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
                border: 'none',
                borderRadius: '25px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: "'Aloe Vera Sans', sans-serif",
                letterSpacing: '1.5px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(6, 182, 212, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
              }}
            >
              GOT IT!
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                autoFocus
                style={inputStyle}
                {...inputFocusHandlers}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 32px',
                background: loading
                  ? 'rgba(6, 182, 212, 0.3)'
                  : 'linear-gradient(135deg, #06B6D4, #A855F7)',
                border: 'none',
                borderRadius: '25px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: "'Aloe Vera Sans', sans-serif",
                letterSpacing: '1.5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(6, 182, 212, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
              }}
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>

            <div
              style={{
                textAlign: 'center',
                fontSize: '14px',
                fontFamily: "'Aloe Vera Sans', sans-serif",
                color: '#C4B5FD',
              }}
            >
              Remember your password?{' '}
              <span
                onClick={handleClose}
                style={{
                  color: '#06B6D4',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                }}
              >
                Back to Sign In
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
