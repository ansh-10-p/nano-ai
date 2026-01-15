import React, { useState, useEffect } from 'react'
import './Main.css'
import { assets } from '../../../assets/assets'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [dark, setDark] = useState(false)

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') setDark(true)
  }, [])

  // Persist theme
  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <motion.div
      className={`main ${dark ? 'dark' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* AUTH OVERLAY */}
      <AnimatePresence>
        {!isLoggedIn && (
          <motion.div
            className="auth-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="auth-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <h2>{isSignup ? 'Create account' : 'Welcome back'}</h2>
              <p className="auth-sub">
                {isSignup
                  ? 'Join Nano-AI to continue'
                  : 'Sign in to use Nano-AI'}
              </p>

              {isSignup && <input type="text" placeholder="Full name" />}
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />

              <motion.button
                className="auth-btn"
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsLoggedIn(true)}
              >
                {isSignup ? 'Sign up' : 'Sign in'}
              </motion.button>

              <p className="auth-toggle">
                {isSignup ? 'Already have an account?' : 'New to Nano-AI?'}
                <span onClick={() => setIsSignup(prev => !prev)}>
                  {isSignup ? ' Sign in' : ' Create one'}
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.div
        className="nav"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <p className="logo">NANO-AI</p>

        <motion.button
          className="theme-toggle"
          whileTap={{ scale: 0.85 }}
          onClick={() => setDark(prev => !prev)}
        >
          {dark ? '☀️' : '🌙'}
        </motion.button>
      </motion.div>

      {/* CONTENT */}
      <motion.div
        className="main-container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="greet" variants={itemVariants}>
          <p className="hello">
            Hello, <span>Dev</span>
          </p>
          <p className="subtext">How can I help you today?</p>
        </motion.div>

        <motion.div className="cards" variants={containerVariants}>
          {[
            {
              text: 'Suggest beautiful places for a road trip',
              icon: assets.compass_icon,
            },
            {
              text: 'Summarize the concept of urban planning',
              icon: assets.bulb_icon,
            },
            {
              text: 'Brainstorm team bonding activities',
              icon: assets.message_icon,
            },
            {
              text: 'Improve readability of this code',
              icon: assets.code_icon,
            },
          ].map((item, i) => (
            <motion.div
              className="card"
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p>{item.text}</p>
              <img src={item.icon} alt="" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* MAIN BOTTOM SEARCH */}
      <motion.div
        className="main-bottom"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="search-box">
          <input type="text" placeholder="Enter your prompt" />
          <div className="search-icons">
            <img src={assets.gallery_icon} alt="gallery" />
            <img src={assets.mic_icon} alt="mic" />
            <img src={assets.send_icon} alt="send" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Main
