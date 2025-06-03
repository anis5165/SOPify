'use client'
import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)
        return
      }

      // Verify token with backend
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.user)
      } else {
        // If token is invalid, clear it
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password
      })

      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('token', token)
        setIsAuthenticated(true)
        setUser(user)
        return { success: true }
      }
      return { success: false, message: response.data.message }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, userData)

      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('token', token)
        setIsAuthenticated(true)
        setUser(user)
        return { success: true }
      }
      return { success: false, message: response.data.message }
    } catch (error) {
      console.error('Signup failed:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed. Please try again.'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
    checkAuthStatus
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
} 