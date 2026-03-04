import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage'
import ChatPage from './pages/ChatPage/ChatPage'
import ContextProvider from './context/Context'

const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const handleLogin = (userData) => {
    const u = userData || { name: 'Demo User', email: 'demo@nano-ai.app', avatar: 'D' }
    setUser(u)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                theme={theme}
                toggleTheme={toggleTheme}
                isLoggedIn={isLoggedIn}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <ChatPage
                theme={theme}
                toggleTheme={toggleTheme}
                isLoggedIn={isLoggedIn}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  )
}

export default App