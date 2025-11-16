import React, { useState, useRef, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CircularProgress from '@mui/material/CircularProgress';

const LiveAIChat = ({ originalFilename, cleaningSummary }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI data analyst. Ask me anything about your uploaded data and I\'ll explain it in simple terms.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !originalFilename) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: originalFilename,
          question: userMessage.content,
          cleaning_summary: cleaningSummary
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Chat error:', response.status, errorData);
        throw new Error(errorData.detail || 'Chat request failed');
      }

      const data = await response.json();
      
      const aiMessage = {
        role: 'assistant',
        content: data.answer || 'I couldn\'t process that question. Could you rephrase it?',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat exception:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exampleQuestions = [
    "What are the main patterns in my data?",
    "Which column has the most missing values?",
    "Can you summarize the key insights?",
    "What's the average value in the numeric columns?"
  ];

  return (
    <div className="glass-card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <div className="d-flex align-items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="feature-icon" style={{ width: '48px', height: '48px', marginBottom: 0 }}>
          <SmartToyIcon />
        </div>
        <div>
          <h5 className="mb-0 text-gradient">Live AI Chat</h5>
          <small className="text-muted">Ask questions in plain English</small>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`d-flex gap-2 mb-3 ${msg.role === 'user' ? 'justify-content-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div
                className="feature-icon"
                style={{
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  marginBottom: 0,
                  background: 'var(--gradient-accent)'
                }}
              >
                <SmartToyIcon style={{ fontSize: '1.2rem' }} />
              </div>
            )}
            <div
              className={`p-3 rounded-lg-premium ${
                msg.role === 'user'
                  ? 'bg-gradient-primary text-white'
                  : 'glass-card--softer'
              }`}
              style={{
                maxWidth: '75%',
                wordBreak: 'break-word'
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              <small
                style={{
                  opacity: 0.7,
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  display: 'block'
                }}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </small>
            </div>
            {msg.role === 'user' && (
              <div
                className="feature-icon"
                style={{
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  marginBottom: 0,
                  background: 'var(--gradient-success)'
                }}
              >
                <PersonIcon style={{ fontSize: '1.2rem' }} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="d-flex gap-2 mb-3">
            <div
              className="feature-icon"
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                marginBottom: 0,
                background: 'var(--gradient-accent)'
              }}
            >
              <SmartToyIcon style={{ fontSize: '1.2rem' }} />
            </div>
            <div className="glass-card--softer p-3 rounded-lg-premium">
              <CircularProgress size={20} />
              <span className="ms-2">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Example Questions */}
      {messages.length === 1 && !isLoading && (
        <div className="mb-3">
          <small className="text-muted d-block mb-2">Try asking:</small>
          <div className="d-flex flex-wrap gap-2">
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                className="btn btn-sm glass-card--softer hover-lift"
                style={{ fontSize: '0.85rem' }}
                onClick={() => setInput(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-premium"
          placeholder={originalFilename ? "Ask me anything about your data..." : "Upload a file first to start chatting"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!originalFilename || isLoading}
        />
        <button
          className="btn btn-gradient-primary click-bounce"
          onClick={handleSend}
          disabled={!input.trim() || !originalFilename || isLoading}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default LiveAIChat;
