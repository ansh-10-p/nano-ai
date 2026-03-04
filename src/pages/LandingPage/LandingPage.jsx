import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    RiSparklingFill, RiMoonLine, RiSunLine,
    RiArrowRightLine, RiBrainLine, RiCodeSSlashLine,
    RiPenNibLine, RiMapPinLine, RiCheckLine,
    RiUser3Line, RiLockLine, RiMailLine, RiEyeLine,
    RiEyeOffLine, RiLoginBoxLine, RiUserAddLine,
    RiGlobalLine, RiShieldCheckLine, RiThunderstormsLine
} from 'react-icons/ri'
import { SiGoogle, SiGithub } from 'react-icons/si'
import './LandingPage.css'

const FEATURES = [
    { icon: <RiBrainLine />, title: 'Smart Responses', desc: 'Powered by Google Gemini with deep reasoning capabilities' },
    { icon: <RiCodeSSlashLine />, title: 'Code Assistant', desc: 'Write, review, and debug code across all languages' },
    { icon: <RiGlobalLine />, title: 'Multi-lingual', desc: 'Communicate and get answers in any language' },
    { icon: <RiShieldCheckLine />, title: 'Private & Secure', desc: 'Your conversations stay private and encrypted' },
]

const ROTATING = ['Think smarter.', 'Code faster.', 'Write better.', 'Learn deeper.']

