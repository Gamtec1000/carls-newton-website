import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Zap, Rocket, Beaker } from 'lucide-react';

interface AIStotleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIStotleModal({ isOpen, onClose }: AIStotleModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Greetings, young scientist! I am AI-STOTLE, your digital mentor for all things science. How may I illuminate your curiosity today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { icon: <Rocket size={16} />, text: 'What experiments do you offer?' },
    { icon: <Beaker size={16} />, text: 'How do I book a show?' },
    { icon: <Sparkles size={16} />, text: 'What ages are your shows for?' },
    { icon: <Zap size={16} />, text: 'What topics do you cover?' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response (replace with actual LLM API call)
    setTimeout(() => {
      const aiResponse = generateResponse(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('experiment') || q.includes('show') || q.includes('offer')) {
      return 'We offer three amazing experiences: Live Interactive Shows (45-60 mins of explosive demos), Hands-On Workshops (where students become scientists), and our Blast-off! Lab Experience (120-150 mins of outdoor science adventures). Each is designed to make complex science simple and fun!';
    } else if (q.includes('book') || q.includes('booking')) {
      return 'Booking is easy! Simply scroll down to our booking section or click the "BOOKINGS" button on the console. Select your preferred date and time, and our team will reach out to confirm. We bring all equipment and materials to your school!';
    } else if (q.includes('age') || q.includes('old')) {
      return 'We tailor our shows for all ages! We have special Preschool programs (30-45 mins, age-appropriate), Classic Shows for primary students, and advanced experiments for older students. Each show is curriculum-aligned and adjusts to your students\' understanding level.';
    } else if (q.includes('topic') || q.includes('subject') || q.includes('science')) {
      return 'Our shows cover a universe of topics! Physics (rockets, forces, energy), Chemistry (reactions, elements, mixtures), Biology (life systems), Earth Science (weather, geology), and more. We align with UAE curriculum and can customize based on what you\'re studying!';
    } else if (q.includes('price') || q.includes('cost')) {
      return 'Our packages start at AED 1,200 for Preschool Specials, AED 1,800 for Classic Shows, and AED 2,500+ for Half-Day Experiences. Check our Packages section for full details. Every dirham goes into making science unforgettable for your students!';
    } else {
      return 'That\'s a fascinating question! As AI-STOTLE, I\'m here to help with information about our science shows, booking, packages, and experiments. Could you ask me something specific about our programs? Or explore our console for quick answers!';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes terminalBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .message-bubble {
          animation: messageSlideIn 0.3s ease-out;
        }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          style={{
            width: '100%',
            maxWidth: '800px',
            height: '80vh',
            maxHeight: '700px',
            background: 'linear-gradient(180deg, #1e1b4b 0%, #1e3a8a 100%)',
            borderRadius: '24px',
            border: '2px solid #06B6D4',
            boxShadow: '0 0 60px rgba(6, 182, 212, 0.4), inset 0 0 60px rgba(6, 182, 212, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              background: 'rgba(6, 182, 212, 0.1)',
              borderBottom: '2px solid #06B6D4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
                }}
              >
                <Sparkles size={24} color="white" />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                    fontFamily: 'monospace',
                  }}
                >
                  AI-STOTLE
                </h2>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#06B6D4',
                    margin: 0,
                    fontFamily: 'monospace',
                  }}
                >
                  [ SCIENCE MENTOR ONLINE ]
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                    animation: 'terminalBlink 2s infinite',
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    color: '#06B6D4',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                  }}
                >
                  Active
                </span>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
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
                  e.currentTarget.style.boxShadow = '0 0 15px #EF4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <X size={20} color="#EF4444" />
              </button>
            </div>
          </div>

          {/* Quick Questions */}
          <div
            style={{
              padding: '16px 24px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderBottom: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              flexWrap: 'wrap',
            }}
          >
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.text)}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.5)',
                  borderRadius: '16px',
                  color: '#06B6D4',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
                  e.currentTarget.style.borderColor = '#06B6D4';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {q.icon}
                {q.text}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className="message-bubble"
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background:
                      message.sender === 'user'
                        ? 'linear-gradient(135deg, #A855F7, #EC4899)'
                        : 'rgba(6, 182, 212, 0.15)',
                    border:
                      message.sender === 'user'
                        ? '1px solid #A855F7'
                        : '1px solid rgba(6, 182, 212, 0.5)',
                    color: 'white',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    boxShadow:
                      message.sender === 'user'
                        ? '0 4px 15px rgba(168, 85, 247, 0.3)'
                        : '0 4px 15px rgba(6, 182, 212, 0.2)',
                  }}
                >
                  {message.text}
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginTop: '6px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '12px 20px',
                    borderRadius: '16px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid rgba(6, 182, 212, 0.5)',
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#06B6D4',
                      animation: 'terminalBlink 1.4s infinite',
                    }}
                  />
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#06B6D4',
                      animation: 'terminalBlink 1.4s infinite 0.2s',
                    }}
                  />
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#06B6D4',
                      animation: 'terminalBlink 1.4s infinite 0.4s',
                    }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '20px 24px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderTop: '2px solid #06B6D4',
              display: 'flex',
              gap: '12px',
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI-STOTLE about science shows..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '2px solid rgba(6, 182, 212, 0.5)',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#06B6D4';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: inputText.trim()
                  ? 'linear-gradient(135deg, #06B6D4, #A855F7)'
                  : 'rgba(100, 100, 100, 0.3)',
                border: 'none',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s',
                boxShadow: inputText.trim() ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (inputText.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = inputText.trim()
                  ? '0 0 20px rgba(6, 182, 212, 0.3)'
                  : 'none';
              }}
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
