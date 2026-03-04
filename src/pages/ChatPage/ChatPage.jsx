import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RiSparklingFill, RiSendPlaneFill, RiImageAddLine,
    RiMicLine, RiMicOffLine, RiMoonLine, RiSunLine,
    RiArrowLeftLine, RiUser3Line, RiCloseLine,
    RiFileCopyLine, RiCheckLine, RiSettings4Line,
    RiThumbUpLine, RiThumbDownLine, RiRefreshLine,
    RiTranslate2, RiPaletteLine, RiFontSize,
    RiGlobalLine, RiShieldLine, RiBrushLine,
    RiVolumeUpLine, RiSaveLine, RiKeyLine,
} from 'react-icons/ri'
import './ChatPage.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import { Context } from '../../context/Context'

const SUGGESTIONS = [
    { icon: '🌍', category: 'Travel', text: 'Suggest beautiful places for a road trip' },
    { icon: '💻', category: 'Code', text: 'Improve readability of my code snippet' },
    { icon: '✍️', category: 'Write', text: 'Help me write a compelling cover letter' },
    { icon: '🧠', category: 'Learn', text: 'Explain quantum computing in simple terms' },
]
const SUBTITLES = ['How can I help you today?', 'Ask me anything…', "Let's build something.", 'Your AI is ready.']

/* ─── Parse markdown-ish HTML into richer blocks ─── */
const parseContent = (html) => {
    // detect code blocks wrapped in <code>
    const hasCode = html.includes('<code>') || html.includes('```')
    return { html, hasCode }
}

/* ─── Copy button ─── */
const CopyBtn = ({ text }) => {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        const plain = text.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        navigator.clipboard.writeText(plain).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }
    return (
        <motion.button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} title="Copy response">
            {copied ? <><RiCheckLine size={13} /> Copied!</> : <><RiFileCopyLine size={13} /> Copy</>}
        </motion.button>
    )
}

/* ─── Typewriter ─── */
const TypedMessage = ({ html, onDone }) => {
    const [shown, setShown] = useState('')
    const [done, setDone] = useState(false)
    useEffect(() => {
        setShown(''); setDone(false)
        const len = html.replace(/<[^>]+>/g, '').length || 1
        let i = 0
        const id = setInterval(() => {
            i += Math.ceil(len / 60)
            const ratio = Math.min(i / len, 1)
            setShown(html.substring(0, Math.floor(html.length * ratio)))
            if (ratio >= 1) {
                setShown(html); setDone(true)
                clearInterval(id)
                onDone?.()
            }
        }, 24)
        return () => clearInterval(id)
    }, [html])
    return <p className="ai-text" dangerouslySetInnerHTML={{ __html: done ? html : shown }} />
}

/* ─── Single message bubble ─── */
const Bubble = ({ msg, isLast, userAvatar }) => {
    const isUser = msg.role === 'user'
    const [liked, setLiked] = useState(null) // null | 'up' | 'down'
    const [typingDone, setTypingDone] = useState(!isLast)

    return (
        <div className={`bubble-row ${isUser ? 'row-user' : 'row-ai'}`}>
            {/* AI avatar */}
            {!isUser && (
                <div className="msg-avatar ai-msg-avatar">
                    <RiSparklingFill size={15} />
                </div>
            )}

            <div className="bubble-wrapper">
                {/* Bubble */}
                <motion.div
                    className={`bubble-content ${isUser ? 'bubble-user' : 'bubble-ai'}`}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.24 }}
                >
                    {msg.image && <img src={msg.image} alt="attachment" className="bubble-img" />}

                    {isUser
                        ? <p className="user-text">{msg.content}</p>
                        : isLast
                            ? <TypedMessage html={msg.content} onDone={() => setTypingDone(true)} />
                            : <p className="ai-text" dangerouslySetInnerHTML={{ __html: msg.content }} />
                    }

                    <span className="bubble-ts">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                </motion.div>

                {/* AI action bar */}
                {!isUser && typingDone && (
                    <motion.div className="ai-actions"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <CopyBtn text={msg.content} />
                        <button className={`action-icon-btn ${liked === 'up' ? 'active-up' : ''}`}
                            onClick={() => setLiked(p => p === 'up' ? null : 'up')} title="Good response">
                            <RiThumbUpLine size={13} />
                        </button>
                        <button className={`action-icon-btn ${liked === 'down' ? 'active-down' : ''}`}
                            onClick={() => setLiked(p => p === 'down' ? null : 'down')} title="Bad response">
                            <RiThumbDownLine size={13} />
                        </button>
                    </motion.div>
                )}
            </div>

            {/* User avatar */}
            {isUser && (
                <div className="msg-avatar user-msg-avatar">
                    {userAvatar || <RiUser3Line size={14} />}
                </div>
            )}
        </div>
    )
}

