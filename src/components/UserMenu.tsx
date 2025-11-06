import { useState, useRef, useEffect } from 'react';
import { User, BookOpen, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu() {
  const { profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(168, 85, 247, 0.2))',
          border: '2px solid rgba(6, 182, 212, 0.5)',
          borderRadius: '25px',
          color: '#06B6D4',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          cursor: 'pointer',
          transition: 'all 300ms ease',
          boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
        }}
      >
        <User size={18} />
        <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {profile?.full_name || 'User'}
        </span>
        <ChevronDown size={16} style={{ transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            minWidth: '200px',
            background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.98) 0%, rgba(30, 58, 138, 0.98) 100%)',
            border: '2px solid rgba(6, 182, 212, 0.5)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(6, 182, 212, 0.3)',
            overflow: 'hidden',
            zIndex: 1001,
          }}
        >
          {/* User Info Header */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
              background: 'rgba(6, 182, 212, 0.05)',
            }}
          >
            <div style={{ color: '#06B6D4', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '4px' }}>
              {profile?.full_name}
            </div>
            <div style={{ color: '#C4B5FD', fontSize: '11px', fontFamily: 'monospace' }}>
              {profile?.email}
            </div>
            {profile?.school_organization && (
              <div style={{ color: '#A855F7', fontSize: '11px', fontFamily: 'monospace', marginTop: '4px' }}>
                🏫 {profile.school_organization}
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div style={{ padding: '8px 0' }}>
            <button
              onClick={() => {
                // Navigate to bookings
                setIsOpen(false);
                alert('My Bookings - Coming Soon!');
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#C4B5FD',
                fontSize: '13px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                e.currentTarget.style.color = '#06B6D4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#C4B5FD';
              }}
            >
              <BookOpen size={16} />
              My Bookings
            </button>

            <button
              onClick={() => {
                // Navigate to profile settings
                setIsOpen(false);
                alert('Profile Settings - Coming Soon!');
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#C4B5FD',
                fontSize: '13px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                e.currentTarget.style.color = '#06B6D4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#C4B5FD';
              }}
            >
              <Settings size={16} />
              Profile Settings
            </button>

            <div style={{ height: '1px', background: 'rgba(6, 182, 212, 0.2)', margin: '8px 0' }} />

            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#EF4444',
                fontSize: '13px',
                fontFamily: 'monospace',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
