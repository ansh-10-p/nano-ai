import React, { useState, useEffect, useContext } from 'react'
import './Main.css'
import { assets } from '../../../assets/assets'
import { motion, AnimatePresence } from 'framer-motion'
import { Context } from '../../../context/Context';



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
  // ✅ PULL VALUES FROM CONTEXT
  const { 
    onSent, 
    recentPrompt, 
    showResult, 
    loading, 
    resultData, 
    setInput, 
    input 
  } = useContext(Context);

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
    <motion.div className={`main ${dark ? 'dark' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* AUTH OVERLAY (Omitted for brevity - keep your existing code here) */}

      {/* NAVBAR */}
      <motion.div className="nav" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <p className="logo">NANO-AI</p>
        <motion.button className="theme-toggle" whileTap={{ scale: 0.85 }} onClick={() => setDark(prev => !prev)}>
          {dark ? '☀️' : '🌙'}
        </motion.button>
      </motion.div>

      {/* CONTENT */}
      <motion.div className="main-container" variants={containerVariants} initial="hidden" animate="show">
        
        {!showResult ? (
          // ✅ SHOW GREETING & CARDS IF NO PROMPT SENT
          <>
            <motion.div className="greet" variants={itemVariants}>
              <p className="hello">Hello, <span>Dev</span></p>
              <p className="subtext">How can I help you today?</p>
            </motion.div>

            <motion.div className="cards" variants={containerVariants}>
              {[
                { text: 'Suggest beautiful places for a road trip', icon: assets.compass_icon },
                { text: 'Improve readability of this code', icon: assets.code_icon },
              ].map((item, i) => (
                <motion.div 
                   className="card" 
                   key={i} 
                   variants={itemVariants} 
                   whileHover={{ y: -6, scale: 1.02 }}
                   onClick={() => { setInput(item.text); }} // ✅ Click card to set input
                >
                  <p>{item.text}</p>
                  <img src={item.icon} alt="" />
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          // ✅ SHOW AI RESULT IF PROMPT SENT
          <motion.div className="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="result-title">
              <img src={assets.user_icon} alt="user" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="ai" />
              {loading ? (
                <div className="loader">
                  <hr /><hr /><hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* MAIN BOTTOM SEARCH */}
      <motion.div className="main-bottom" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Enter your prompt" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} // ✅ Connect to Context
            onKeyDown={(e) => e.key === "Enter" && onSent()} // ✅ Send on Enter
          />
          <div className="search-icons">
            <img src={assets.gallery_icon} alt="gallery" />
            <img src={assets.mic_icon} alt="mic" />
            {input ? (
                <motion.img 
                  src={assets.send_icon} 
                  alt="send" 
                  onClick={() => onSent()} 
                  whileTap={{ scale: 0.9 }}
                />
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Main