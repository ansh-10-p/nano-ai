import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './auth.css'

const Auth = ({ onLogin, theme, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    onLogin({ name: formData.name || formData.email.split('@')[0], email: formData.email, avatar: (formData.name || formData.email)[0].toUpperCase() })
  }

  const handleDemo = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    onLogin({ name: 'Demo User', email: 'demo@nano-ai.app', avatar: 'D' })
  }

  return (
    <div className="auth-page">
      {/* Animated background blobs */}
      <div className="auth-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Theme toggle top-right */}
      <motion.button
        className="auth-theme-btn"
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </motion.button>

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">✦</div>
          <span className="auth-logo-text">nano<span>ai</span></span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="auth-title">{isLogin ? 'Welcome back' : 'Create account'}</h1>
            <p className="auth-subtitle">
              {isLogin ? 'Sign in to continue your conversations' : 'Join nano-ai to get started for free'}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Demo login */}
        <motion.button
          className="demo-btn"
          onClick={handleDemo}
          disabled={loading}
          whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(108,99,255,0.35)' }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="demo-icon">⚡</span>
          {loading ? 'Opening...' : 'Try Demo — No signup needed'}
        </motion.button>

        <div className="auth-divider"><span>or continue with email</span></div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                className="input-group"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {isLogin && (
            <div className="auth-forgot">
              <span>Forgot password?</span>
            </div>
          )}

          <motion.button
            type="submit"
            className="primary-auth-btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="btn-loader">
                <span /><span /><span />
              </span>
            ) : (isLogin ? 'Sign in' : 'Create account')}
          </motion.button>
        </form>

        {/* Social buttons */}
        <div className="social-row">
          <motion.button className="social-btn" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            Google
          </motion.button>
          <motion.button className="social-btn" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
            GitHub
          </motion.button>
        </div>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={() => setIsLogin(p => !p)}>
            {isLogin ? ' Sign up' : ' Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}

export default Auth
