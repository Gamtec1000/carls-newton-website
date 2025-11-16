import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if we have a valid recovery token in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (type === 'recovery' && accessToken) {
      setValidToken(true);
    } else {
      setValidToken(false);
      setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 8) return { strength: 1, label: 'Weak', color: '#EF4444' };

    let strength = 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength === 2) return { strength: 2, label: 'Fair', color: '#F97316' };
    if (strength === 3) return { strength: 3, label: 'Good', color: '#FBBF24' };
    if (strength === 4) return { strength: 4, label: 'Strong', color: '#10B981' };
    return { strength: 1, label: 'Weak', color: '#EF4444' };
  };

  const passwordStrength = getPasswordStrength(password);

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
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
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <img
            src="/carls-newton-logo.png"
            alt="Carls Newton Logo"
            style={{
              height: '100px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: success
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #06B6D4, #A855F7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: success
                ? '0 0 30px rgba(16, 185, 129, 0.4)'
                : '0 0 30px rgba(6, 182, 212, 0.4)',
            }}
          >
            {success ? <CheckCircle size={40} color="white" /> : <Lock size={40} color="white" />}
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              fontFamily: "'Aloe Vera Sans', sans-serif",
              background: success
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #06B6D4, #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '1px',
              marginBottom: '12px',
            }}
          >
            {success ? 'Password Reset Successful!' : 'Reset Your Password'}
          </h1>
          <p
            style={{
              color: '#C4B5FD',
              fontSize: '15px',
              fontFamily: "'Aloe Vera Sans', sans-serif",
              lineHeight: '1.6',
            }}
          >
            {success
              ? 'Your password has been updated successfully. You will be redirected to the homepage shortly.'
              : 'Enter your new password below to reset your account password.'}
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
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: '#10B981',
                  fontSize: '16px',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                  lineHeight: '1.6',
                  marginBottom: '12px',
                }}
              >
                ✅ Your password has been changed successfully!
              </p>
              <p
                style={{
                  color: '#C4B5FD',
                  fontSize: '14px',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                }}
              >
                You can now sign in with your new password.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: 'none',
                borderRadius: '25px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: "'Aloe Vera Sans', sans-serif",
                letterSpacing: '1.5px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
              }}
            >
              GO TO HOMEPAGE
            </button>
          </div>
        ) : validToken === false ? (
          /* Invalid Token State */
          <div>
            <button
              onClick={() => navigate('/')}
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
              GO TO HOMEPAGE
            </button>
          </div>
        ) : validToken === true ? (
          /* Form State */
          <form onSubmit={handleSubmit}>
            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  autoFocus
                  style={{ ...inputStyle, paddingRight: '50px' }}
                  {...inputFocusHandlers}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#06B6D4',
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: '8px' }}>
                  <div
                    style={{
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(passwordStrength.strength / 4) * 100}%`,
                        height: '100%',
                        background: passwordStrength.color,
                        transition: 'all 0.3s',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontFamily: "'Aloe Vera Sans', sans-serif",
                      color: passwordStrength.color,
                      marginTop: '4px',
                    }}
                  >
                    Password Strength: {passwordStrength.label}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  required
                  style={{
                    ...inputStyle,
                    paddingRight: '50px',
                    borderColor:
                      confirmPassword && password !== confirmPassword
                        ? '#EF4444'
                        : 'rgba(6, 182, 212, 0.3)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      confirmPassword && password !== confirmPassword ? '#EF4444' : '#06B6D4';
                    e.currentTarget.style.boxShadow = `0 0 20px ${
                      confirmPassword && password !== confirmPassword
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(6, 182, 212, 0.3)'
                    }`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      confirmPassword && password !== confirmPassword
                        ? '#EF4444'
                        : 'rgba(6, 182, 212, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#06B6D4',
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div
                  style={{
                    fontSize: '12px',
                    fontFamily: "'Aloe Vera Sans', sans-serif",
                    color: '#EF4444',
                    marginTop: '6px',
                  }}
                >
                  Passwords do not match
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div
              style={{
                padding: '16px',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                marginBottom: '24px',
              }}
            >
              <p
                style={{
                  color: '#06B6D4',
                  fontSize: '13px',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                  marginBottom: '8px',
                  fontWeight: 'bold',
                }}
              >
                Password Requirements:
              </p>
              <ul
                style={{
                  color: '#C4B5FD',
                  fontSize: '12px',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                  lineHeight: '1.6',
                  marginLeft: '20px',
                }}
              >
                <li>At least 8 characters long</li>
                <li>Mix of uppercase and lowercase letters (recommended)</li>
                <li>Include numbers (recommended)</li>
                <li>Include special characters (recommended)</li>
              </ul>
            </div>

            {/* Submit Button */}
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
              {loading ? 'UPDATING PASSWORD...' : 'RESET PASSWORD'}
            </button>

            {/* Back to Home */}
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
                onClick={() => navigate('/')}
                style={{
                  color: '#06B6D4',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                }}
              >
                Back to Home
              </span>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
