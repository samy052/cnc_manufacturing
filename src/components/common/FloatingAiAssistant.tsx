'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFoundry } from '@/context/FoundryContext';

export default function FloatingAiAssistant() {
  const {
    activeSection,
    setActiveSection,
    chatMessages,
    quickChips,
    sendMessage,
    clearChat,
    t,
  } = useFoundry();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message when popover is open
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (chipText: string) => {
    sendMessage(chipText);
  };

  const handleOpenFullPage = () => {
    setActiveSection('assistant');
    setIsOpen(false);
  };

  return (
    <div className="floating-ai-root">
      {/* Interactive Floating Chat Popover Window */}
      {isOpen && (
        <div className="floating-ai-popover animate-fade-in" role="dialog" aria-label="AI Assistant Dialog">
          {/* Popover Header */}
          <div className="floating-ai-header">
            <div className="floating-ai-header-left">
              <div className="floating-ai-header-avatar-wrap">
                <img
                  src="/ai_assistant_avatar.jpg"
                  alt="AI Assistant"
                  className="floating-ai-header-avatar"
                />
                <span className="floating-ai-header-status-dot" />
              </div>
              <div>
                <div className="floating-ai-header-title">{t.assistant.title}</div>
                <div className="floating-ai-header-sub">
                  <span className="floating-ai-pulse-dot" />
                  RAG & SCADA Telemetry Live
                </div>
              </div>
            </div>

            <div className="floating-ai-header-actions">
              {/* Fullscreen / Full Page Navigation */}
              <button
                type="button"
                onClick={handleOpenFullPage}
                className="floating-ai-icon-btn"
                title="Open Full Assistant Page"
                aria-label="Open Full Assistant Page"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6" />
                  <path d="M9 21H3v-6" />
                  <path d="M21 3l-7 7" />
                  <path d="M3 21l7-7" />
                </svg>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="floating-ai-icon-btn"
                title="Close Assistant"
                aria-label="Close Assistant"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Context Banner */}
          <div className="floating-ai-banner">
            <div className="floating-ai-banner-badge">GENAI + RAG</div>
            <div className="floating-ai-banner-text">
              Real-time awareness of 12 CNC machines, OEE (78.4%), and live line alerts.
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="floating-ai-messages">
            {chatMessages.length === 0 ? (
              <div className="floating-ai-empty">
                <p>{t.assistant.initialGreeting}</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`floating-ai-msg ${msg.role}`}>
                  {msg.role === 'bot' && (
                    <div className="floating-ai-msg-sender">
                      <span className="floating-ai-sender-tag">AI Copilot</span>
                      {msg.tagText && <span className="floating-ai-tag-pill">{msg.tagText}</span>}
                    </div>
                  )}
                  <div className="floating-ai-msg-bubble">
                    <p className="floating-ai-msg-text">{msg.text}</p>
                    <span className="floating-ai-msg-time">{msg.timestamp}</span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="floating-ai-chips-wrap">
            <div className="floating-ai-chips-scroll">
              {quickChips.slice(0, 4).map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="floating-ai-chip-btn"
                  onClick={() => handleChipClick(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Tray */}
          <div className="floating-ai-input-tray">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.assistant.inputPlaceholder}
              className="floating-ai-input"
            />
            <button
              type="button"
              onClick={handleSend}
              className="floating-ai-send-btn"
              disabled={!inputValue.trim()}
              title={t.assistant.send}
              aria-label={t.assistant.send}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Trigger Widget (Bubble + Avatar) matching screenshot */}
      <div className="floating-ai-trigger-container">
        {/* Left Speech Bubble ("Ask Anything \n Powered by RAG AI") */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`floating-ai-trigger-bubble ${isOpen ? 'active' : ''}`}
          aria-label="Toggle AI Assistant"
        >
          <div className="floating-ai-trigger-bubble-text">
            <span className="floating-ai-trigger-title">{t.common.askAnythingTitle}</span>
            <span className="floating-ai-trigger-sub">{t.common.askAnythingSub}</span>
          </div>
          {/* Triangular speech bubble tail pointing right towards the avatar */}
          <span className="floating-ai-trigger-tail" />
        </button>

        {/* Circular Avatar Frame */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`floating-ai-trigger-avatar-btn ${isOpen ? 'active' : ''}`}
          aria-label="AI Assistant Avatar"
          title="Ask Anything - Powered by RAG AI"
        >
          <div className="floating-ai-avatar-ring">
            <img
              src="/ai_assistant_avatar.jpg"
              alt="Ask Factory AI Assistant"
              className="floating-ai-avatar-img"
            />
          </div>

          {/* Green Live Online Dot */}
          <span className="floating-ai-online-badge" />

          {/* Subtle Golden Sparkle Stars from the design mockup */}
          <span className="floating-ai-sparkle sparkle-top">✦</span>
          <span className="floating-ai-sparkle sparkle-right">✦</span>
        </button>
      </div>
    </div>
  );
}
