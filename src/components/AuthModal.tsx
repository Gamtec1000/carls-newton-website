import { useState } from 'react';
import { X, Mail, Lock, User, Phone, School, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Interests State
  const [scienceTopics, setScienceTopics] = useState<string[]>([]);
  const [resources, setResources] = useState<string[]>([]);
  const [methodologies, setMethodologies] = useState<string[]>([]);

  const scienceTopicsList = [
    'Physics Experiments',
    'Chemistry Demos',
    'Space & Astronomy',
    'Biology & Life Sciences',
    'Engineering & Robotics',
    'Environmental Science',
  ];

  const resourcesList = [
    'Experiment Videos',
    'Lesson Plans & Curricula',
    'Activity Worksheets',
    'Science Kits & Materials',
    'Teacher Training Guides',
    'Parent Resources',
  ];

  const methodologiesList = [
    'Hands-on Experiments',
    'Interactive Demonstrations',
    'Virtual Labs & Simulations',
    'STEM Challenges',
    'Project-Based Learning',
    'Inquiry-Based Learning',
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signIn(signInEmail, signInPassword);
      setSuccess('Successfully signed in!');
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
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

    if (!agreeToTerms) {
      setError('Please agree to the Terms & Conditions');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email,
        password,
        full_name: fullName,
        school_organization: school,
        phone,
        interests: scienceTopics,
        resources,
        methodologies,
      });

      setSuccess('Account created! Please check your email to verify your account.');
      setTimeout(() => {
        setActiveTab('signin');
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckbox = (value: string, list: string[], setter: (list: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter(item => item !== value));
    } else {
      setter([...list, value]);
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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: activeTab === 'register' ? '700px' : '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '40px',
          background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.98) 0%, rgba(30, 58, 138, 0.98) 100%)',
          borderRadius: '24px',
          border: '3px solid rgba(6, 182, 212, 0.5)',
          boxShadow: '0 0 60px rgba(6, 182, 212, 0.4), inset 0 0 30px rgba(6, 182, 212, 0.1)',
          position: 'relative',
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

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'center' }}>
          <button
            onClick={() => setActiveTab('signin')}
            style={{
              padding: '12px 32px',
              background: activeTab === 'signin'
                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(168, 85, 247, 0.3))'
                : 'transparent',
              border: activeTab === 'signin'
                ? '2px solid #06B6D4'
                : '2px solid rgba(196, 181, 253, 0.3)',
              borderRadius: '12px',
              color: activeTab === 'signin' ? '#06B6D4' : '#C4B5FD',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: activeTab === 'signin' ? '0 0 20px rgba(6, 182, 212, 0.5)' : 'none',
            }}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setActiveTab('register')}
            style={{
              padding: '12px 32px',
              background: activeTab === 'register'
                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(168, 85, 247, 0.3))'
                : 'transparent',
              border: activeTab === 'register'
                ? '2px solid #06B6D4'
                : '2px solid rgba(196, 181, 253, 0.3)',
              borderRadius: '12px',
              color: activeTab === 'register' ? '#06B6D4' : '#C4B5FD',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: activeTab === 'register' ? '0 0 20px rgba(6, 182, 212, 0.5)' : 'none',
            }}
          >
            REGISTER
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #EF4444',
              borderRadius: '8px',
              color: '#EF4444',
              marginBottom: '20px',
              fontFamily: 'monospace',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10B981',
              borderRadius: '8px',
              color: '#10B981',
              marginBottom: '20px',
              fontFamily: 'monospace',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
            }}
          >
            {success}
          </div>
        )}

        {activeTab === 'signin' ? (
          <form onSubmit={handleSignIn}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  color: '#C4B5FD',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                }}
              >
                <Mail size={16} color="#06B6D4" />
                Email Address
              </label>
              <input
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#06B6D4';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  color: '#C4B5FD',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                }}
              >
                <Lock size={16} color="#06B6D4" />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 45px 12px 16px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#06B6D4';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#06B6D4',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#C4B5FD',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 32px',
                background: loading
                  ? 'rgba(6, 182, 212, 0.3)'
                  : 'linear-gradient(135deg, #06B6D4, #A855F7)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                transition: 'all 0.3s',
              }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>

            {/* Links */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#C4B5FD',
                fontFamily: 'monospace',
              }}
            >
              Don't have an account?{' '}
              <span
                onClick={() => setActiveTab('register')}
                style={{
                  color: '#06B6D4',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Register
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                  color: '#C4B5FD',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              >
                <User size={14} color="#06B6D4" />
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#06B6D4';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                  color: '#C4B5FD',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              >
                <Mail size={14} color="#06B6D4" />
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#06B6D4';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                  color: '#C4B5FD',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              >
                <Phone size={14} color="#06B6D4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971-50-123-4567"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#06B6D4';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* School */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                  color: '#C4B5FD',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              >
                <School size={14} color="#06B6D4" />
                School/Organization
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#06B6D4';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                  color: '#C4B5FD',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              >
                <Lock size={14} color="#06B6D4" />
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '2px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#06B6D4';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#06B6D4',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: '6px' }}>
                  <div
                    style={{
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
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
                      fontSize: '11px',
                      color: passwordStrength.color,
                      marginTop: '4px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {passwordStrength.label}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                  color: '#C4B5FD',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              >
                <Lock size={14} color="#06B6D4" />
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: `2px solid ${
                      confirmPassword && password !== confirmPassword
                        ? '#EF4444'
                        : 'rgba(6, 182, 212, 0.3)'
                    }`,
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = confirmPassword && password !== confirmPassword ? '#EF4444' : '#06B6D4';
                    e.currentTarget.style.boxShadow = `0 0 15px ${confirmPassword && password !== confirmPassword ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = confirmPassword && password !== confirmPassword ? '#EF4444' : 'rgba(6, 182, 212, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#06B6D4',
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#EF4444',
                    marginTop: '4px',
                    fontFamily: 'monospace',
                  }}
                >
                  Passwords do not match
                </div>
              )}
            </div>

            {/* Interests Section */}
            <div
              style={{
                padding: '16px',
                background: 'rgba(168, 85, 247, 0.05)',
                border: '2px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  color: '#A855F7',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                ⚙️ INTERESTS & PREFERENCES
              </h3>

              {/* Science Topics */}
              <div style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    color: '#C4B5FD',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px',
                  }}
                >
                  🧪 Science Topics:
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {scienceTopicsList.map((topic) => (
                    <label
                      key={topic}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#C4B5FD',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={scienceTopics.includes(topic)}
                        onChange={() => toggleCheckbox(topic, scienceTopics, setScienceTopics)}
                        style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                      />
                      {topic}
                    </label>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    color: '#C4B5FD',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px',
                  }}
                >
                  📚 Resources You Need:
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {resourcesList.map((resource) => (
                    <label
                      key={resource}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#C4B5FD',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={resources.includes(resource)}
                        onChange={() => toggleCheckbox(resource, resources, setResources)}
                        style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                      />
                      {resource}
                    </label>
                  ))}
                </div>
              </div>

              {/* Methodologies */}
              <div>
                <div
                  style={{
                    color: '#C4B5FD',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px',
                  }}
                >
                  🔬 Learning Methodologies:
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {methodologiesList.map((methodology) => (
                    <label
                      key={methodology}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#C4B5FD',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={methodologies.includes(methodology)}
                        onChange={() => toggleCheckbox(methodology, methodologies, setMethodologies)}
                        style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                      />
                      {methodology}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  color: '#C4B5FD',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                  style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                />
                <span>
                  I agree to the{' '}
                  <span style={{ color: '#06B6D4', textDecoration: 'underline' }}>
                    Terms & Conditions
                  </span>{' '}
                  and{' '}
                  <span style={{ color: '#06B6D4', textDecoration: 'underline' }}>
                    Privacy Policy
                  </span>{' '}
                  *
                </span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 32px',
                background: loading
                  ? 'rgba(6, 182, 212, 0.3)'
                  : 'linear-gradient(135deg, #06B6D4, #A855F7)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                transition: 'all 0.3s',
              }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            {/* Link to Sign In */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#C4B5FD',
                fontFamily: 'monospace',
              }}
            >
              Already have an account?{' '}
              <span
                onClick={() => setActiveTab('signin')}
                style={{
                  color: '#06B6D4',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Sign In
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