const AuthModal = ({ onClose, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', password: '' })

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        onLogin({ name: form.name || form.email.split('@')[0], email: form.email, avatar: (form.name || form.email)[0]?.toUpperCase() })
    }

    const handleDemo = async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 500))
        onLogin({ name: 'Demo User', email: 'demo@nano-ai.app', avatar: 'D' })
    }

    return (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div className="auth-modal"
                initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>

                <div className="auth-modal-bar" />
                <div className="auth-modal-inner">
                    <div className="modal-header">
                        <div className="modal-brand"><RiSparklingFill /> nano<b>ai</b></div>
                        <AnimatePresence mode="wait">
                            <motion.div key={isLogin ? 'li' : 'su'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
                                <p>{isLogin ? 'Sign in to continue your journey' : 'Start free — no credit card needed'}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.button className="demo-btn" onClick={handleDemo} disabled={loading}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                        {loading ? <><span className="spin" /> Opening...</> : <><RiThunderstormsLine /> ⚡ Try Demo — No sign up needed</>}
                    </motion.button>

                    <div className="or-divider"><span>or continue with email</span></div>

                    <form onSubmit={handleSubmit} className="modal-form">
                        <AnimatePresence>
                            {!isLogin && (
                                <motion.label className="field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    <RiUser3Line className="field-icon" />
                                    <input type="text" name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
                                </motion.label>
                            )}
                        </AnimatePresence>
                        <label className="field">
                            <RiMailLine className="field-icon" />
                            <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
                        </label>
                        <label className="field">
                            <RiLockLine className="field-icon" />
                            <input type={showPw ? 'text' : 'password'} name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                            <button type="button" className="eye-btn" onClick={() => setShowPw(p => !p)}>
                                {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                            </button>
                        </label>
                        <motion.button type="submit" className="submit-btn" disabled={loading}
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                            {loading ? <><span className="spin" /> Working...</> : isLogin ? <><RiLoginBoxLine /> Sign in</> : <><RiUserAddLine /> Create account</>}
                        </motion.button>
                    </form>

                    <div className="social-row">
                        <button className="social-btn"><SiGoogle size={15} /> Google</button>
                        <button className="social-btn"><SiGithub size={15} /> GitHub</button>
                    </div>

                    <p className="toggle-text">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button type="button" onClick={() => setIsLogin(p => !p)}>{isLogin ? ' Sign up' : ' Sign in'}</button>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

const LandingPage = ({ theme, toggleTheme, isLoggedIn, user, onLogin, onLogout }) => {
    const navigate = useNavigate()
    const [showAuth, setShowAuth] = useState(false)
    const [rotIdx, setRotIdx] = useState(0)

    useEffect(() => {
        const t = setInterval(() => setRotIdx(i => (i + 1) % ROTATING.length), 2800)
        return () => clearInterval(t)
    }, [])

    const handleLogin = (userData) => { onLogin(userData); setShowAuth(false) }

    const handleGetStarted = () => {
        if (isLoggedIn) navigate('/chat')
        else setShowAuth(true)
    }

    return (
        <div className="landing">
            <AnimatePresence>{showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}</AnimatePresence>

            {/* NAVBAR */}
            <nav className="landing-nav">
                <div className="landing-brand"><RiSparklingFill className="brand-icon" /> nano<b>ai</b></div>
                <div className="nav-actions">
                    <motion.button className="icon-btn" onClick={toggleTheme} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        {theme === 'dark' ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
                    </motion.button>
                    {isLoggedIn ? (
                        <div className="nav-user-row">
                            <div className="nav-avatar">{user?.avatar}</div>
                            <span className="nav-user-name">{user?.name?.split(' ')[0]}</span>
                            <motion.button className="nav-chat-btn" onClick={() => navigate('/chat')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                Open Chat <RiArrowRightLine />
                            </motion.button>
                            <button className="nav-logout" onClick={onLogout}>Sign out</button>
                        </div>
                    ) : (
                        <>
                            <button className="nav-signin" onClick={() => setShowAuth(true)}>Sign in</button>
                            <motion.button className="nav-cta" onClick={() => setShowAuth(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                Get started <RiArrowRightLine />
                            </motion.button>
                        </>
                    )}
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="glow glow-1" /><div className="glow glow-2" /><div className="glow glow-3" />
                </div>
                <motion.div className="hero-inner" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <motion.div className="hero-badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                        <RiSparklingFill /> Powered by Google Gemini
                    </motion.div>

                    <h1 className="hero-title">
                        Your AI that helps you<br />
                        <AnimatePresence mode="wait">
                            <motion.span key={rotIdx} className="rotating-word"
                                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                                transition={{ duration: 0.4 }}>
                                {ROTATING[rotIdx]}
                            </motion.span>
                        </AnimatePresence>
                    </h1>

                    <p className="hero-sub">
                        nano-ai is a blazing-fast, beautifully designed AI assistant.<br />
                        Chat, code, write, and explore — all in one place.
                    </p>

                    <div className="hero-cta-row">
                        <motion.button className="cta-primary" onClick={handleGetStarted}
                            whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(108,99,255,0.45)' }} whileTap={{ scale: 0.97 }}>
                            {isLoggedIn ? 'Open Chat' : 'Start for free'} <RiArrowRightLine />
                        </motion.button>
                        {!isLoggedIn && (
                            <motion.button className="cta-secondary" onClick={() => setShowAuth(true)}
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                <RiThunderstormsLine /> Try Demo
                            </motion.button>
                        )}
                    </div>

                    <div className="hero-proof">
                        <div className="proof-avatars">
                            {['A', 'B', 'C', 'D'].map((l, i) => <div key={i} className="proof-av" style={{ zIndex: 4 - i }}>{l}</div>)}
                        </div>
                        <span>Join 10,000+ users already using nano-ai</span>
                    </div>
                </motion.div>

                {/* floating card preview */}
                <motion.div className="hero-preview" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
                    <div className="preview-card">
                        <div className="preview-msg user-msg"><span>Explain quantum entanglement simply</span></div>
                        <div className="preview-msg ai-msg">
                            <div className="preview-ai-icon"><RiSparklingFill /></div>
                            <div className="preview-typing">
                                <div className="preview-line" style={{ width: '95%' }} />
                                <div className="preview-line" style={{ width: '80%' }} />
                                <div className="preview-line" style={{ width: '60%' }} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* FEATURES */}
            <section className="features-section">
                <motion.div className="features-inner" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    <h2 className="section-title">Everything you need</h2>
                    <p className="section-sub">Powerful features packed into a beautiful interface</p>
                    <div className="features-grid">
                        {FEATURES.map((f, i) => (
                            <motion.div key={i} className="feature-card"
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(108,99,255,0.14)' }}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* CTA BOTTOM */}
            <section className="cta-section">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2>Ready to get started?</h2>
                    <p>Join thousands of users and start chatting with nano-ai today.</p>
                    <motion.button className="cta-primary large" onClick={handleGetStarted} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        {isLoggedIn ? 'Open Chat' : 'Get started free'} <RiArrowRightLine />
                    </motion.button>
                </motion.div>
            </section>

            <footer className="landing-footer">
                <span><RiSparklingFill /> nano-ai</span>
                <span>Built with Google Gemini · {new Date().getFullYear()}</span>
            </footer>
        </div>
    )
}

export default LandingPage
