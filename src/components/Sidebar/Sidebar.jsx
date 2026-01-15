import React, { useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { motion, AnimatePresence } from 'framer-motion'

const recentChats = [
  'What is React?',
  'Explain useState',
  'React vs Vue',
]

const Sidebar = () => {
  const [extended, setExtended] = useState(false)
  const [active, setActive] = useState(0)

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: extended ? 260 : 72 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
     
      <div className="sidebar-top">
        <motion.img
          src={assets.menu_icon}
          alt="Toggle menu"
          className="menu-btn"
          onClick={() => setExtended(prev => !prev)}
          animate={{ rotate: extended ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        />

        <motion.button
          className="new-chat"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <img src={assets.plus_icon} alt="" />
          <AnimatePresence>
            {extended && (
              <motion.span
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      
      <AnimatePresence>
        {extended && (
          <motion.div
            className="sidebar-recent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="recent-title">Recent</p>

            {recentChats.map((chat, index) => (
              <motion.div
                key={index}
                className={`recent-entry ${
                  active === index ? 'active' : ''
                }`}
                onClick={() => setActive(index)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 6 }}
              >
                <img src={assets.message_icon} alt="" />
                <span>{chat}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>


      <div className="sidebar-bottom">
        {[
          { icon: assets.question_icon, label: 'Help' },
          { icon: assets.history_icon, label: 'Activity' },
          { icon: assets.setting_icon, label: 'Settings' },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="bottom-item"
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.96 }}
          >
            <img src={item.icon} alt="" />
            <AnimatePresence>
              {extended && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  )
}

export default Sidebar
