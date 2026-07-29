import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { isTokenExpired, getTimeUntilMidnight } from '../utils/token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      if (isTokenExpired(token)) {
        logout()
      } else {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          logout()
        }
      }
    }
    setLoading(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-logout saat token expired atau tengah malam
  useEffect(() => {
    if (!token) return

    if (isTokenExpired(token)) {
      logout()
      return
    }

    // Check setiap 60 detik
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        logout()
      }
    }, 60000)

    // Auto-logout saat tengah malam
    const midnightTimeout = setTimeout(() => {
      logout()
    }, getTimeUntilMidnight())

    return () => {
      clearInterval(interval)
      clearTimeout(midnightTimeout)
    }
  }, [token, logout])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data.data
      
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setToken(newToken)
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login gagal'
      return { success: false, message }
    }
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}