/* ─── Typing dots ─── */
const TypingDots = () => (
    <motion.div className="typing-row" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="msg-avatar ai-msg-avatar"><RiSparklingFill size={15} /></div>
        <div className="typing-dots-bubble"><span /><span /><span /></div>
        <span className="typing-label">nano-ai is thinking…</span>
    </motion.div>
)

/* ─── Settings Panel ─── */
const SettingsPanel = ({ theme, toggleTheme, onClose }) => {
    const [fontSize, setFontSize] = useState('medium')
    const [lang, setLang] = useState('en')

    const sections = [
        {
            icon: <RiBrushLine />, title: 'Appearance',
            items: [
                {
                    label: 'Theme', desc: 'Switch between light and dark mode',
                    control: (
                        <button className="settings-toggle" onClick={toggleTheme}>
                            {theme === 'dark' ? <><RiSunLine size={14} /> Light</> : <><RiMoonLine size={14} /> Dark</>}
                        </button>
                    )
                },
                {
                    label: 'Font Size', desc: 'Adjust the chat text size',
                    control: (
                        <div className="settings-segmented">
                            {['small', 'medium', 'large'].map(s => (
                                <button key={s} className={fontSize === s ? 'seg-active' : ''} onClick={() => setFontSize(s)}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    )
                }
            ]
        },
        {
            icon: <RiGlobalLine />, title: 'Language & Region',
            items: [
                {
                    label: 'Response Language', desc: 'Preferred language for AI responses',
                    control: (
                        <select className="settings-select" value={lang} onChange={e => setLang(e.target.value)}>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="ja">Japanese</option>
                        </select>
                    )
                }
            ]
        },
        {
            icon: <RiShieldLine />, title: 'Privacy & Data',
            items: [
                {
                    label: 'Chat History', desc: 'Your chats are stored locally in this browser only',
                    control: <span className="settings-badge">Local only</span>
                },
                {
                    label: 'Clear History', desc: 'Remove all stored conversations',
                    control: (
                        <button className="settings-danger-btn" onClick={() => { localStorage.clear(); window.location.reload() }}>
                            Clear all
                        </button>
                    )
                }
            ]
        },
        {
            icon: <RiKeyLine />, title: 'API',
            items: [
                {
                    label: 'Model', desc: 'Google Gemini model in use',
                    control: <span className="settings-badge">gemini-2.5-flash</span>
                }
            ]
        }
    ]

    return (
        <motion.div className="settings-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div className="settings-drawer"
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 32 }}>

                <div className="settings-header">
                    <div className="settings-title"><RiSettings4Line size={18} /> Settings</div>
                    <button className="settings-close" onClick={onClose}><RiCloseLine size={20} /></button>
                </div>

                <div className="settings-body">
                    {sections.map((sec, si) => (
                        <div key={si} className="settings-section">
                            <div className="settings-section-title">{sec.icon} {sec.title}</div>
                            {sec.items.map((item, ii) => (
                                <div key={ii} className="settings-row">
                                    <div className="settings-row-info">
                                        <span className="settings-row-label">{item.label}</span>
                                        <span className="settings-row-desc">{item.desc}</span>
                                    </div>
                                    <div className="settings-row-control">{item.control}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}

/* ─── Quick auth ─── */
const QuickAuth = ({ onDemoLogin, onGoSignIn }) => (
    <motion.div className="quick-auth-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="quick-auth-card"
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
            <div className="qa-icon-wrap"><RiSparklingFill size={26} /></div>
            <h3>Sign in to chat</h3>
            <p>Try the demo instantly — no account needed.</p>
            <motion.button className="qa-demo-btn" onClick={onDemoLogin} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                ⚡ Try Demo instantly
            </motion.button>
            <button className="qa-link-btn" onClick={onGoSignIn}>Go to sign in →</button>
        </motion.div>
    </motion.div>
)

/* ════════════════ MAIN COMPONENT ════════════════ */
const ChatPage = ({ theme, toggleTheme, isLoggedIn, user, onLogin, onLogout }) => {
    const navigate = useNavigate()
    const { onSent, showResult, loading, messages, setInput, input, attachedImage, setAttachedImage } = useContext(Context)

    const [subIdx, setSubIdx] = useState(0)
    const [isListening, setIsListening] = useState(false)
    const [imgPreview, setImgPreview] = useState(null)
    const [showQuickAuth, setShowQuickAuth] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const bottomRef = useRef(null)
    const fileRef = useRef(null)
    const taRef = useRef(null)
    const recogRef = useRef(null)

    useEffect(() => {
        const t = setInterval(() => setSubIdx(i => (i + 1) % SUBTITLES.length), 3000)
        return () => clearInterval(t)
    }, [])

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

    const handleInputChange = e => {
        setInput(e.target.value)
        const ta = taRef.current
        if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 140) + 'px' }
    }

    const handleSend = () => {
        if (!input.trim() && !attachedImage) return
        if (!isLoggedIn) { setShowQuickAuth(true); return }
        onSent()
        if (taRef.current) taRef.current.style.height = 'auto'
    }

    const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

    const handleCardClick = text => {
        if (!isLoggedIn) { setInput(text); setShowQuickAuth(true); return }
        setInput(text)
        setTimeout(() => onSent(text), 40)
    }

    const handleImageSelect = e => {
        const file = e.target.files[0]; if (!file) return
        const url = URL.createObjectURL(file)
        setAttachedImage({ file, url }); setImgPreview(url)
    }

    const removeImage = () => {
        setAttachedImage(null); setImgPreview(null)
        if (fileRef.current) fileRef.current.value = ''
    }

    const handleVoice = useCallback(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SR) { alert('Voice input requires Chrome or Edge.'); return }
        if (isListening) { recogRef.current?.stop(); setIsListening(false); return }
        const r = new SR()
        recogRef.current = r; r.lang = 'en-US'; r.interimResults = true; r.continuous = false
        r.onstart = () => setIsListening(true)
        r.onresult = e => { let t = ''; for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript; setInput(t) }
        r.onend = () => setIsListening(false)
        r.onerror = () => setIsListening(false)
        r.start()
    }, [isListening, setInput])

    const handleDemoLogin = async () => {
        await new Promise(r => setTimeout(r, 400))
        onLogin({ name: 'Demo User', email: 'demo@nano-ai.app', avatar: 'D' })
        setShowQuickAuth(false)
    }

    return (
        <div className="chat-page">
            <Sidebar user={user} theme={theme} toggleTheme={toggleTheme} onLogout={onLogout} />

            <div className="chat-main">
                {/* TOP BAR */}
                <header className="chat-topbar">
                    <div className="topbar-left">
                        <motion.button className="topbar-icon-btn" onClick={() => navigate('/')}
                            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} title="Home">
                            <RiArrowLeftLine size={18} />
                        </motion.button>
                        <div className="topbar-brand">
                            <RiSparklingFill className="brand-star" />
                            <span>nano<b>ai</b></span>
                        </div>
                    </div>

                    <div className="topbar-right">
                        <motion.button className="topbar-icon-btn" onClick={() => setShowSettings(true)}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Settings">
                            <RiSettings4Line size={18} />
                        </motion.button>
                        <motion.button className="topbar-icon-btn" onClick={toggleTheme}
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
                            {theme === 'dark' ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
                        </motion.button>
                        {isLoggedIn ? (
                            <div className="topbar-user">
                                <div className="topbar-avatar">{user?.avatar}</div>
                                <span className="topbar-name">{user?.name?.split(' ')[0]}</span>
                                <button className="topbar-logout" onClick={onLogout}>Sign out</button>
                            </div>
                        ) : (
                            <button className="topbar-signin-btn" onClick={() => navigate('/')}>Sign in</button>
                        )}
                    </div>
                </header>

                {/* SCROLLABLE BODY */}
                <div className="chat-body">
                    <AnimatePresence>
                        {showQuickAuth && !isLoggedIn && (
                            <QuickAuth onDemoLogin={handleDemoLogin} onGoSignIn={() => { navigate('/'); setShowQuickAuth(false) }} />
                        )}
                    </AnimatePresence>

                    {!showResult ? (
                        <motion.div className="chat-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="hero-orb hero-orb-1" /><div className="hero-orb hero-orb-2" />

                            <motion.div className="hero-badge" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <RiSparklingFill /> Powered by Google Gemini
                            </motion.div>

                            <motion.h1 className="hero-greeting" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                                Hello, <span className="gradient-text">{isLoggedIn ? user?.name?.split(' ')[0] : 'there'}</span> 👋
                            </motion.h1>

                            <AnimatePresence mode="wait">
                                <motion.p className="hero-sub" key={subIdx}
                                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                                    {SUBTITLES[subIdx]}
                                </motion.p>
                            </AnimatePresence>

                            <div className="sug-grid">
                                {SUGGESTIONS.map((s, i) => (
                                    <motion.button key={i} className="sug-card" onClick={() => handleCardClick(s.text)}
                                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.28 + i * 0.07 }}
                                        whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(108,99,255,.16)' }}
                                        whileTap={{ scale: 0.97 }}>
                                        <span className="sug-emoji">{s.icon}</span>
                                        <span className="sug-cat">{s.category}</span>
                                        <span className="sug-text">{s.text}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="messages-list">
                            {messages.map((m, i) => (
                                <Bubble key={m.id} msg={m}
                                    isLast={i === messages.length - 1 && m.role === 'ai'}
                                    userAvatar={user?.avatar} />
                            ))}
                            {loading && <TypingDots />}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </div>

                {/* INPUT FOOTER */}
                <div className="chat-footer">
                    <AnimatePresence>
                        {imgPreview && (
                            <motion.div className="img-chip"
                                initial={{ opacity: 0, y: 6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.9 }}>
                                <img src={imgPreview} alt="preview" />
                                <span>Image attached</span>
                                <button onClick={removeImage}><RiCloseLine size={15} /></button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={`input-row ${isListening ? 'input-listening' : ''}`}>
                        <motion.button className="input-action-btn" title="Attach image"
                            onClick={() => fileRef.current?.click()} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                            <RiImageAddLine size={19} />
                        </motion.button>
                        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageSelect} />

                        <textarea ref={taRef} className="input-textarea" rows={1}
                            placeholder={isListening ? '🎤 Listening…' : 'Message nano-ai…'}
                            value={input} onChange={handleInputChange} onKeyDown={handleKey} />

                        <motion.button className={`input-action-btn mic-btn ${isListening ? 'mic-active' : ''}`}
                            title={isListening ? 'Stop' : 'Voice input'} onClick={handleVoice}
                            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                            {isListening ? <RiMicOffLine size={19} /> : <RiMicLine size={19} />}
                        </motion.button>

                        <AnimatePresence>
                            {(input.trim() || imgPreview) && (
                                <motion.button className="send-btn" onClick={handleSend}
                                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <RiSendPlaneFill size={16} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                    <p className="input-hint">nano-ai can make mistakes. Verify important info. Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line.</p>
                </div>
            </div>

            {/* SETTINGS DRAWER */}
            <AnimatePresence>
                {showSettings && (
                    <SettingsPanel theme={theme} toggleTheme={toggleTheme} onClose={() => setShowSettings(false)} />
                )}
            </AnimatePresence>
        </div>
    )
}

export default ChatPage
