import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Zap, Rocket, Beaker } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AIStotleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  intent?: string;
}

const AISTOTLE_API_URL = process.env.NEXT_PUBLIC_AISTOTLE_API_URL || 'https://aistotle.carlsnewton.com';

export default function AIStotleModal({ isOpen, onClose }: AIStotleModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m here to help you learn about Carls Newton science shows and answer any questions you have. I can help with packages, pricing, bookings, and more! How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { icon: <Rocket size={16} />, text: 'What packages do you offer?' },
    { icon: <Beaker size={16} />, text: 'Who is Carls Newton?' },
    { icon: <Sparkles size={16} />, text: 'How do I book a show?' },
    { icon: <Zap size={16} />, text: 'Check my booking status' },
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

    try {
      console.log('AI-STOTLE: Sending request to:', `${AISTOTLE_API_URL}/ask`);
      console.log('AI-STOTLE: Request data:', { question: messageText, student_age: 10, user_email: user?.email });

      const response = await fetch(`${AISTOTLE_API_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: messageText,
          student_age: 10,
          user_email: user?.email || undefined,
        }),
      });

      console.log('AI-STOTLE: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI-STOTLE: Error response:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('AI-STOTLE: Success response:', data);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || data.message || 'I received your question but had trouble formulating a response.',
        sender: 'ai',
        timestamp: new Date(),
        intent: data.intent,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI-STOTLE API Error:', error);

      // More detailed error message
      let errorMessage = 'Sorry, I had trouble connecting to my knowledge base. ';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage += 'Please check if the AI-STOTLE API is running and accessible. ';
          errorMessage += 'API URL: ' + AISTOTLE_API_URL;
        } else if (error.message.includes('CORS')) {
          errorMessage += 'There seems to be a CORS configuration issue. Please check the API CORS settings.';
        } else {
          errorMessage += error.message;
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
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
