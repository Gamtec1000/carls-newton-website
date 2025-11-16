import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../styles/phone-input.css';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    school_organization: '',
    job_position: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load profile data when modal opens
  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        school_organization: profile.school_organization || '',
        job_position: profile.job_position || '',
      });
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate
      if (!formData.full_name.trim()) {
        throw new Error('Full name is required');
      }

      // Update profile
      await updateProfile({
        full_name: formData.full_name.trim(),
        phone: formData.phone,
        school_organization: formData.school_organization,
        job_position: formData.job_position,
      });

      // Send confirmation email via API
      try {
        await fetch('/api/send-profile-update-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: profile?.email,
            full_name: formData.full_name,
            phone: formData.phone,
            school_organization: formData.school_organization,
            job_position: formData.job_position,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the update if email fails
      }

      setSuccess(true);

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 9998,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.98) 0%, rgba(30, 58, 138, 0.98) 100%)',
          border: '2px solid rgba(6, 182, 212, 0.5)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
          padding: '32px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
            }}
          >
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#22C55E',
            }}
          >
            <CheckCircle size={24} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>Profile Updated!</div>
              <div style={{ fontSize: '12px', color: '#C4B5FD' }}>
                A confirmation email has been sent to {profile?.email}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#EF4444',
            }}
          >
            <AlertCircle size={24} />
            <div style={{ fontSize: '14px' }}>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                color: '#C4B5FD',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              <User size={16} />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.6)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              }}
            />
          </div>

          {/* Email (Read-only) */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                color: '#C4B5FD',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              <Mail size={16} />
              Email (cannot be changed)
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              readOnly
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.1)',
                color: '#A855F7',
                outline: 'none',
                cursor: 'not-allowed',
                opacity: 0.7,
              }}
            />
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                color: '#C4B5FD',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              <Phone size={16} />
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="AE"
                countries={['AE', 'SA', 'KW', 'QA', 'OM', 'BH', 'EG']}
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value || '' })}
                placeholder="Phone Number"
              />
            </div>
          </div>

          {/* School/Organization */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                color: '#C4B5FD',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              <Building size={16} />
              School / Organization
            </label>
            <input
              type="text"
              value={formData.school_organization}
              onChange={(e) => setFormData({ ...formData, school_organization: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.6)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              }}
            />
          </div>

          {/* Job Position */}
          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                color: '#C4B5FD',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              <Briefcase size={16} />
              Job Position
            </label>
            <input
              type="text"
              value={formData.job_position}
              onChange={(e) => setFormData({ ...formData, job_position: e.target.value })}
              placeholder="e.g., Science Coordinator, Head Teacher"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.6)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                background: loading || success ? 'rgba(6, 182, 212, 0.5)' : 'linear-gradient(135deg, #06B6D4, #A855F7)',
                color: 'white',
                cursor: loading || success ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
                }
              }}
            >
              {loading ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
