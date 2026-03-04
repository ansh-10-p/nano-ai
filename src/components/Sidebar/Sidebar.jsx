import React, { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiSparklingFill, RiMenuLine, RiAddLine,
  RiHistoryLine, RiQuestionLine, RiSettings4Line,
  RiSunLine, RiMoonLine, RiLogoutBoxLine,
  RiChatSmile3Line
} from 'react-icons/ri'
import './Sidebar.css'
import { Context } from '../../context/Context'

const Sidebar = ({ user, theme, toggleTheme, onLogout }) => {
  const [expanded, setExpanded] = useState(false)
  const { chatHistory, newChat, loadChat, currentChatId } = useContext(Context)

  const bottomItems = [
    { icon: <RiQuestionLine size={19} />, label: 'Help' },
    { icon: <RiHistoryLine size={19} />, label: 'Activity' },
    { icon: <RiSettings4Line size={19} />, label: 'Settings' },
  ]

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: expanded ? 252 : 64 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* TOP */}
      <div className="sb-top">
        <motion.button className="sb-icon-btn" onClick={() => setExpanded(p => !p)}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} title="Toggle sidebar">
          <RiMenuLine size={20} />
        </motion.button>

        <motion.button className="sb-new-chat" onClick={newChat}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} title="New chat">
          <RiAddLine size={18} className="sb-nc-icon" />
          <AnimatePresence>
            {expanded && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
                New Chat
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* RECENT */}
      <div className="sb-middle">
        <AnimatePresence>
          {expanded && (
            <motion.div className="sb-recent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="sb-section-label">Recent</p>
              {chatHistory.length === 0 ? (
                <div className="sb-empty">
                  <RiChatSmile3Line size={24} />
                  <span>No chats yet</span>
                </div>
              ) : (
                chatHistory.slice().reverse().map((chat, i) => (
                  <motion.button key={chat.id}
                    className={`sb-chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                    onClick={() => loadChat(chat.id)}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    whileHover={{ x: 3 }}>
                    <span className="sb-chat-dot" />
                    <span className="sb-chat-label">
                      {chat.prompt.length > 24 ? chat.prompt.slice(0, 24) + '…' : chat.prompt}
                    </span>
                  </motion.button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM */}
      <div className="sb-bottom">
        {/* Theme toggle */}
        <motion.button className="sb-icon-btn" onClick={toggleTheme}
          whileHover={{ scale: expanded ? 1 : 1.08, x: expanded ? 3 : 0 }}
          whileTap={{ scale: 0.92 }} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
          {theme === 'dark' ? <RiSunLine size={19} /> : <RiMoonLine size={19} />}
          <AnimatePresence>
            {expanded && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {bottomItems.map((item, i) => (
          <motion.button key={i} className="sb-icon-btn"
            whileHover={{ scale: expanded ? 1 : 1.08, x: expanded ? 3 : 0 }}
            whileTap={{ scale: 0.92 }} title={item.label}>
            {item.icon}
            <AnimatePresence>
              {expanded && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}

        {/* User & Logout */}
        <div className="sb-user-row">
          <motion.div className="sb-avatar" whileHover={{ scale: 1.08 }} title={user?.name}>
            {user?.avatar || <RiSparklingFill size={14} />}
          </motion.div>
          <AnimatePresence>
            {expanded && (
              <motion.div className="sb-user-info" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                <span className="sb-user-name">{user?.name || 'User'}</span>
                <button className="sb-logout" onClick={onLogout}><RiLogoutBoxLine size={13} /> Sign out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar