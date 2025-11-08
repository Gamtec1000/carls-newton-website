import { useState } from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';

interface NavItem {
  label: string;
  href: string;
  onClick?: () => void;
}

interface GooeyNavProps {
  items: NavItem[];
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  initialActiveIndex?: number;
  animationTime?: number;
  timeVariance?: number;
  colors?: number[];
  onAuthClick?: () => void;
}

export default function GooeyNav({
  items,
  particleCount = 20,
  particleDistances = [90, 10],
  particleR = 120,
  initialActiveIndex = 0,
  animationTime = 600,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  onAuthClick,
}: GooeyNavProps) {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getColorClass = (colorNum: number) => {
    switch (colorNum) {
      case 1:
        return '#06B6D4'; // cyan
      case 2:
        return '#A855F7'; // purple
      case 3:
        return '#EC4899'; // pink
      case 4:
        return '#10B981'; // green
      default:
        return '#06B6D4';
    }
  };

  const handleClick = (index: number, item: NavItem) => {
    setActiveIndex(index);
    if (item.onClick) {
      item.onClick();
    } else if (item.href.startsWith('#')) {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <style>{`
        @keyframes gooeyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(var(--tx), var(--ty)); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
          50% { filter: drop-shadow(0 0 15px currentColor); }
        }
        .gooey-nav-item {
          transition: all ${animationTime}ms ease;
        }
        .gooey-nav-item:hover {
          animation: gooeyFloat 2s ease-in-out infinite;
        }
      `}</style>

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(30, 27, 75, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '70px',
              position: 'relative',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: 10,
              }}
            >
              <img
                src="/carls-newton-logo.png"
                alt="Carls Newton Logo"
                style={{
                  height: '200px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Navigation Items */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              {items.map((item, index) => {
                const isActive = activeIndex === index;
                const isHovered = hoveredIndex === index;
                const color = getColorClass(colors[index % colors.length]);

                return (
                  <a
                    key={index}
                    href={item.href}
                    className="gooey-nav-item"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(index, item);
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      position: 'relative',
                      padding: '10px 20px',
                      color: isActive || isHovered ? color : '#C4B5FD',
                      textDecoration: 'none',
                      fontWeight: '300',
                      fontSize: '14px',
                      fontFamily: "'Aloe Vera Sans', sans-serif",
                      borderRadius: '20px',
                      background:
                        isActive || isHovered
                          ? `linear-gradient(135deg, ${color}22, ${color}11)`
                          : 'transparent',
                      border: isHovered
                        ? '2px solid #06B6D4'
                        : '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 300ms ease',
                      cursor: 'pointer',
                      letterSpacing: '1px',
                      boxShadow: isHovered ? '0 0 20px rgba(6, 182, 212, 0.5)' : 'none',
                    }}
                  >
                    {/* Particle effects */}
                    {(isActive || isHovered) && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: '-20px',
                          pointerEvents: 'none',
                        }}
                      >
                        {[...Array(Math.min(particleCount / 4, 5))].map((_, i) => (
                          <div
                            key={i}
                            style={{
                              position: 'absolute',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              background: '#A855F7',
                              boxShadow: '0 0 8px #A855F7',
                              top: '50%',
                              left: '50%',
                              animation: 'particleFloat 2s ease-in-out infinite',
                              animationDelay: `${i * 0.2}s`,
                              // @ts-ignore
                              '--tx': `${Math.cos((i / 5) * Math.PI * 2) * 20}px`,
                              '--ty': `${Math.sin((i / 5) * Math.PI * 2) * 20}px`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Status LED */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isActive ? color : 'transparent',
                        boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                        animation: isActive ? 'glow 2s ease-in-out infinite' : 'none',
                      }}
                    />

                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Auth Button or User Menu */}
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={onAuthClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
                  padding: '12px 28px',
                  borderRadius: '25px',
                  fontWeight: '300',
                  fontFamily: "'Aloe Vera Sans', sans-serif",
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                  transition: 'all 300ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.border = '2px solid #06B6D4';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
                }}
              >
                <User size={18} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
