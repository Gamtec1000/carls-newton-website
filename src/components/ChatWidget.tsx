import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "What packages do you offer?",
  "How do I book a show?",
  "Who is the founder?",
  "Check my booking status",
];

const API_URL = import.meta.env.VITE_AISTOTLE_API_URL || "https://aistotle.carlsnewton.com";

interface ChatWidgetProps {
  onAuthRequired?: () => void;
}

export default function ChatWidget({ onAuthRequired }: ChatWidgetProps) {
  console.log("💬 ChatWidget mounted");
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! 👋 I'm Newton, your science assistant! Ready to make learning FUN? Ask me about our explosive science shows! 🔬✨",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("💬 ChatWidget rendered, isOpen:", isOpen);
    // Alert to confirm component is running
    console.log("🚨 ALERT: If you see this in console, component IS mounting!");
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Force an alert on mount to debug
  useEffect(() => {
    console.log("✅ ChatWidget mounted successfully with Portal!");
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text.trim(),
          user_email: user?.email || undefined,
        }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || "Sorry, I couldn't process that. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please email hello@carlsnewton.com or call +971 52 409 8148",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const widgetContent = (
    <>
      {/* Chat Bubble Trigger */}
      <button
        onClick={() => {
          console.log("💬 Chat bubble clicked! isOpen was:", isOpen);
          setIsOpen(!isOpen);
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
          border: 'none',
          color: 'white',
          zIndex: 99999,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
          fontSize: '28px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(6, 182, 212, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(6, 182, 212, 0.4)';
        }}
      >
        {isOpen ? '✕' : '🧪'}
      </button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '96px',
              right: '24px',
              zIndex: 99999,
              width: '380px',
              height: '500px',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            className="max-sm:w-[calc(100%-3rem)] max-sm:right-3 max-sm:left-3 max-sm:h-[60vh] max-sm:bottom-20"
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
              padding: '16px 20px',
              borderRadius: '20px 20px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}>
                🔬
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: 0,
                }}>
                  Carls Newton
                </h3>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    background: '#4ADE80',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'pulse 2s infinite',
                  }}></span>
                  Online • Ask us anything!
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Content: Login Required or Messages */}
            {!user ? (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                }}>
                  🔒
                </div>
                <h3 style={{
                  color: '#1e293b',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  margin: 0,
                }}>
                  Sign In Required
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                  maxWidth: '300px',
                }}>
                  To protect your privacy and access booking information, please sign in to use our chatbot.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onAuthRequired?.();
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '12px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Sign In / Register
                </button>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '13px',
                  marginTop: '20px',
                  margin: '20px 0 0 0',
                }}>
                  🔐 Your data is safe and secure
                </p>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px',
                  background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
                }}>
                  {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  {msg.isUser ? (
                    <div style={{
                      background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                      color: 'white',
                      borderRadius: '18px 18px 4px 18px',
                      padding: '14px 18px',
                      maxWidth: '85%',
                      boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)',
                      fontSize: '15px',
                      lineHeight: '1.5',
                    }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div style={{
                      background: 'white',
                      borderRadius: '18px 18px 18px 4px',
                      padding: '14px 18px',
                      maxWidth: '85%',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      borderLeft: '4px solid #06B6D4',
                      color: '#1e293b',
                      fontSize: '15px',
                      lineHeight: '1.5',
                    }}>
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '18px',
                    padding: '14px 18px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    borderLeft: '4px solid #06B6D4',
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions (show only at start) */}
            {messages.length === 1 && (
              <div style={{
                padding: '0 20px 12px',
                background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)',
              }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickQuestion(q)}
                      style={{
                        background: 'white',
                        border: '2px solid #06B6D4',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        color: '#0891B2',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#06B6D4';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#0891B2';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div style={{
              background: 'white',
              padding: '16px 20px',
              borderRadius: '0 0 20px 20px',
              borderTop: '1px solid #e2e8f0',
            }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    border: '2px solid #e2e8f0',
                    borderRadius: '25px',
                    padding: '12px 20px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#06B6D4'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #06B6D4, #A855F7)',
                    border: 'none',
                    color: 'white',
                    fontSize: '18px',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease',
                    opacity: input.trim() && !isLoading ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (input.trim() && !isLoading) {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ➤
                </button>
              </form>
            </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // Render using portal to escape parent container constraints
  return createPortal(widgetContent, document.body);
}
