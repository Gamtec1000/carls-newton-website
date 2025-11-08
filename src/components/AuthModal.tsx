import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
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
  const [jobPosition, setJobPosition] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

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
    if (!fullName || !email || !password || !confirmPassword || !jobPosition) {
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
        job_position: jobPosition,
        interests: scienceTopics,
        resources,
        methodologies,
        subscribe_newsletter: subscribeNewsletter,
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

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '2px solid rgba(6, 182, 212, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontFamily: "'Courier New', monospace",
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
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '40px',
          background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%)',
          borderRadius: '24px',
          border: '2px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
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

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '2px',
              marginBottom: '24px',
            }}
          >
            WELCOME TO CARLS NEWTON
          </h2>

          {/* Tab Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => setActiveTab('signin')}
              style={{
                padding: '12px 32px',
                background: activeTab === 'signin'
                  ? 'linear-gradient(135deg, #06B6D4, #A855F7)'
                  : 'transparent',
                border: '2px solid #06B6D4',
                borderRadius: '25px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '1px',
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
                  ? 'linear-gradient(135deg, #06B6D4, #A855F7)'
                  : 'transparent',
                border: '2px solid #06B6D4',
                borderRadius: '25px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '1px',
                boxShadow: activeTab === 'register' ? '0 0 20px rgba(6, 182, 212, 0.5)' : 'none',
              }}
            >
              REGISTER
            </button>
          </div>
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
              <input
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="Email Address *"
                required
                style={inputStyle}
                {...inputFocusHandlers}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Password *"
                  required
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#C4B5FD',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#06B6D4',
                  }}
                />
                Remember me
              </label>
              <a
                href="#"
                style={{
                  color: '#06B6D4',
                  fontSize: '14px',
                  textDecoration: 'underline',
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
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
                fontSize: '18px',
                fontWeight: 'bold',
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
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>

            {/* Links */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#C4B5FD',
              }}
            >
              Don't have an account?{' '}
              <span
                onClick={() => setActiveTab('register')}
                style={{
                  color: '#06B6D4',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                }}
              >
                Register
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            {/* Contact Information Section */}
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#A78BFA',
                letterSpacing: '1px',
                marginBottom: '16px',
              }}
            >
              Contact Information
            </h3>

            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name *"
                required
                style={inputStyle}
                {...inputFocusHandlers}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address *"
                required
                style={inputStyle}
                {...inputFocusHandlers}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                style={inputStyle}
                {...inputFocusHandlers}
              />
            </div>

            {/* School */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="School/Organization"
                style={inputStyle}
                {...inputFocusHandlers}
              />
            </div>

            {/* Job Position */}
            <div style={{ marginBottom: '24px' }}>
              <input
                type="text"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                placeholder="Job Position (e.g., Science Coordinator, Head Teacher) *"
                required
                style={inputStyle}
                {...inputFocusHandlers}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password *"
                  required
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
                  placeholder="Confirm Password *"
                  required
                  style={{
                    ...inputStyle,
                    paddingRight: '50px',
                    borderColor: confirmPassword && password !== confirmPassword
                      ? '#EF4444'
                      : 'rgba(6, 182, 212, 0.3)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = confirmPassword && password !== confirmPassword ? '#EF4444' : '#06B6D4';
                    e.currentTarget.style.boxShadow = `0 0 20px ${confirmPassword && password !== confirmPassword ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`;
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
                    color: '#EF4444',
                    marginTop: '6px',
                  }}
                >
                  Passwords do not match
                </div>
              )}
            </div>

            {/* Interests & Preferences Section */}
            <div
              style={{
                background: 'rgba(88, 28, 135, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #06B6D4, #A855F7, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '1px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                ⚙️ INTERESTS & PREFERENCES
              </h3>

              {/* Science Topics */}
              <div style={{ marginBottom: '20px' }}>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#06B6D4',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🧪 Science Topics (select all that apply):
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {scienceTopicsList.map((topic) => (
                    <label
                      key={topic}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        background: 'rgba(6, 182, 212, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
                        e.currentTarget.style.borderColor = '#06B6D4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={scienceTopics.includes(topic)}
                        onChange={() => toggleCheckbox(topic, scienceTopics, setScienceTopics)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#06B6D4',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{ color: '#C4B5FD', fontSize: '14px' }}>{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resources You Need */}
              <div style={{ marginBottom: '20px' }}>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#A855F7',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📚 Resources You Need:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {resourcesList.map((resource) => (
                    <label
                      key={resource}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        background: 'rgba(168, 85, 247, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
                        e.currentTarget.style.borderColor = '#A855F7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={resources.includes(resource)}
                        onChange={() => toggleCheckbox(resource, resources, setResources)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#A855F7',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{ color: '#C4B5FD', fontSize: '14px' }}>{resource}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Learning Methodologies */}
              <div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#EC4899',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🔬 Learning Methodologies:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {methodologiesList.map((methodology) => (
                    <label
                      key={methodology}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        background: 'rgba(236, 72, 153, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
                        e.currentTarget.style.borderColor = '#EC4899';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.3)';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={methodologies.includes(methodology)}
                        onChange={() => toggleCheckbox(methodology, methodologies, setMethodologies)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#EC4899',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{ color: '#C4B5FD', fontSize: '14px' }}>{methodology}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <label
              style={{
                display: 'flex',
                alignItems: 'start',
                gap: '12px',
                cursor: 'pointer',
                marginTop: '24px',
                padding: '12px',
                background: 'rgba(6, 182, 212, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
              }}
            >
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#06B6D4',
                  cursor: 'pointer',
                  marginTop: '2px',
                }}
              />
              <span style={{ color: '#C4B5FD', fontSize: '14px', lineHeight: '1.5' }}>
                I agree to the{' '}
                <a href="/terms-and-conditions" target="_blank" style={{ color: '#06B6D4', textDecoration: 'underline' }}>
                  Terms & Conditions
                </a>
                {' '}and{' '}
                <a href="/privacy-policy" target="_blank" style={{ color: '#06B6D4', textDecoration: 'underline' }}>
                  Privacy Policy
                </a>
                {' '}*
              </span>
            </label>

            {/* Newsletter Subscription */}
            <label
              style={{
                display: 'flex',
                alignItems: 'start',
                gap: '12px',
                cursor: 'pointer',
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(168, 85, 247, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(168, 85, 247, 0.2)',
              }}
            >
              <input
                type="checkbox"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#A855F7',
                  cursor: 'pointer',
                  marginTop: '2px',
                }}
              />
              <span style={{ color: '#C4B5FD', fontSize: '14px', lineHeight: '1.5' }}>
                📬 Subscribe to our bi-weekly newsletter for exclusive science experiments, STEM resources, and special offers!
              </span>
            </label>

            {/* Register Button */}
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
                fontSize: '18px',
                fontWeight: 'bold',
                letterSpacing: '1.5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '24px',
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
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            {/* Link to Sign In */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#C4B5FD',
              }}
            >
              Already have an account?{' '}
              <span
                onClick={() => setActiveTab('signin')}
                style={{
                  color: '#06B6D4',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
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
