import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import './Main.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Context } from '../../../context/Context'

const SUGGESTIONS = [
  { emoji: '🌍', category: 'Travel', text: 'Suggest beautiful places for a road trip adventure' },
  { emoji: '💻', category: 'Code', text: 'Improve the readability of my code snippet' },
  { emoji: '✍️', category: 'Write', text: 'Help me write a compelling cover letter' },
  { emoji: '🧠', category: 'Learn', text: 'Explain quantum computing in simple terms' },
]

const ROTATING_SUBTITLES = [
  'How can I help you today?',
  'Ask me anything...',
  'Let\'s build something great.',
  'Your AI assistant is ready.',
]

// Auth Modal Component
const AuthModal = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    onLogin({ name: formData.name || formData.email.split('@')[0], email: formData.email, avatar: (formData.name || formData.email)[0]?.toUpperCase() })
  }

  const handleDemo = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    onLogin({ name: 'Demo User', email: 'demo@nano-ai.app', avatar: 'D' })
  }

  return (
    <motion.div
      className="auth-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="auth-modal"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        {/* Logo */}
        <div className="modal-logo">
          <div className="modal-logo-icon">✦</div>
          <span>nano<b>ai</b></span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={isLogin ? 'li' : 'su'}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="modal-title">{isLogin ? 'Welcome back' : 'Get started'}</h2>
            <p className="modal-sub">{isLogin ? 'Sign in to save your chats' : 'Create a free account'}</p>
          </motion.div>
        </AnimatePresence>

        {/* Demo button */}
        <motion.button className="demo-login-btn" onClick={handleDemo} disabled={loading}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {loading ? <span className="dots-loader"><span /><span /><span /></span> : <>⚡ Try Demo — No signup needed</>}
        </motion.button>

        <div className="modal-divider"><span>or with email</span></div>

        <form onSubmit={handleSubmit} className="modal-form">
          <AnimatePresence>
            {!isLogin && (
              <motion.div className="modal-input-wrap"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                <input type="text" name="name" placeholder="👤  Full name" value={formData.name} onChange={handleChange} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="modal-input-wrap">
            <input type="email" name="email" placeholder="✉️  Email address" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="modal-input-wrap password-wrap">
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="🔒  Password" value={formData.password} onChange={handleChange} required />
            <button type="button" className="eye-toggle" onClick={() => setShowPassword(p => !p)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <motion.button type="submit" className="modal-submit-btn" disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {loading ? <span className="dots-loader"><span /><span /><span /></span> : isLogin ? 'Sign in' : 'Create account'}
          </motion.button>
        </form>

        <div className="modal-social">
          <button className="social-btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            Google
          </button>
          <button className="social-btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
            GitHub
          </button>
        </div>

        <p className="modal-toggle">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={() => setIsLogin(p => !p)}>{isLogin ? ' Sign up' : ' Sign in'}</button>
        </p>
      </motion.div>
    </motion.div>
  )
}

// Typing Animation for AI response
const TypedMessage = ({ html }) => {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    const plain = html.replace(/<[^>]+>/g, '') // strip tags for length
    const len = plain.length
    let i = 0
    // Just reveal the full HTML progressively by character count proportion
    const interval = setInterval(() => {
      i += Math.ceil(len / 60)
      const ratio = Math.min(i / len, 1)
      // Reveal proportion of html string safely
      const cutoff = Math.floor(html.length * ratio)
      setDisplayed(html.substring(0, cutoff))
      if (ratio >= 1) {
        setDisplayed(html)
        setDone(true)
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [html])

  return <p dangerouslySetInnerHTML={{ __html: done ? html : displayed }} />
}

// Message Bubble
const MessageBubble = ({ msg, isLast }) => {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      className={`message-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {!isUser && (
        <div className="ai-avatar-sm">✦</div>
      )}
      <div className={`bubble-content ${isUser ? 'user-content' : 'ai-content'}`}>
        {msg.image && (
          <div className="msg-image-wrap">
            <img src={msg.image} alt="attached" className="msg-image" />
          </div>
        )}
        {isUser
          ? <p>{msg.content}</p>
          : isLast ? <TypedMessage html={msg.content} /> : <p dangerouslySetInnerHTML={{ __html: msg.content }} />
        }
        <span className="bubble-time">
          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </span>
      </div>
      {isUser && (
        <div className="user-avatar-sm">{msg.userAvatar || '👤'}</div>
      )}
    </motion.div>
  )
}

// Typing Dots
const TypingDots = () => (
  <motion.div className="typing-indicator"
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <div className="ai-avatar-sm">✦</div>
    <div className="typing-dots">
      <span /><span /><span />
    </div>
    <span className="typing-label">nano-ai is thinking…</span>
  </motion.div>
)

const Main = ({ user, theme, toggleTheme, onLogout, isLoggedIn, onLogin }) => {
  const {
    onSent, showResult, loading, messages,
    setInput, input,
    attachedImage, setAttachedImage,
  } = useContext(Context)

  const [subtitleIdx, setSubtitleIdx] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)
  const textareaRef = useRef(null)

  // Rotate subtitles
  useEffect(() => {
    const id = setInterval(() => setSubtitleIdx(i => (i + 1) % ROTATING_SUBTITLES.length), 3000)
    return () => clearInterval(id)
  }, [])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value)
    const ta = textareaRef.current
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px' }
  }

  const handleSend = () => {
    if (!input.trim() && !attachedImage) return
    if (!isLoggedIn) { setShowAuthModal(true); return }
    onSent()
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleCardClick = (text) => {
    if (!isLoggedIn) { setInput(text); setShowAuthModal(true); return }
    setInput(text)
    setTimeout(() => onSent(text), 50)
  }

  // Image upload
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAttachedImage({ file, url })
    setImagePreview(url)
  }

  const removeImage = () => {
    setAttachedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Voice input — Web Speech API
  const handleVoice = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setInput(transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = (e) => {
      console.error('Speech error:', e.error)
      setIsListening(false)
    }

    recognition.start()
  }, [isListening, setInput])

  const handleLogin = (userData) => {
    onLogin(userData)
    setShowAuthModal(false)
  }

  return (
    <div className="main">
      {/* AUTH MODAL OVERLAY */}
      <AnimatePresence>
        {showAuthModal && !isLoggedIn && (
          <AuthModal onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.nav className="main-nav"
        initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
        <div className="nav-left">
          <div className="nav-logo">
            <span className="nav-logo-icon">✦</span>
            <span className="nav-logo-text">nano<b>ai</b></span>
          </div>
        </div>
        <div className="nav-right">
          <motion.button className="nav-theme-btn" onClick={toggleTheme}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </motion.button>
          {isLoggedIn ? (
            <div className="nav-user">
              <div className="nav-avatar">{user?.avatar || 'U'}</div>
              <span className="nav-name">{user?.name}</span>
              <motion.button className="nav-logout-btn" onClick={onLogout}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Sign out
              </motion.button>
            </div>
          ) : (
            <motion.button className="nav-login-btn" onClick={() => setShowAuthModal(true)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              Sign in
            </motion.button>
          )}
        </div>
      </motion.nav>

      {/* CHAT / HERO AREA */}
      <div className="main-content">
        {!showResult ? (
          /* ── HERO SECTION ── */
          <motion.div className="hero-section"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

            {/* Floating orbs */}
            <div className="hero-orbs">
              <div className="orb orb-1" />
              <div className="orb orb-2" />
              <div className="orb orb-3" />
            </div>

            <motion.div className="hero-badge"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span>✦</span> Powered by Google Gemini
            </motion.div>

            <motion.h1 className="hero-title"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              Hello, {isLoggedIn ? <span className="hero-name">{user?.name?.split(' ')[0]}</span> : <span className="hero-name">there</span>} 👋
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.p className="hero-subtitle" key={subtitleIdx}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}>
                {ROTATING_SUBTITLES[subtitleIdx]}
              </motion.p>
            </AnimatePresence>

            {/* Suggestion Cards */}
            <motion.div className="cards-grid"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              {SUGGESTIONS.map((s, i) => (
                <motion.button key={i} className="suggestion-card"
                  onClick={() => handleCardClick(s.text)}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(108,99,255,0.18)' }}
                  whileTap={{ scale: 0.97 }}>
                  <span className="card-emoji">{s.emoji}</span>
                  <span className="card-category">{s.category}</span>
                  <span className="card-text">{s.text}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          /* ── CHAT MESSAGES ── */
          <div className="messages-area">
            {messages.map((msg, i) => (
              <MessageBubble key={msg.id} msg={msg} isLast={i === messages.length - 1 && msg.role === 'ai'} />
            ))}
            {loading && <TypingDots />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <motion.div className="input-bar-wrap"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}>

        {/* Image preview chip */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div className="image-chip"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <img src={imagePreview} alt="preview" className="chip-thumb" />
              <span className="chip-name">Image attached</span>
              <button className="chip-remove" onClick={removeImage}>✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`input-box ${isListening ? 'listening' : ''}`}>
          {/* Gallery / image upload */}
          <motion.button
            className="input-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            title="Attach image"
          >
            🖼️
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />

          <textarea
            ref={textareaRef}
            className="input-textarea"
            placeholder={isListening ? '🎤 Listening...' : 'Message nano-ai...'}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          {/* Voice */}
          <motion.button
            className={`input-icon-btn mic-btn ${isListening ? 'mic-active' : ''}`}
            onClick={handleVoice}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            🎤
          </motion.button>

          {/* Send */}
          <AnimatePresence>
            {(input.trim() || imagePreview) && (
              <motion.button
                className="send-btn"
                onClick={handleSend}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Send"
              >
                ▶
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <p className="input-disclaimer">
          nano-ai can make mistakes. Verify important information.
        </p>
      </motion.div>
    </div>
  )
}

export default Main