import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success'
    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.95), rgba(168, 85, 247, 0.95))'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))';

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div
      style={{
        position: 'fixed',
        top: '90px',
        right: '20px',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '500px',
        background: bgColor,
        border: `2px solid ${type === 'success' ? 'rgba(6, 182, 212, 0.8)' : 'rgba(239, 68, 68, 0.8)'}`,
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${type === 'success' ? 'rgba(6, 182, 212, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <Icon size={24} color="white" />
      <div style={{ flex: 1, color: 'white', fontSize: '14px', fontFamily: "'Aloe Vera Sans', sans-serif", lineHeight: '1.5' }}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none';
        }}
      >
        <X size={18} />
      </button>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
