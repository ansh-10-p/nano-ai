import React, { useState, useContext } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { motion, AnimatePresence } from 'framer-motion'
import { Context } from '../../context/Context'

const Sidebar = ({ user, theme, toggleTheme, onLogout }) => {
  const [extended, setExtended] = useState(false)
  const { chatHistory, newChat, loadChat, currentChatId } = useContext(Context)

  const navItems = [
    { icon: assets.question_icon, label: 'Help', emoji: '❓' },
    { icon: assets.history_icon, label: 'Activity', emoji: '🕒' },
    { icon: assets.setting_icon, label: 'Settings', emoji: '⚙️' },
  ]

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: extended ? 260 : 72 }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
    >
      {/* TOP */}
      <div className="sidebar-top">
        <motion.button
          className="menu-btn"
          onClick={() => setExtended(p => !p)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle sidebar"
        >
          <span className="menu-icon">☰</span>
        </motion.button>

        <motion.button
          className="new-chat"
          onClick={newChat}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          title="New Chat"
        >
          <span className="new-chat-icon">✦</span>
          <AnimatePresence>
            {extended && (
              <motion.span
                className="new-chat-label"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* RECENT CHATS */}
      <div className="sidebar-middle">
        <AnimatePresence>
          {extended && (
            <motion.div
              className="sidebar-recent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="recent-title">Recent</p>
              {chatHistory.length === 0 ? (
                <div className="recent-empty">
                  <span>💬</span>
                  <p>No chats yet</p>
                </div>
              ) : (
                chatHistory.slice().reverse().map((chat, index) => (
                  <motion.button
                    key={chat.id}
                    className={`recent-entry ${currentChatId === chat.id ? 'active' : ''}`}
                    onClick={() => loadChat(chat.id)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ x: 4 }}
                  >
                    <span className="recent-dot" />
                    <span className="recent-text">
                      {chat.prompt.length > 22 ? chat.prompt.substring(0, 22) + '…' : chat.prompt}
                    </span>
                  </motion.button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        {/* Theme toggle */}
        <motion.button
          className="bottom-item theme-item"
          onClick={toggleTheme}
          whileHover={{ x: extended ? 4 : 0, scale: extended ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <span className="bottom-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          <AnimatePresence>
            {extended && (
              <motion.span
                className="bottom-label"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {navItems.map((item, index) => (
          <motion.button
            key={index}
            className="bottom-item"
            whileHover={{ x: extended ? 4 : 0, scale: extended ? 1 : 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={item.label}
          >
            <span className="bottom-icon">{item.emoji}</span>
            <AnimatePresence>
              {extended && (
                <motion.span
                  className="bottom-label"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}

        {/* User Avatar */}
        <div className="sidebar-user">
          <motion.div
            className="user-avatar"
            whileHover={{ scale: 1.08 }}
            title={user?.name || 'User'}
          >
            {user?.avatar || 'U'}
          </motion.div>
          <AnimatePresence>
            {extended && (
              <motion.div
                className="user-info"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="user-name">{user?.name || 'User'}</span>
                <button className="logout-btn" onClick={onLogout}>Sign out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar